import type { CalendarEvent } from "./calendarService.js";
import { classifyCalendarEvent } from "./calendarClassificationService.js";
import { WorkspaceItem } from "../models/WorkspaceItem.js";
import { generateCommitment } from "./commitmentGenerationService.js";
import type { Types } from "mongoose";

export interface CalendarProcessingResult {
  created: Array<{ id: string; title: string }>;
  updated: Array<{ id: string; title: string }>;
  skipped: Array<{ eventId: string; reason: string }>;
  commitmentsGenerated: number;
}

/**
 * Process calendar events into workspace items
 * - Creates new workspace items for events that don't exist
 * - Updates existing workspace items if event details changed
 * - Skips irrelevant events (cancelled, past, etc.)
 */
export async function processCalendarEvents(
  events: CalendarEvent[],
  userId: Types.ObjectId
): Promise<CalendarProcessingResult> {
  const results: CalendarProcessingResult = {
    created: [],
    updated: [],
    skipped: [],
    commitmentsGenerated: 0,
  };

  for (const event of events) {
    try {
      // Step 1: Classify the event
      const classification = classifyCalendarEvent(event);

      // Skip irrelevant events
      if (!classification.isRelevant) {
        results.skipped.push({
          eventId: event.id,
          reason: classification.reason,
        });
        continue;
      }

      // Step 2: Check if workspace item already exists for this calendar event
      const existingItem = await WorkspaceItem.findOne({
        userId,
        sourceCalendarEventId: event.id,
      });

      if (existingItem) {
        // UPDATE existing item
        const updated = await updateWorkspaceItemFromEvent(
          existingItem,
          event,
          classification
        );

        if (updated) {
          results.updated.push({
            id: existingItem._id.toString(),
            title: existingItem.title,
          });
        }
      } else {
        // CREATE new workspace item
        const newItem = await createWorkspaceItemFromEvent(
          event,
          classification,
          userId
        );

        results.created.push({
          id: newItem._id.toString(),
          title: newItem.title,
        });

        // Calendar events are actionable (need to attend) - always generate commitment
        try {
          const commitmentResult = await generateCommitment(newItem);
          if (commitmentResult.outcome === "created") {
            results.commitmentsGenerated++;
            console.log(`✓ Generated commitment for calendar event: "${newItem.title}"`);
          }
        } catch (error) {
          console.error(`Failed to generate commitment for "${newItem.title}":`, error);
        }
      }
    } catch (error) {
      console.error(`Failed to process calendar event ${event.id}:`, error);
      results.skipped.push({
        eventId: event.id,
        reason: `Processing error: ${error}`,
      });
    }
  }

  return results;
}

/**
 * Create a new workspace item from a calendar event
 */
async function createWorkspaceItemFromEvent(
  event: CalendarEvent,
  classification: any,
  userId: Types.ObjectId
) {
  // Determine status based on event timing
  const now = new Date();
  const status = event.startDate > now ? "upcoming" : "active";

  // Determine priority (could be enhanced with more logic)
  const priority = determinePriority(event);

  // Build description
  const description = buildDescription(event, classification);

  const item = await WorkspaceItem.create({
    title: classification.title,
    description,
    type: classification.type, // "event"
    status,
    priority,
    source: "Google Calendar",
    sourceCalendarEventId: event.id,
    eventDate: event.startDate,
    deadline: event.startDate, // For events, deadline = event date
    contextHistory: [
      {
        date: new Date(),
        summary: `Event created: ${event.summary}`,
        emailId: event.id, // Reusing emailId field for calendar event ID
      },
    ],
    userId,
  });

  return item;
}

/**
 * Update an existing workspace item with latest calendar event details
 */
async function updateWorkspaceItemFromEvent(
  item: any,
  event: CalendarEvent,
  classification: any
): Promise<boolean> {
  let hasChanges = false;

  // Update title if changed
  if (item.title !== classification.title) {
    item.title = classification.title;
    hasChanges = true;
  }

  // Update description with latest event details
  const newDescription = buildDescription(event, classification);
  if (item.description !== newDescription) {
    item.description = newDescription;
    hasChanges = true;
  }

  // Update event date if changed
  if (event.startDate.getTime() !== item.eventDate?.getTime()) {
    item.eventDate = event.startDate;
    item.deadline = event.startDate; // Update deadline too
    hasChanges = true;
  }

  // Update status based on timing
  const now = new Date();
  const newStatus = event.startDate > now ? "upcoming" : "active";
  if (item.status !== newStatus) {
    item.status = newStatus;
    hasChanges = true;
  }

  // If event was cancelled, mark as closed
  if (event.status === "cancelled" && item.status !== "closed") {
    item.status = "closed";
    hasChanges = true;
  }

  // Add to context history if changes detected
  if (hasChanges) {
    item.contextHistory.push({
      date: new Date(),
      summary: `Event updated: ${event.summary}`,
      emailId: event.id,
    });

    await item.save();
  }

  return hasChanges;
}

/**
 * Build a rich description for the workspace item
 */
function buildDescription(event: CalendarEvent, classification: any): string {
  const parts: string[] = [];

  // Add classification summary
  parts.push(classification.summary);

  // Add event description if available
  if (event.description && event.description.trim() !== "") {
    parts.push(`\n\nDetails: ${event.description.substring(0, 500)}`);
  }

  // Add calendar link
  if (event.htmlLink) {
    parts.push(`\n\nView in Google Calendar: ${event.htmlLink}`);
  }

  return parts.join("");
}

/**
 * Determine priority based on event timing and characteristics
 */
function determinePriority(event: CalendarEvent): "urgent" | "high" | "medium" | "low" {
  const now = new Date();
  const hoursUntilEvent = (event.startDate.getTime() - now.getTime()) / (1000 * 60 * 60);

  // Urgent: Less than 24 hours away
  if (hoursUntilEvent < 24) {
    return "urgent";
  }

  // High: Less than 3 days away
  if (hoursUntilEvent < 72) {
    return "high";
  }

  // Medium: Less than 7 days away
  if (hoursUntilEvent < 168) {
    return "medium";
  }

  // Low: More than 7 days away
  return "low";
}
