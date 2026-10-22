import { api } from './client'
import type { TimelineFullResponse, TimelineCategoryResponse, TimelineQueryParams } from '@/types/timeline'

export function fetchTimeline(params?: TimelineQueryParams) {
  const search = new URLSearchParams()
  if (params?.sortBy) search.set('sortBy', params.sortBy)
  if (params?.page) search.set('page', String(params.page))
  if (params?.limit) search.set('limit', String(params.limit))
  const query = search.toString()
  return api.get<TimelineFullResponse>(`/timeline${query ? `?${query}` : ''}`)
}

export function fetchTimelineCategory(params: Required<Pick<TimelineQueryParams, 'category'>> & TimelineQueryParams) {
  const search = new URLSearchParams()
  search.set('category', params.category)
  if (params.sortBy) search.set('sortBy', params.sortBy)
  if (params.page) search.set('page', String(params.page))
  if (params.limit) search.set('limit', String(params.limit))
  return api.get<TimelineCategoryResponse>(`/timeline?${search.toString()}`)
}
