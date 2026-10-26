import type { GmailMessage } from "./gmailService.js";
import type { EmailFilterResult } from "./emailFilterService.js";
import { WorkspaceItem } from "../models/WorkspaceItem.js";
import { findMatchingWorkspaceItem } from "./emailMatchingService.js";
import type { Types } from "mongoose";

// Extract dates from email text (deadlines, event dates)
function extractDates(text: string): Date[] {
  const dates: Date[] = [];
  const now = new Date();

  // Pattern 1: DD/MM/YYYY or MM/DD/YYYY or DD-MM-YYYY
  const datePattern1 = /\b(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})\b/g;
  let match;
  while ((match = datePattern1.exec(text)) !== null) {
    const [_, p1, p2, p3] = match;
    const year = p3.length === 2 ? 2000 + parseInt(p3) : parseInt(p3);

    // Try both MM/DD and DD/MM interpretations
    const date1 = new Date(year, parseInt(p1) - 1, parseInt(p2));
    const date2 = new Date(year, parseInt(p2) - 1, parseInt(p1));

    if (date1 >= now) dates.push(date1);
    else if (date2 >= now) dates.push(date2);
  }

  // Pattern 2: "January 15, 2024" or "15 Jan 2024"
  const monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
  const datePattern2 = /\b(\d{1,2})\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*[\s,]+(\d{2,4})\b/gi;
  while ((match = datePattern2.exec(text)) !== null) {
    const [_, day, month, year] = match;
    const monthIndex = monthNames.findIndex((m) => month.toLowerCase().startsWith(m));
    const fullYear = year.length === 2 ? 2000 + parseInt(year) : parseInt(year);
    const date = new Date(fullYear, monthIndex, parseInt(day));
    if (date >= now) dates.push(date);
  }

  return dates.sort((a, b) => a.getTime() - b.getTime());
}

// Determine workspace item type based on email content
function determineItemType(email: GmailMessage, filterResult: EmailFilterResult): string {
  const text = `${email.subject} ${email.snippet}`.toLowerCase();

  if (filterResult.category === "opportunity") {
    if (/event|workshop|webinar|conference|meetup/i.test(text)) {
      return "event";
    }
    return "opportunity";
  }

  if (/announcement|update|news/i.test(text)) {
    return "announcement";
  }

  return "information";
}

// Determine priority based on keywords and dates
function determinePriority(email: GmailMessage, dates: Date[]): string {
  const text = `${email.subject} ${email.snippet}`.toLowerCase();

  // Check for urgent keywords
  if (/urgent|asap|immediate|critical|important/i.test(text)) {
    return "urgent";
  }

  // If has deadline within 3 days
  if (dates.length > 0) {
    const daysUntil = Math.ceil((dates[0].getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (daysUntil <= 3) return "urgent";
    if (daysUntil <= 7) return "high";
    if (daysUntil <= 14) return "medium";
  }

  // Check for high-priority keywords
  if (/interview|deadline|application|selection/i.test(text)) {
    return "high";
  }

  return "medium";
}

// Determine status
function determineStatus(type: string, dates: Date[]): string {
  if (type === "event" && dates.length > 0) {
    const eventDate = dates[0];
    if (eventDate > new Date()) {
      return "upcoming";
    }
  }

  if (type === "opportunity") {
    return "open";
  }

  return "active";
}

// Create or update workspace item from email
export async function processEmailToWorkspaceItem(
  email: GmailMessage,
  filterResult: EmailFilterResult,
  userId: Types.ObjectId
) {
  try {
    const emailId = `gmail:${email.id}`;

    // Step 1: Check if this exact email was already processed
    const alreadyProcessed = await WorkspaceItem.findOne({
      userId,
      sourceEmails: emailId,
    });

    if (alreadyProcessed) {
      return alreadyProcessed;
    }

    const dates = extractDates(`${email.subject} ${email.body}`);
    const type = determineItemType(email, filterResult);
    const priority = determinePriority(email, dates);
    const status = determineStatus(type, dates);

    const fromMatch = email.from.match(/^(.+?)\s*<.*>$/);
    const senderName = fromMatch ? fromMatch[1].trim() : email.from;

    const contextEntry = {
      date: email.date,
      summary: `From ${senderName}: ${email.snippet.substring(0, 200)}`,
      emailId,
    };

    // Step 2: Try to match to an existing workspace item (threadId → LLM)
    const match = await findMatchingWorkspaceItem(email, userId);

    if (match.matched && match.workspaceItemId) {
      const existingItem = await WorkspaceItem.findById(match.workspaceItemId);

      if (existingItem) {
        existingItem.sourceEmails.push(emailId);
        if (!existingItem.threadIds.includes(email.threadId)) {
          existingItem.threadIds.push(email.threadId);
        }
        existingItem.contextHistory.push(contextEntry);

        if (dates.length > 0) {
          existingItem.deadline = dates[0];
        }
        existingItem.priority = priority as any;
        existingItem.status = status as any;

        await existingItem.save();
        console.log(`Matched email "${email.subject}" → existing item "${existingItem.title}" (${match.reason})`);
        return existingItem;
      }
    }

    // Step 3: No match — create new workspace item
    const workspaceItem = await WorkspaceItem.create({
      title: email.subject || "No Subject",
      description: `${email.snippet}\n\nFrom: ${senderName}\nReceived: ${email.date.toLocaleDateString()}`,
      type,
      status,
      priority,
      source: emailId,
      sourceEmails: [emailId],
      threadIds: [email.threadId],
      contextHistory: [contextEntry],
      deadline: dates.length > 0 ? dates[0] : undefined,
      eventDate: type === "event" && dates.length > 0 ? dates[0] : undefined,
      userId,
    });

    return workspaceItem;
  } catch (error) {
    console.error("Failed to process email to workspace item:", error);
    throw error;
  }
}

// Batch process emails
export async function processEmailsToWorkspaceItems(
  emails: Array<{ email: GmailMessage; result: EmailFilterResult }>,
  userId: Types.ObjectId
) {
  const results = {
    created: [] as any[],
    updated: [] as any[],
    failed: [] as any[],
  };

  for (const { email, result } of emails) {
    try {
      const existedBefore = await WorkspaceItem.exists({
        userId,
        sourceEmails: `gmail:${email.id}`,
      });

      const item = await processEmailToWorkspaceItem(email, result, userId);

      if (existedBefore) {
        // This exact email was already processed — skip
      } else if (item.sourceEmails.length > 1) {
        results.updated.push(item);
      } else {
        results.created.push(item);
      }
    } catch (error) {
      console.error(`Failed to process email ${email.id}:`, error);
      results.failed.push({ email, error });
    }
  }

  return results;
}
