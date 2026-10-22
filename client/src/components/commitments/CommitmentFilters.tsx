import { Select } from '@/components/ui/Select'
import { commitmentStatusLabels, priorityLabels } from '@/lib/constants'

interface CommitmentFiltersProps {
  filters: Record<string, string>
  onChange: (filters: Record<string, string>) => void
}

const statusOptions = Object.entries(commitmentStatusLabels).map(([value, label]) => ({ value, label }))
const priorityOptions = Object.entries(priorityLabels).map(([value, label]) => ({ value, label }))

export function CommitmentFilters({ filters, onChange }: CommitmentFiltersProps) {
  const update = (key: string, value: string) => {
    const next = { ...filters }
    if (value) {
      next[key] = value
    } else {
      delete next[key]
    }
    onChange(next)
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Select value={filters.status ?? ''} onChange={(v) => update('status', v)} options={statusOptions} placeholder="All Statuses" />
      <Select value={filters.priority ?? ''} onChange={(v) => update('priority', v)} options={priorityOptions} placeholder="All Priorities" />
    </div>
  )
}
