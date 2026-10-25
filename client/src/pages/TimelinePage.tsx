import { useState } from 'react'
import { useTimeline } from '@/hooks/use-timeline'
import { useUpdateCommitment } from '@/hooks/use-commitments'
import { useUpdateWorkspaceItem } from '@/hooks/use-workspace-items'
import { TimelineSummaryBar } from '@/components/timeline/TimelineSummaryBar'
import { TimelineSortToggle } from '@/components/timeline/TimelineSortToggle'
import { TimelineCategorySection } from '@/components/timeline/TimelineCategorySection'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import type { TimelineSortBy } from '@/types/timeline'

const categories = [
  { key: 'overdue' as const, label: 'Overdue', color: 'text-red-600 dark:text-red-400' },
  { key: 'upcoming' as const, label: 'Upcoming', color: 'text-neutral-950 dark:text-neutral-50' },
  { key: 'completed' as const, label: 'Completed', color: 'text-green-600 dark:text-green-400' },
  { key: 'undated' as const, label: 'Undated', color: 'text-neutral-500 dark:text-neutral-400' },
]

export default function TimelinePage() {
  const [sortBy, setSortBy] = useState<TimelineSortBy>('deadline')
  const { data, isLoading, isError, refetch } = useTimeline(sortBy)

  const updateCommitment = useUpdateCommitment()
  const updateWorkspaceItem = useUpdateWorkspaceItem()

  const handleDismiss = (id: string, source: 'commitment' | 'workspace_item') => {
    if (source === 'commitment') {
      updateCommitment.mutate({ id, payload: { hiddenFromTimeline: true } })
    } else {
      updateWorkspaceItem.mutate({ id, payload: { hiddenFromTimeline: true } })
    }
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <h1 className="font-satoshi text-3xl font-bold text-neutral-950 dark:text-neutral-50">Timeline</h1>
        <TimelineSortToggle sortBy={sortBy} onChange={setSortBy} />
      </div>

      {isLoading && <LoadingSpinner />}
      {isError && <ErrorMessage message="Failed to load timeline." onRetry={() => refetch()} />}

      {data && (
        <>
          <TimelineSummaryBar summary={data.summary} />
          <div className="mt-8">
            {categories.map(({ key, label, color }) => (
              <TimelineCategorySection
                key={key}
                category={key}
                label={label}
                color={color}
                sortBy={sortBy}
                initialEntries={data[key]}
                initialTotalPages={data.pagination[key].totalPages}
                onDismiss={handleDismiss}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
