import { Request, Response } from "express";
import { User } from "../models/User.js";
import { fetchUpcomingEvents } from "../services/calendarService.js";
import { processCalendarEvents } from "../services/calendarProcessingService.js";

// Sync Google Calendar events to workspace items
export async function syncCalendarEvents(req: Request, res: Response) {
  try {
    const userId = req.userId!;

    // Get user with OAuth tokens
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.accessToken) {
      return res.status(400).json({
        error: "Google Calendar not connected. Please re-authenticate to grant Calendar access.",
      });
    }

    // Optional: Get custom daysAhead from query params (default: 30)
    const daysAhead = parseInt(req.query.daysAhead as string) || 30;
    if (daysAhead < 1 || daysAhead > 365) {
      return res.status(400).json({
        error: "daysAhead must be between 1 and 365",
      });
    }

    // Step 1: Fetch upcoming calendar events
    console.log(`Fetching calendar events for user ${user.email} (next ${daysAhead} days)...`);
    const events = await fetchUpcomingEvents(user, daysAhead);
    console.log(`Fetched ${events.length} calendar events`);

    if (events.length === 0) {
      return res.json({
        message: "No upcoming calendar events found",
        created: 0,
        updated: 0,
        skipped: 0,
        commitmentsGenerated: 0,
        details: { created: [], updated: [], skipped: [], commitmentsGenerated: 0 },
      });
    }

    // Step 2: Process events into workspace items
    console.log(`Processing ${events.length} calendar events...`);
    const results = await processCalendarEvents(events, userId);

    console.log(`Calendar sync complete:`, {
      created: results.created.length,
      updated: results.updated.length,
      skipped: results.skipped.length,
      commitmentsGenerated: results.commitmentsGenerated,
    });

    // Return summary
    return res.json({
      message: "Calendar sync completed successfully",
      created: results.created.length,
      updated: results.updated.length,
      skipped: results.skipped.length,
      commitmentsGenerated: results.commitmentsGenerated,
      details: results,
    });
  } catch (error: any) {
    console.error("Calendar sync failed:", error);

    // Check for specific Google API errors
    if (error.message?.includes("Calendar")) {
      return res.status(400).json({
        error: "Failed to access Google Calendar. Please re-authenticate.",
        details: error.message,
      });
    }

    return res.status(500).json({
      error: "Calendar sync failed",
      details: error.message,
    });
  }
}
