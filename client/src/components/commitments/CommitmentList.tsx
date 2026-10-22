import { CommitmentCard } from './CommitmentCard'
import type { Commitment, CommitmentStatus } from '@/types/commitment'

interface CommitmentListProps {
  commitments: Commitment[]
  onEdit?: (commitment: Commitment) => void
  onDelete?: (commitment: Commitment) => void
  onStatusChange?: (id: string, status: CommitmentStatus) => void
  statusPending?: boolean
}

export function CommitmentList({ commitments, onEdit, onDelete, onStatusChange, statusPending }: CommitmentListProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {commitments.map((c, i) => (
        <div key={c._id} className="animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
          <CommitmentCard
            commitment={c}
            onEdit={onEdit}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
            statusPending={statusPending}
          />
        </div>
      ))}
    </div>
  )
}
