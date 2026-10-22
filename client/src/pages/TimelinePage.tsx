import { useState } from 'react'
import { useTimeline } from '@/hooks/use-timeline'
import { TimelineSummaryBar } from '@/components/timeline/TimelineSummaryBar'
import { TimelineSortToggle } from '@/components/timeline/TimelineSortToggle'
import { TimelineCategorySection } from '@/components/timeline/TimelineCategorySection'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import type { TimelineSortBy } from '@/types/timeline'

const categories = [
  { key: 'overdue' as const, label: 'Overdue', color: 'text-red-600 dark:text-red-400' },
  { key: 'upcoming' as const, label: 'Upcoming', color: 'text-blue-600 dark:text-blue-400' },
  { key: 'completed' as const, label: 'Completed', color: 'text-green-600 dark:text-green-400' },
  { key: 'undated' as const, label: 'Undated', color: 'text-gray-600 dark:text-gray-400' },
]

export default function TimelinePage() {
  const [sortBy, setSortBy] = useState<TimelineSortBy>('deadline')
  const { data, isLoading, isError, refetch } = useTimeline(sortBy)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Timeline</h2>
        <TimelineSortToggle sortBy={sortBy} onChange={setSortBy} />
      </div>

      {isLoading && <LoadingSpinner />}
      {isError && <ErrorMessage message="Failed to load timeline." onRetry={() => refetch()} />}

      {data && (
        <>
          <TimelineSummaryBar summary={data.summary} />
          <div className="space-y-6">
            {categories.map(({ key, label, color }) => (
              <TimelineCategorySection
                key={key}
                category={key}
                label={label}
                color={color}
                sortBy={sortBy}
                initialEntries={data[key]}
                initialTotalPages={data.pagination[key].totalPages}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
