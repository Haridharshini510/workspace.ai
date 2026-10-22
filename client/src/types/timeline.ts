import type { Priority, PaginationMeta } from './common'

export type TimelineCategory = 'overdue' | 'upcoming' | 'completed' | 'undated'
export type TimelineSortBy = 'deadline' | 'priority'
export type TimelineSource = 'commitment' | 'workspace_item'

export interface TimelineEntry {
  _id: string
  title: string
  description: string
  status: string
  priority: Priority
  deadline?: string
  source: TimelineSource
}

export interface TimelineSummary {
  total: number
  overdue: number
  upcoming: number
  completed: number
  undated: number
}

export interface TimelineCategoryPagination {
  total: number
  totalPages: number
}

export interface TimelineFullResponse {
  overdue: TimelineEntry[]
  upcoming: TimelineEntry[]
  completed: TimelineEntry[]
  undated: TimelineEntry[]
  summary: TimelineSummary
  sortBy: TimelineSortBy
  pagination: {
    page: number
    limit: number
    overdue: TimelineCategoryPagination
    upcoming: TimelineCategoryPagination
    completed: TimelineCategoryPagination
    undated: TimelineCategoryPagination
  }
}

export interface TimelineCategoryResponse {
  category: TimelineCategory
  sortBy: TimelineSortBy
  entries: TimelineEntry[]
  pagination: PaginationMeta
}

export interface TimelineQueryParams {
  category?: TimelineCategory
  sortBy?: TimelineSortBy
  page?: number
  limit?: number
}
