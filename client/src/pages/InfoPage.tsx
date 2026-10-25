import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useWorkspaceItems, useCreateWorkspaceItem, useUpdateWorkspaceItem, useDeleteWorkspaceItem } from '@/hooks/use-workspace-items'
import { WorkspaceItemFilters } from '@/components/workspace-items/WorkspaceItemFilters'
import { WorkspaceItemList } from '@/components/workspace-items/WorkspaceItemList'
import { WorkspaceItemForm } from '@/components/workspace-items/WorkspaceItemForm'
import { DeleteItemDialog } from '@/components/workspace-items/DeleteItemDialog'
import { GmailSyncButton } from '@/components/gmail/GmailSyncButton'
import { Dialog } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { EmptyState } from '@/components/ui/EmptyState'
import type { WorkspaceItem, CreateWorkspaceItemPayload } from '@/types/workspace-item'

export default function InfoPage() {
  const [filters, setFilters] = useState<Record<string, string>>({})
  const { data: items, isLoading, isError, refetch } = useWorkspaceItems(filters)

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<WorkspaceItem | null>(null)
  const [deleting, setDeleting] = useState<WorkspaceItem | null>(null)

  const createMutation = useCreateWorkspaceItem()
  const updateMutation = useUpdateWorkspaceItem()
  const deleteMutation = useDeleteWorkspaceItem()

  const handleCreate = (data: CreateWorkspaceItemPayload) => {
    createMutation.mutate(data, { onSuccess: () => setFormOpen(false) })
  }

  const handleUpdate = (data: CreateWorkspaceItemPayload) => {
    if (!editing) return
    updateMutation.mutate({ id: editing._id, payload: data }, { onSuccess: () => setEditing(null) })
  }

  const handleDelete = () => {
    if (!deleting) return
    deleteMutation.mutate(deleting._id, { onSuccess: () => setDeleting(null) })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-satoshi text-xl font-semibold text-neutral-950 dark:text-neutral-50">Workspace Items</h2>
        <div className="flex items-center gap-2">
          <GmailSyncButton />
          <Button onClick={() => setFormOpen(true)}>
            <Plus className="h-4 w-4" /> New Item
          </Button>
        </div>
      </div>

      <WorkspaceItemFilters filters={filters} onChange={setFilters} />

      {isLoading && <LoadingSpinner />}
      {isError && <ErrorMessage message="Failed to load workspace items." onRetry={() => refetch()} />}
      {items && items.length === 0 && <EmptyState title="No items found" message="Try changing your filters or create a new item." />}
      {items && items.length > 0 && (
        <WorkspaceItemList items={items} onEdit={setEditing} onDelete={setDeleting} />
      )}

      <Dialog open={formOpen} onClose={() => setFormOpen(false)} title="New Item">
        <WorkspaceItemForm onSubmit={handleCreate} onCancel={() => setFormOpen(false)} isPending={createMutation.isPending} />
      </Dialog>

      <Dialog open={!!editing} onClose={() => setEditing(null)} title="Edit Item">
        {editing && (
          <WorkspaceItemForm initial={editing} onSubmit={handleUpdate} onCancel={() => setEditing(null)} isPending={updateMutation.isPending} />
        )}
      </Dialog>

      <DeleteItemDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        isPending={deleteMutation.isPending}
        title={deleting?.title}
      />
    </div>
  )
}
