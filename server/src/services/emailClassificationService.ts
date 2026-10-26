import { callLlm } from "./llmService.js";
import type { GmailMessage } from "./gmailService.js";

export interface EmailClassification {
  isRelevant: boolean;
  type: "opportunity" | "event" | "information" | "announcement";
  title: string;
  summary: string;
  reason: string;
}

const SYSTEM_PROMPT = `You are an email classifier for a personal workspace app. Your job is to decide whether an email is worth tracking as a workspace item for the user.

REJECT these — they are NOT relevant:
- OTPs, verification codes, password resets
- Promotional emails, marketing, sales, deals, coupons
- Newsletters, digests, weekly roundups
- Privacy policy updates, terms of service changes
- Automated receipts, order confirmations, shipping updates
- Social media notifications (likes, follows, comments)
- Subscription confirmations, unsubscribe notices
- System alerts, storage warnings, account activity summaries
- Auto-replies, out-of-office messages
- Spam or phishing attempts

ACCEPT these — they ARE relevant:
- Hackathons, competitions, coding challenges
- Internship or job opportunities and their updates (applications, interviews, selections, rejections)
- Event invitations (workshops, webinars, conferences, meetups)
- Academic deadlines (assignments, exams, project submissions)
- Scholarship or fellowship opportunities
- Direct personal emails that require action or attention
- Announcements about opportunities the user should know about

Respond ONLY with valid JSON, no markdown fences, no extra text:
{
  "isRelevant": boolean,
  "type": "opportunity" | "event" | "information" | "announcement",
  "title": "clean, concise title (not the raw subject line)",
  "summary": "one sentence describing what this email is about and what action is needed",
  "reason": "why you accepted or rejected this email"
}

If rejecting, still fill in type/title/summary with your best guess — but set isRelevant to false.`;

function buildUserPrompt(email: GmailMessage): string {
  return [
    `Subject: ${email.subject}`,
    `From: ${email.from}`,
    `Date: ${email.date.toISOString()}`,
    `Snippet: ${email.snippet}`,
  ].join("\n");
}

export async function classifyEmail(email: GmailMessage): Promise<EmailClassification> {
  const response = await callLlm([
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: buildUserPrompt(email) },
  ]);

  try {
    const parsed = JSON.parse(response.content);

    return {
      isRelevant: Boolean(parsed.isRelevant),
      type: parsed.type || "information",
      title: parsed.title || email.subject,
      summary: parsed.summary || email.snippet,
      reason: parsed.reason || "No reason provided",
    };
  } catch {
    console.error("Failed to parse LLM classification response:", response.content);
    return {
      isRelevant: true,
      type: "information",
      title: email.subject,
      summary: email.snippet,
      reason: "LLM response parsing failed — defaulting to relevant",
    };
  }
}
