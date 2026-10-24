import { Dialog } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'

interface DeleteCommitmentDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  isPending?: boolean
  title?: string
}

export function DeleteCommitmentDialog({ open, onClose, onConfirm, isPending, title }: DeleteCommitmentDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} title="Delete Commitment">
      <p className="font-newsreader text-sm text-neutral-600 dark:text-neutral-400">
        Are you sure you want to delete <span className="font-satoshi font-medium text-neutral-950 dark:text-neutral-50">{title}</span>?
      </p>
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="danger" onClick={onConfirm} disabled={isPending}>Delete</Button>
      </div>
    </Dialog>
  )
}
