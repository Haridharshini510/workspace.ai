import { Pencil, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { CommitmentStatusToggle } from './CommitmentStatusToggle'
import { priorityColor, formatDate } from '@/lib/utils'
import type { Commitment, CommitmentStatus } from '@/types/commitment'

interface CommitmentCardProps {
  commitment: Commitment
  onEdit?: (commitment: Commitment) => void
  onDelete?: (commitment: Commitment) => void
  onStatusChange?: (id: string, status: CommitmentStatus) => void
  statusPending?: boolean
}

export function CommitmentCard({ commitment, onEdit, onDelete, onStatusChange, statusPending }: CommitmentCardProps) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4 transition-colors hover:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-600">
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="font-satoshi text-sm font-semibold text-neutral-950 dark:text-neutral-50 line-clamp-1">{commitment.title}</h3>
        <div className="flex shrink-0 items-center gap-1">
          <Badge className={priorityColor(commitment.priority)}>{commitment.priority}</Badge>
          {onEdit && (
            <button
              onClick={() => onEdit(commitment)}
              className="rounded-full p-1 text-neutral-400 hover:text-neutral-950 dark:hover:text-neutral-50"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(commitment)}
              className="rounded-full p-1 text-neutral-400 hover:text-red-600 dark:hover:text-red-400"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
      <p className="mb-3 font-newsreader text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2">{commitment.description}</p>
      <div className="flex items-center justify-between gap-2">
        {onStatusChange ? (
          <CommitmentStatusToggle
            status={commitment.status}
            onChange={(s) => onStatusChange(commitment._id, s)}
            disabled={statusPending}
          />
        ) : (
          <Badge className="bg-neutral-950/5 text-neutral-600 dark:bg-neutral-50/10 dark:text-neutral-400">
            {commitment.status}
          </Badge>
        )}
        {commitment.deadline && (
          <span className="font-satoshi text-xs text-neutral-400">Due {formatDate(commitment.deadline)}</span>
        )}
      </div>
    </div>
  )
}
