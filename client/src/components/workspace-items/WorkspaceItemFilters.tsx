import { Select } from '@/components/ui/Select'
import { itemTypeLabels, itemStatusLabels, priorityLabels } from '@/lib/constants'

interface WorkspaceItemFiltersProps {
  filters: Record<string, string>
  onChange: (filters: Record<string, string>) => void
}

const typeOptions = Object.entries(itemTypeLabels).map(([value, label]) => ({ value, label }))
const statusOptions = Object.entries(itemStatusLabels).map(([value, label]) => ({ value, label }))
const priorityOptions = Object.entries(priorityLabels).map(([value, label]) => ({ value, label }))

export function WorkspaceItemFilters({ filters, onChange }: WorkspaceItemFiltersProps) {
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
      <Select value={filters.type ?? ''} onChange={(v) => update('type', v)} options={typeOptions} placeholder="All Types" />
      <Select value={filters.status ?? ''} onChange={(v) => update('status', v)} options={statusOptions} placeholder="All Statuses" />
      <Select value={filters.priority ?? ''} onChange={(v) => update('priority', v)} options={priorityOptions} placeholder="All Priorities" />
    </div>
  )
}
