import { api } from './client';

export interface CalendarSyncResponse {
  message: string;
  created: number;
  updated: number;
  skipped: number;
  commitmentsGenerated: number;
  details: {
    created: Array<{ id: string; title: string }>;
    updated: Array<{ id: string; title: string }>;
    skipped: Array<{ eventId: string; reason: string }>;
    commitmentsGenerated: number;
  };
}

export const calendarApi = {
  sync: (daysAhead: number = 30) =>
    api.post<CalendarSyncResponse>('/calendar/sync', {}, { params: { daysAhead } }),
};
