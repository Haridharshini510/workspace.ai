import { Dialog } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'

interface DeleteItemDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  isPending?: boolean
  title?: string
}

export function DeleteItemDialog({ open, onClose, onConfirm, isPending, title }: DeleteItemDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} title="Delete Item">
      <p className="font-newsreader text-sm text-neutral-600 dark:text-neutral-400">
        Are you sure you want to delete <span className="font-satoshi font-medium text-neutral-950 dark:text-neutral-50">{title}</span>?
        This will also delete all linked commitments.
      </p>
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="danger" onClick={onConfirm} disabled={isPending}>Delete</Button>
      </div>
    </Dialog>
  )
}
