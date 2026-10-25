import { useState } from 'react'
import { X } from 'lucide-react'
import { useTimelineCategory } from '@/hooks/use-timeline'
import { TimelineEntryCard } from './TimelineEntryCard'
import { Pagination } from '@/components/ui/Pagination'
import { Badge } from '@/components/ui/Badge'
import { priorityColor, statusLabel } from '@/lib/utils'
import type { TimelineCategory, TimelineSortBy, TimelineEntry } from '@/types/timeline'

interface TimelineCategorySectionProps {
  category: TimelineCategory
  label: string
  color: string
  sortBy: TimelineSortBy
  initialEntries?: TimelineEntry[]
  initialTotalPages?: number
  onDismiss?: (id: string, source: 'commitment' | 'workspace_item') => void
}

function groupByDate(entries: TimelineEntry[]): Map<string, TimelineEntry[]> {
  const groups = new Map<string, TimelineEntry[]>()

  entries.forEach(entry => {
    if (!entry.deadline) {
      const key = 'no-date'
      if (!groups.has(key)) groups.set(key, [])
      groups.get(key)!.push(entry)
      return
    }

    const date = new Date(entry.deadline)
    const key = date.toDateString()
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(entry)
  })

  return groups
}

export function TimelineCategorySection({ category, label, color, sortBy, initialEntries, initialTotalPages, onDismiss }: TimelineCategorySectionProps) {
  const [page, setPage] = useState(1)
  const isPageOne = page === 1

  const { data } = useTimelineCategory(category, sortBy, page)

  const entries = isPageOne && initialEntries ? initialEntries : data?.entries ?? []
  const totalPages = isPageOne && initialTotalPages != null ? initialTotalPages : data?.pagination?.totalPages ?? 1

  if (entries.length === 0 && isPageOne) {
    return (
      <section className="mb-8">
        <h2 className={`mb-4 font-satoshi text-2xl font-bold ${color}`}>{label}</h2>
        <p className="font-newsreader text-sm text-neutral-400 ml-24">No entries.</p>
      </section>
    )
  }

  const dateGroups = groupByDate(entries)

  const isUndatedCategory = category === 'undated'

  return (
    <section className="mb-12">
      <h2 className={`mb-6 font-satoshi text-2xl font-bold ${color}`}>{label}</h2>

      {isUndatedCategory ? (
        // For undated items, show a simple grid without timeline
        <div className="space-y-3 ml-0">
          {entries.map((entry, i) => (
            <div key={entry._id} className="animate-fade-in-up" style={{ animationDelay: `${i * 30}ms` }}>
              <div className="group relative rounded-2xl border border-neutral-200 bg-white p-5 transition-all hover:border-neutral-300 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-satoshi text-base font-semibold text-neutral-950 dark:text-neutral-50 leading-snug">
                    {entry.title}
                  </h3>
                  {onDismiss && (
                    <button
                      onClick={() => onDismiss(entry._id, entry.source)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 rounded-lg p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      title="Hide from timeline"
                    >
                      <X className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
                    </button>
                  )}
                </div>
                <p className="font-newsreader text-sm text-neutral-600 dark:text-neutral-400 mb-3 line-clamp-2">
                  {entry.description}
                </p>
                <div className="flex items-center gap-2">
                  <Badge className={priorityColor(entry.priority)}>{entry.priority}</Badge>
                  <Badge className="bg-neutral-950/5 text-neutral-600 dark:bg-neutral-50/10 dark:text-neutral-400">
                    {statusLabel(entry.status)}
                  </Badge>
                  <Badge className="bg-neutral-950/5 text-neutral-500 dark:bg-neutral-50/10 dark:text-neutral-400">
                    {entry.source === 'commitment' ? 'Commitment' : 'Item'}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // For dated items, show timeline layout
        <div>
          {Array.from(dateGroups.entries()).map(([dateKey, groupEntries], groupIndex) => (
            <div key={dateKey}>
              {groupEntries.map((entry, i) => (
                <div key={entry._id} className="animate-fade-in-up" style={{ animationDelay: `${(groupIndex * 3 + i) * 30}ms` }}>
                  <TimelineEntryCard
                    entry={entry}
                    onDismiss={onDismiss}
                    showDate={i === 0 && dateKey !== 'no-date'}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </section>
  )
}
