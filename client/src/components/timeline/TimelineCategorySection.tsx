import { useState } from 'react'
import { useTimelineCategory } from '@/hooks/use-timeline'
import { TimelineEntryCard } from './TimelineEntryCard'
import { Pagination } from '@/components/ui/Pagination'
import type { TimelineCategory, TimelineSortBy, TimelineEntry } from '@/types/timeline'

interface TimelineCategorySectionProps {
  category: TimelineCategory
  label: string
  color: string
  sortBy: TimelineSortBy
  initialEntries?: TimelineEntry[]
  initialTotalPages?: number
}

export function TimelineCategorySection({ category, label, color, sortBy, initialEntries, initialTotalPages }: TimelineCategorySectionProps) {
  const [page, setPage] = useState(1)
  const isPageOne = page === 1

  const { data } = useTimelineCategory(category, sortBy, page)

  const entries = isPageOne && initialEntries ? initialEntries : data?.entries ?? []
  const totalPages = isPageOne && initialTotalPages != null ? initialTotalPages : data?.pagination?.totalPages ?? 1

  if (entries.length === 0 && isPageOne) {
    return (
      <section>
        <h3 className={`mb-2 text-sm font-semibold ${color}`}>{label}</h3>
        <p className="text-xs text-gray-400">No entries.</p>
      </section>
    )
  }

  return (
    <section>
      <h3 className={`mb-2 text-sm font-semibold ${color}`}>{label}</h3>
      <div className="space-y-2">
        {entries.map((entry, i) => (
          <div key={entry._id} className="animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
            <TimelineEntryCard entry={entry} />
          </div>
        ))}
      </div>
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </section>
  )
}
