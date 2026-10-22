import { Select } from '@/components/ui/Select'
import { commitmentStatusLabels } from '@/lib/constants'
import type { CommitmentStatus } from '@/types/commitment'

interface CommitmentStatusToggleProps {
  status: CommitmentStatus
  onChange: (status: CommitmentStatus) => void
  disabled?: boolean
}

const options = Object.entries(commitmentStatusLabels).map(([value, label]) => ({ value, label }))

export function CommitmentStatusToggle({ status, onChange, disabled }: CommitmentStatusToggleProps) {
  return (
    <Select
      value={status}
      onChange={(v) => onChange(v as CommitmentStatus)}
      options={options}
      className={disabled ? 'opacity-50 pointer-events-none' : ''}
    />
  )
}
