import { google } from "googleapis";
import type { IUser } from "../models/User.js";
import { withRetry, TIMEOUTS } from "../utils/retry.js";

// Initialize Gmail API client with user's OAuth tokens
function getGmailClient(user: IUser) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.BACKEND_URL}/api/auth/google/callback`
  );

  // Set user's access and refresh tokens
  oauth2Client.setCredentials({
    access_token: user.accessToken,
    refresh_token: user.refreshToken,
  });

  return google.gmail({
    version: "v1",
    auth: oauth2Client,
    timeout: TIMEOUTS.GOOGLE_API,
  });
}

export interface GmailMessage {
  id: string;
  threadId: string;
  subject: string;
  from: string;
  to: string;
  date: Date;
  snippet: string;
  body: string;
  labels: string[];
}

// Fetch recent emails from user's Gmail
export async function fetchRecentEmails(
  user: IUser,
  maxResults: number = 50
): Promise<GmailMessage[]> {
  try {
    const gmail = getGmailClient(user);

    // List recent messages (excluding sent, drafts, spam, trash)
    const response = await withRetry(
      () => gmail.users.messages.list({
        userId: "me",
        maxResults,
        q: "-in:sent -in:drafts -in:spam -in:trash",
      }),
      { label: "Gmail list messages" }
    );

    const messages = response.data.messages || [];

    if (messages.length === 0) {
      return [];
    }

    // Fetch full details for each message
    const emailPromises = messages.map(async (message) => {
      const fullMessage = await withRetry(
        () => gmail.users.messages.get({
          userId: "me",
          id: message.id!,
          format: "full",
        }),
        { label: `Gmail get message ${message.id}` }
      );

      return parseGmailMessage(fullMessage.data);
    });

    const emails = await Promise.all(emailPromises);
    return emails.filter((email): email is GmailMessage => email !== null);
  } catch (error) {
    console.error("Failed to fetch emails from Gmail:", error);
    throw new Error("Failed to fetch emails from Gmail");
  }
}

// Parse Gmail API message into our format
function parseGmailMessage(message: any): GmailMessage | null {
  try {
    const headers = message.payload?.headers || [];
    const getHeader = (name: string) =>
      headers.find((h: any) => h.name.toLowerCase() === name.toLowerCase())?.value || "";

    const subject = getHeader("Subject");
    const from = getHeader("From");
    const to = getHeader("To");
    const dateStr = getHeader("Date");

    // Parse email body
    let body = "";
    if (message.payload?.body?.data) {
      body = Buffer.from(message.payload.body.data, "base64").toString("utf-8");
    } else if (message.payload?.parts) {
      // Multi-part message (look for text/plain or text/html)
      for (const part of message.payload.parts) {
        if (part.mimeType === "text/plain" && part.body?.data) {
          body = Buffer.from(part.body.data, "base64").toString("utf-8");
          break;
        }
      }
      // Fallback to HTML if no plain text
      if (!body) {
        for (const part of message.payload.parts) {
          if (part.mimeType === "text/html" && part.body?.data) {
            body = Buffer.from(part.body.data, "base64").toString("utf-8");
            break;
          }
        }
      }
    }

    // Parse date
    let date = new Date();
    if (dateStr) {
      date = new Date(dateStr);
    }

    return {
      id: message.id,
      threadId: message.threadId,
      subject,
      from,
      to,
      date,
      snippet: message.snippet || "",
      body: body.substring(0, 5000), // Limit body to 5000 chars
      labels: message.labelIds || [],
    };
  } catch (error) {
    console.error("Failed to parse Gmail message:", error);
    return null;
  }
}

// Fetch emails by date range
export async function fetchEmailsByDateRange(
  user: IUser,
  afterDate: Date,
  beforeDate: Date,
  maxResults: number = 100
): Promise<GmailMessage[]> {
  try {
    const gmail = getGmailClient(user);

    const afterTimestamp = Math.floor(afterDate.getTime() / 1000);
    const beforeTimestamp = Math.floor(beforeDate.getTime() / 1000);

    const query = `after:${afterTimestamp} before:${beforeTimestamp} -in:sent -in:drafts -in:spam -in:trash`;

    const response = await withRetry(
      () => gmail.users.messages.list({
        userId: "me",
        maxResults,
        q: query,
      }),
      { label: "Gmail list messages by date range" }
    );

    const messages = response.data.messages || [];

    if (messages.length === 0) {
      return [];
    }

    const emailPromises = messages.map(async (message) => {
      const fullMessage = await withRetry(
        () => gmail.users.messages.get({
          userId: "me",
          id: message.id!,
          format: "full",
        }),
        { label: `Gmail get message ${message.id}` }
      );

      return parseGmailMessage(fullMessage.data);
    });

    const emails = await Promise.all(emailPromises);
    return emails.filter((email): email is GmailMessage => email !== null);
  } catch (error) {
    console.error("Failed to fetch emails by date range:", error);
    throw new Error("Failed to fetch emails by date range");
  }
}
