import { Request, Response } from "express";
import { User } from "../models/User.js";
import { fetchRecentEmails } from "../services/gmailService.js";
import { filterEmails } from "../services/emailFilterService.js";
import { processEmailsToWorkspaceItems } from "../services/emailProcessingService.js";

// Sync Gmail emails to workspace items
export async function syncGmailEmails(req: Request, res: Response) {
  try {
    const userId = req.userId!;

    // Get user with OAuth tokens
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.accessToken) {
      return res.status(400).json({
        error: "Gmail not connected. Please re-authenticate to grant Gmail access.",
      });
    }

    // Fetch recent emails from Gmail
    console.log(`Fetching emails for user ${user.email}...`);
    const emails = await fetchRecentEmails(user, 50);

    console.log(`Fetched ${emails.length} emails`);

    // Filter emails (remove spam, OTPs, etc.)
    const { relevant, filtered } = filterEmails(emails);

    console.log(`Filtered to ${relevant.length} relevant emails`);

    // Process relevant emails into workspace items
    const results = await processEmailsToWorkspaceItems(relevant, user._id);

    console.log(
      `Created ${results.created.length} items, updated ${results.updated.length} items`
    );

    res.status(200).json({
      success: true,
      summary: {
        totalEmails: emails.length,
        relevantEmails: relevant.length,
        filteredOut: filtered.length,
        itemsCreated: results.created.length,
        itemsUpdated: results.updated.length,
        failed: results.failed.length,
      },
      items: {
        created: results.created,
        updated: results.updated,
      },
    });
  } catch (error: any) {
    console.error("Gmail sync failed:", error);

    // Handle specific Gmail API errors
    if (error.message?.includes("invalid_grant") || error.message?.includes("invalid_token")) {
      return res.status(401).json({
        error: "Gmail access expired. Please sign in again to refresh permissions.",
      });
    }

    res.status(500).json({ error: "Failed to sync Gmail emails" });
  }
}

// Get Gmail sync status
export async function getGmailSyncStatus(req: Request, res: Response) {
  try {
    const userId = req.userId!;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      isConnected: !!user.accessToken,
      email: user.email,
      lastSyncedAt: null, // We can add this field to User model later
    });
  } catch (error) {
    console.error("Failed to get Gmail sync status:", error);
    res.status(500).json({ error: "Failed to get sync status" });
  }
}
