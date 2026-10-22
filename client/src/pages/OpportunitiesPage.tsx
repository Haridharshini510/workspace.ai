import { useWorkspaceItems } from '@/hooks/use-workspace-items'
import { OpportunityList } from '@/components/opportunities/OpportunityList'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { EmptyState } from '@/components/ui/EmptyState'

export default function OpportunitiesPage() {
  const { data: items, isLoading, isError, refetch } = useWorkspaceItems({ type: 'opportunity' })

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Opportunities</h2>
      {isLoading && <LoadingSpinner />}
      {isError && <ErrorMessage message="Failed to load opportunities." onRetry={() => refetch()} />}
      {items && items.length === 0 && <EmptyState title="No opportunities" message="Opportunities will appear here when added." />}
      {items && items.length > 0 && <OpportunityList items={items} />}
    </div>
  )
}
