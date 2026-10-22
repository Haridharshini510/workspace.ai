export type Priority = 'urgent' | 'high' | 'medium' | 'low'

export interface ApiError {
  error: string
  details?: Array<{ message: string; path: string[] }>
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}
