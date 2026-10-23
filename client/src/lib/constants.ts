export const queryKeys = {
  workspaceItems: {
    all: ['workspace-items'] as const,
    list: (filters?: Record<string, string>) => [...queryKeys.workspaceItems.all, 'list', filters] as const,
    detail: (id: string) => [...queryKeys.workspaceItems.all, 'detail', id] as const,
    actionability: (id: string) => [...queryKeys.workspaceItems.all, 'actionability', id] as const,
    commitments: (id: string) => [...queryKeys.workspaceItems.all, 'commitments', id] as const,
  },
  commitments: {
    all: ['commitments'] as const,
    list: (filters?: Record<string, string>) => [...queryKeys.commitments.all, 'list', filters] as const,
    detail: (id: string) => [...queryKeys.commitments.all, 'detail', id] as const,
  },
  timeline: {
    all: ['timeline'] as const,
    full: (sortBy?: string, page?: number) => [...queryKeys.timeline.all, 'full', sortBy, page] as const,
    category: (category: string, sortBy?: string, page?: number) =>
      [...queryKeys.timeline.all, 'category', category, sortBy, page] as const,
  },
}

export const routes = {
  landing: '/',
  info: '/app',
  commitments: '/app/commitments',
  opportunities: '/app/opportunities',
  timeline: '/app/timeline',
  itemDetail: (id: string) => `/app/items/${id}`,
} as const

export const itemTypeLabels: Record<string, string> = {
  information: 'Information',
  opportunity: 'Opportunity',
  event: 'Event',
  announcement: 'Announcement',
}

export const itemStatusLabels: Record<string, string> = {
  open: 'Open',
  closed: 'Closed',
  upcoming: 'Upcoming',
  active: 'Active',
  expired: 'Expired',
}

export const priorityLabels: Record<string, string> = {
  urgent: 'Urgent',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
}

export const commitmentStatusLabels: Record<string, string> = {
  not_started: 'Not Started',
  in_progress: 'In Progress',
  completed: 'Completed',
  dismissed: 'Dismissed',
}
