import { callLlm } from "./llmService.js";
import { WorkspaceItem } from "../models/WorkspaceItem.js";
import type { GmailMessage } from "./gmailService.js";
import type { Types } from "mongoose";

interface MatchResult {
  matched: boolean;
  workspaceItemId?: string;
  reason: string;
}

// Tier A: Check if any existing workspace item shares a threadId with this email
export async function matchByThreadId(
  email: GmailMessage,
  userId: Types.ObjectId
): Promise<MatchResult> {
  const item = await WorkspaceItem.findOne({
    userId,
    threadIds: email.threadId,
  });

  if (item) {
    return {
      matched: true,
      workspaceItemId: item._id.toString(),
      reason: `Thread ID match: ${email.threadId}`,
    };
  }

  return { matched: false, reason: "No thread ID match" };
}

// Tier B: Ask the LLM if this email relates to any existing workspace item
export async function matchByLlm(
  email: GmailMessage,
  userId: Types.ObjectId
): Promise<MatchResult> {
  const existingItems = await WorkspaceItem.find({ userId })
    .select("_id title description contextHistory")
    .sort({ updatedAt: -1 })
    .limit(30)
    .lean();

  if (existingItems.length === 0) {
    return { matched: false, reason: "No existing workspace items to match against" };
  }

  const itemList = existingItems
    .map((item, i) => {
      let entry = `[${i}] "${item.title}"`;
      if (item.contextHistory && item.contextHistory.length > 0) {
        const latest = item.contextHistory[item.contextHistory.length - 1];
        entry += ` — latest: ${latest.summary}`;
      }
      return entry;
    })
    .join("\n");

  const systemPrompt = `You match incoming emails to existing workspace items. A workspace item tracks a journey (e.g., an internship application from apply → interview → result).

Given a new email and a list of existing workspace items, decide if the email is a continuation or update of an existing item.

Match when:
- Same organization/company and same topic (e.g., "Google Internship" application email and "Google Internship" interview invite)
- A status update for something already tracked (selected, rejected, next round, reminder)
- A follow-up or reply to the same subject matter

Do NOT match when:
- Different organizations even if similar topic (e.g., "Google Internship" vs "Microsoft Internship")
- Same sender but completely different subject
- Generic emails that happen to share a keyword

Respond ONLY with valid JSON, no markdown fences:
{
  "matched": boolean,
  "itemIndex": number or null,
  "reason": "why you matched or didn't match"
}

If matched, itemIndex is the [index] number from the list. If not matched, itemIndex is null.`;

  const userPrompt = `New email:
Subject: ${email.subject}
From: ${email.from}
Date: ${email.date.toISOString()}
Snippet: ${email.snippet}

Existing workspace items:
${itemList}`;

  try {
    const response = await callLlm([
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ]);

    const parsed = JSON.parse(response.content);

    if (parsed.matched && parsed.itemIndex !== null && parsed.itemIndex < existingItems.length) {
      const matchedItem = existingItems[parsed.itemIndex];
      return {
        matched: true,
        workspaceItemId: matchedItem._id.toString(),
        reason: `LLM match: ${parsed.reason}`,
      };
    }

    return { matched: false, reason: parsed.reason || "LLM found no match" };
  } catch (error) {
    console.error("LLM matching failed:", error);
    return { matched: false, reason: "LLM matching failed — treating as new item" };
  }
}

// Combined matching: threadId first, then LLM
export async function findMatchingWorkspaceItem(
  email: GmailMessage,
  userId: Types.ObjectId
): Promise<MatchResult> {
  // Tier A: fast threadId check
  const threadMatch = await matchByThreadId(email, userId);
  if (threadMatch.matched) return threadMatch;

  // Tier B: LLM semantic match
  return matchByLlm(email, userId);
}
