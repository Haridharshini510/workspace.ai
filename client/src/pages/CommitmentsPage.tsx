import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useCommitments, useCreateCommitment, useUpdateCommitment, useDeleteCommitment } from '@/hooks/use-commitments'
import { CommitmentFilters } from '@/components/commitments/CommitmentFilters'
import { CommitmentList } from '@/components/commitments/CommitmentList'
import { CommitmentForm } from '@/components/commitments/CommitmentForm'
import { DeleteCommitmentDialog } from '@/components/commitments/DeleteCommitmentDialog'
import { Dialog } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { EmptyState } from '@/components/ui/EmptyState'
import type { Commitment, CreateCommitmentPayload, CommitmentStatus } from '@/types/commitment'

export default function CommitmentsPage() {
  const [filters, setFilters] = useState<Record<string, string>>({})
  const { data: commitments, isLoading, isError, refetch } = useCommitments(filters)

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Commitment | null>(null)
  const [deleting, setDeleting] = useState<Commitment | null>(null)

  const createMutation = useCreateCommitment()
  const updateMutation = useUpdateCommitment()
  const deleteMutation = useDeleteCommitment()

  const handleCreate = (data: CreateCommitmentPayload) => {
    createMutation.mutate(data, { onSuccess: () => setFormOpen(false) })
  }

  const handleUpdate = (data: CreateCommitmentPayload) => {
    if (!editing) return
    updateMutation.mutate({ id: editing._id, payload: data }, { onSuccess: () => setEditing(null) })
  }

  const handleDelete = () => {
    if (!deleting) return
    deleteMutation.mutate(deleting._id, { onSuccess: () => setDeleting(null) })
  }

  const handleStatusChange = (id: string, status: CommitmentStatus) => {
    updateMutation.mutate({ id, payload: { status } })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-satoshi text-xl font-semibold text-neutral-950 dark:text-neutral-50">Commitments</h2>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="h-4 w-4" /> New Commitment
        </Button>
      </div>

      <CommitmentFilters filters={filters} onChange={setFilters} />

      {isLoading && <LoadingSpinner />}
      {isError && <ErrorMessage message="Failed to load commitments." onRetry={() => refetch()} />}
      {commitments && commitments.length === 0 && <EmptyState title="No commitments found" message="Try changing your filters or create a new commitment." />}
      {commitments && commitments.length > 0 && (
        <CommitmentList
          commitments={commitments}
          onEdit={setEditing}
          onDelete={setDeleting}
          onStatusChange={handleStatusChange}
          statusPending={updateMutation.isPending}
        />
      )}

      <Dialog open={formOpen} onClose={() => setFormOpen(false)} title="New Commitment">
        <CommitmentForm onSubmit={handleCreate} onCancel={() => setFormOpen(false)} isPending={createMutation.isPending} />
      </Dialog>

      <Dialog open={!!editing} onClose={() => setEditing(null)} title="Edit Commitment">
        {editing && (
          <CommitmentForm initial={editing} onSubmit={handleUpdate} onCancel={() => setEditing(null)} isPending={updateMutation.isPending} />
        )}
      </Dialog>

      <DeleteCommitmentDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        isPending={deleteMutation.isPending}
        title={deleting?.title}
      />
    </div>
  )
}
