import type { CalendarEvent } from "./calendarService.js";

export interface CalendarEventClassification {
  isRelevant: boolean;
  type: "event";
  title: string;
  summary: string;
  reason: string;
}

/**
 * Classify a calendar event to determine if it should become a workspace item.
 *
 * Current policy: Accept all valid events (not cancelled, has summary, future date)
 * All events are marked as type "event"
 */
export function classifyCalendarEvent(
  event: CalendarEvent
): CalendarEventClassification {
  // Reject cancelled events
  if (event.status === "cancelled") {
    return {
      isRelevant: false,
      type: "event",
      title: event.summary,
      summary: "Event was cancelled",
      reason: "Cancelled event",
    };
  }

  // Reject events without a summary
  if (!event.summary || event.summary.trim() === "") {
    return {
      isRelevant: false,
      type: "event",
      title: "Untitled Event",
      summary: "Event has no title",
      reason: "No event title",
    };
  }

  // Reject events in the past (safety check, though fetch should only get future events)
  const now = new Date();
  if (event.endDate < now) {
    return {
      isRelevant: false,
      type: "event",
      title: event.summary,
      summary: "Event has already ended",
      reason: "Past event",
    };
  }

  // Accept all valid events
  const title = event.summary;
  const summary = buildEventSummary(event);

  return {
    isRelevant: true,
    type: "event",
    title,
    summary,
    reason: "Valid calendar event",
  };
}

/**
 * Build a human-readable summary for the calendar event
 */
function buildEventSummary(event: CalendarEvent): string {
  const parts: string[] = [];

  // Add date/time info
  const startStr = formatEventDate(event.startDate);
  parts.push(`Scheduled for ${startStr}`);

  // Add location if available
  if (event.location) {
    parts.push(`at ${event.location}`);
  }

  // Add organizer if available
  if (event.organizer) {
    parts.push(`organized by ${event.organizer}`);
  }

  // Add attendee count if available
  if (event.attendees.length > 0) {
    parts.push(`with ${event.attendees.length} attendee${event.attendees.length > 1 ? "s" : ""}`);
  }

  return parts.join(", ") + ".";
}

/**
 * Format event date for human readability
 */
function formatEventDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  };

  return date.toLocaleString("en-US", options);
}
