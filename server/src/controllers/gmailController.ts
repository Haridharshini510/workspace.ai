import { Request, Response } from "express";
import { User } from "../models/User.js";
import { fetchRecentEmails } from "../services/gmailService.js";
import { filterEmails } from "../services/emailFilterService.js";
import { classifyEmail } from "../services/emailClassificationService.js";
import { processEmailsToWorkspaceItems } from "../services/emailProcessingService.js";
import type { EmailFilterResult } from "../services/emailFilterService.js";

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

    // Step 1: Fetch recent emails from Gmail
    console.log(`Fetching emails for user ${user.email}...`);
    const emails = await fetchRecentEmails(user, 50);
    console.log(`Fetched ${emails.length} emails`);

    // Step 2: Tier 1 + 2 filtering (Gmail labels + keywords)
    const { confident, uncertain, filtered } = filterEmails(emails);
    console.log(`Confident: ${confident.length}, Uncertain: ${uncertain.length}, Filtered: ${filtered.length}`);

    // Step 3: Tier 3 — LLM classification for uncertain emails
    const llmAccepted: Array<{ email: typeof uncertain[0]; result: EmailFilterResult }> = [];
    let llmRejected = 0;

    for (const email of uncertain) {
      try {
        const classification = await classifyEmail(email);

        if (classification.isRelevant) {
          llmAccepted.push({
            email,
            result: {
              isRelevant: true,
              reason: `LLM: ${classification.reason}`,
              category: classification.type === "event" ? "opportunity" : classification.type as EmailFilterResult["category"],
              score: 75,
            },
          });
        } else {
          llmRejected++;
          console.log(`LLM rejected: "${email.subject}" — ${classification.reason}`);
        }
      } catch (error) {
        console.error(`LLM classification failed for "${email.subject}":`, error);
        llmAccepted.push({
          email,
          result: {
            isRelevant: true,
            reason: "LLM classification failed — defaulting to relevant",
            category: "information",
            score: 40,
          },
        });
      }
    }

    console.log(`LLM accepted: ${llmAccepted.length}, LLM rejected: ${llmRejected}`);

    // Step 4: Combine confident + LLM-accepted emails and process
    const allRelevant = [...confident, ...llmAccepted];

    if (allRelevant.length === 0) {
      return res.json({
        message: "No relevant emails found",
        created: 0,
        updated: 0,
        skipped: emails.length,
        commitmentsGenerated: 0,
        details: { created: [], updated: [], skipped: [], commitmentsGenerated: 0 },
      });
    }

    const results = await processEmailsToWorkspaceItems(allRelevant, user._id);

    console.log(`Gmail sync complete:`, {
      created: results.created.length,
      updated: results.updated.length,
      skipped: results.skipped.length + filtered.length + llmRejected,
      commitmentsGenerated: results.commitmentsGenerated,
    });

    // Return summary matching Calendar sync format
    return res.json({
      message: "Gmail sync completed successfully",
      created: results.created.length,
      updated: results.updated.length,
      skipped: results.skipped.length + filtered.length + llmRejected,
      commitmentsGenerated: results.commitmentsGenerated,
      details: results,
    });
  } catch (error: any) {
    console.error("Gmail sync failed:", error);

    // Handle specific Gmail API errors
    if (error.message?.includes("invalid_grant") || error.message?.includes("invalid_token")) {
      return res.status(401).json({
        error: "Gmail access expired. Please re-authenticate.",
        details: error.message,
      });
    }

    if (error.message?.includes("Gmail")) {
      return res.status(400).json({
        error: "Failed to access Gmail. Please re-authenticate.",
        details: error.message,
      });
    }

    return res.status(500).json({
      error: "Gmail sync failed",
      details: error.message,
    });
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
