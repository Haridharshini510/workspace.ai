import { api } from './client';

export interface GmailSyncResponse {
  message: string;
  created: number;
  updated: number;
  skipped: number;
  commitmentsGenerated: number;
  details: {
    created: Array<{ id: string; title: string }>;
    updated: Array<{ id: string; title: string }>;
    skipped: Array<{ emailId: string; reason: string }>;
    commitmentsGenerated: number;
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
