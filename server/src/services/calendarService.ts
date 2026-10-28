import { google } from "googleapis";
import type { IUser } from "../models/User.js";

// Initialize Google Calendar API client with user's OAuth tokens
function getCalendarClient(user: IUser) {
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

  return google.calendar({ version: "v3", auth: oauth2Client });
}

export interface CalendarEvent {
  id: string;
  calendarId: string;
  summary: string;
  description: string;
  location: string;
  startDate: Date;
  endDate: Date;
  attendees: string[];
  organizer: string;
  status: string;
  htmlLink: string;
}

// Fetch upcoming calendar events
export async function fetchUpcomingEvents(
  user: IUser,
  daysAhead: number = 30
): Promise<CalendarEvent[]> {
  try {
    const calendar = getCalendarClient(user);

    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + daysAhead);

    // Fetch events from primary calendar
    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin: now.toISOString(),
      timeMax: futureDate.toISOString(),
      singleEvents: true, // Expand recurring events into individual instances
      orderBy: "startTime",
      maxResults: 250, // Google's max is 2500, but 250 is reasonable for 30 days
    });

    const events = response.data.items || [];

    if (events.length === 0) {
      return [];
    }

    // Parse each event into our format
    return events
      .map(parseCalendarEvent)
      .filter((event): event is CalendarEvent => event !== null);
  } catch (error) {
    console.error("Failed to fetch calendar events:", error);
    throw new Error("Failed to fetch calendar events");
  }
}

// Parse Google Calendar event into our format
function parseCalendarEvent(event: any): CalendarEvent | null {
  try {
    // Skip events without ID or summary
    if (!event.id || !event.summary) {
      return null;
    }

    // Parse start and end times
    // Events can be all-day (date) or timed (dateTime)
    const startDate = event.start?.dateTime
      ? new Date(event.start.dateTime)
      : event.start?.date
      ? new Date(event.start.date)
      : new Date();

    const endDate = event.end?.dateTime
      ? new Date(event.end.dateTime)
      : event.end?.date
      ? new Date(event.end.date)
      : new Date(startDate.getTime() + 60 * 60 * 1000); // Default to 1 hour after start

    // Extract attendees
    const attendees = event.attendees
      ? event.attendees
          .filter((a: any) => a.email)
          .map((a: any) => a.email)
      : [];

    // Get organizer
    const organizer = event.organizer?.email || event.creator?.email || "";

    return {
      id: event.id,
      calendarId: event.organizer?.email || "primary",
      summary: event.summary,
      description: event.description || "",
      location: event.location || "",
      startDate,
      endDate,
      attendees,
      organizer,
      status: event.status || "confirmed",
      htmlLink: event.htmlLink || "",
    };
  } catch (error) {
    console.error("Failed to parse calendar event:", error);
    return null;
  }
}

// Fetch events from a specific date range
export async function fetchEventsByDateRange(
  user: IUser,
  startDate: Date,
  endDate: Date
): Promise<CalendarEvent[]> {
  try {
    const calendar = getCalendarClient(user);

    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin: startDate.toISOString(),
      timeMax: endDate.toISOString(),
      singleEvents: true,
      orderBy: "startTime",
      maxResults: 250,
    });

    const events = response.data.items || [];

    if (events.length === 0) {
      return [];
    }

    return events
      .map(parseCalendarEvent)
      .filter((event): event is CalendarEvent => event !== null);
  } catch (error) {
    console.error("Failed to fetch events by date range:", error);
    throw new Error("Failed to fetch events by date range");
  }
}
