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
    <div className="rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-900">
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">{commitment.title}</h3>
        <div className="flex shrink-0 items-center gap-1">
          <Badge className={priorityColor(commitment.priority)}>{commitment.priority}</Badge>
          {onEdit && (
            <button
              onClick={() => onEdit(commitment)}
              className="rounded p-1 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(commitment)}
              className="rounded p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
      <p className="mb-3 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{commitment.description}</p>
      <div className="flex items-center justify-between gap-2">
        {onStatusChange ? (
          <CommitmentStatusToggle
            status={commitment.status}
            onChange={(s) => onStatusChange(commitment._id, s)}
            disabled={statusPending}
          />
        ) : (
          <Badge className="bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
            {commitment.status}
          </Badge>
        )}
        {commitment.deadline && (
          <span className="text-xs text-gray-400">Due {formatDate(commitment.deadline)}</span>
        )}
      </div>
    </div>
  )
}
