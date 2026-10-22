import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/constants'
import { fetchTimeline, fetchTimelineCategory } from '@/api/timeline'
import type { TimelineSortBy, TimelineCategory } from '@/types/timeline'

export function useTimeline(sortBy?: TimelineSortBy, page?: number) {
  return useQuery({
    queryKey: queryKeys.timeline.full(sortBy, page),
    queryFn: () => fetchTimeline({ sortBy, page }),
  })
}

export function useTimelineCategory(category: TimelineCategory, sortBy?: TimelineSortBy, page?: number) {
  return useQuery({
    queryKey: queryKeys.timeline.category(category, sortBy, page),
    queryFn: () => fetchTimelineCategory({ category, sortBy, page }),
  })
}
