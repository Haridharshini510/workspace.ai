import type { GmailMessage } from "./gmailService.js";

// Spam/promotional keywords to filter out
const SPAM_KEYWORDS = [
  "unsubscribe",
  "click here",
  "limited time offer",
  "act now",
  "buy now",
  "discount",
  "free shipping",
  "order now",
  "shop now",
  "subscribe",
  "newsletter",
];

// OTP/verification keywords
const OTP_KEYWORDS = [
  "otp",
  "one-time password",
  "verification code",
  "confirm your email",
  "verify your account",
  "security code",
  "authentication code",
  "reset password",
];

// Social/notification keywords
const SOCIAL_KEYWORDS = [
  "liked your",
  "commented on",
  "followed you",
  "friend request",
  "tagged you",
  "mentioned you",
];

// Opportunity/actionable keywords (what we WANT to keep)
const OPPORTUNITY_KEYWORDS = [
  "hackathon",
  "internship",
  "job opportunity",
  "application",
  "deadline",
  "registration",
  "workshop",
  "webinar",
  "conference",
  "event",
  "invitation",
  "interview",
  "scholarship",
  "competition",
  "submit",
  "project",
  "meetup",
  "bootcamp",
  "training",
];

export interface EmailFilterResult {
  isRelevant: boolean;
  reason: string;
  category: "spam" | "otp" | "social" | "opportunity" | "information" | "unknown";
  score: number; // 0-100, higher = more relevant
}

// Filter email to determine if it's relevant
export function filterEmail(email: GmailMessage): EmailFilterResult {
  const text = `${email.subject} ${email.snippet} ${email.body}`.toLowerCase();
  const subject = email.subject.toLowerCase();

  // Check if it's spam/promotional
  const spamScore = SPAM_KEYWORDS.filter((keyword) => text.includes(keyword)).length;
  if (spamScore >= 2 || subject.includes("unsubscribe")) {
    return {
      isRelevant: false,
      reason: "Spam or promotional email",
      category: "spam",
      score: 0,
    };
  }

  // Check if it's OTP/verification
  const otpScore = OTP_KEYWORDS.filter((keyword) => text.includes(keyword)).length;
  if (otpScore >= 1) {
    return {
      isRelevant: false,
      reason: "OTP or verification email",
      category: "otp",
      score: 0,
    };
  }

  // Check if it's social notification
  const socialScore = SOCIAL_KEYWORDS.filter((keyword) => text.includes(keyword)).length;
  if (socialScore >= 1) {
    return {
      isRelevant: false,
      reason: "Social media notification",
      category: "social",
      score: 0,
    };
  }

  // Check if it's an opportunity (HIGH PRIORITY - we want these!)
  const opportunityScore = OPPORTUNITY_KEYWORDS.filter((keyword) => text.includes(keyword)).length;
  if (opportunityScore >= 1) {
    return {
      isRelevant: true,
      reason: "Contains opportunity-related keywords",
      category: "opportunity",
      score: Math.min(100, 50 + opportunityScore * 10),
    };
  }

  // Check if it has important indicators
  const hasDeadline = /deadline|due date|submit by|closes on/i.test(text);
  const hasRegistration = /register|registration|sign up|enroll/i.test(text);
  const hasDate = /\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\d{1,2}\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i.test(
    text
  );

  if (hasDeadline || (hasRegistration && hasDate)) {
    return {
      isRelevant: true,
      reason: "Contains deadline or registration with date",
      category: "opportunity",
      score: 70,
    };
  }

  // If we're not sure, mark as information (borderline case)
  // This might need manual review or LLM classification in V2
  return {
    isRelevant: true,
    reason: "Potentially informational",
    category: "information",
    score: 40,
  };
}

// Batch filter emails
export function filterEmails(emails: GmailMessage[]): {
  relevant: Array<{ email: GmailMessage; result: EmailFilterResult }>;
  filtered: Array<{ email: GmailMessage; result: EmailFilterResult }>;
} {
  const relevant: Array<{ email: GmailMessage; result: EmailFilterResult }> = [];
  const filtered: Array<{ email: GmailMessage; result: EmailFilterResult }> = [];

  for (const email of emails) {
    const result = filterEmail(email);

    if (result.isRelevant) {
      relevant.push({ email, result });
    } else {
      filtered.push({ email, result });
    }
  }

  // Sort relevant emails by score (highest first)
  relevant.sort((a, b) => b.result.score - a.result.score);

  return { relevant, filtered };
}
