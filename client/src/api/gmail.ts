import { api } from './client';

export interface GmailSyncResponse {
  success: boolean;
  summary: {
    totalEmails: number;
    relevantEmails: number;
    filteredOut: number;
    itemsCreated: number;
    itemsUpdated: number;
    failed: number;
  };
  items: {
    created: any[];
    updated: any[];
  };
}

export interface GmailStatusResponse {
  isConnected: boolean;
  email: string;
  lastSyncedAt: string | null;
}

export const gmailApi = {
  sync: () => api.post<GmailSyncResponse>('/gmail/sync', {}),
  getStatus: () => api.get<GmailStatusResponse>('/gmail/status'),
};
