import { Button } from '@/components/ui/Button'
import type { TimelineSortBy } from '@/types/timeline'

interface TimelineSortToggleProps {
  sortBy: TimelineSortBy
  onChange: (sortBy: TimelineSortBy) => void
}

export function TimelineSortToggle({ sortBy, onChange }: TimelineSortToggleProps) {
  return (
    <div className="flex gap-1">
      <Button
        size="sm"
        variant={sortBy === 'deadline' ? 'primary' : 'secondary'}
        onClick={() => onChange('deadline')}
      >
        By Deadline
      </Button>
      <Button
        size="sm"
        variant={sortBy === 'priority' ? 'primary' : 'secondary'}
        onClick={() => onChange('priority')}
      >
        By Priority
      </Button>
    </div>
  )
}
