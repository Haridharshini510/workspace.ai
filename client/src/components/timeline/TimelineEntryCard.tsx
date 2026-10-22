import { Badge } from '@/components/ui/Badge'
import { priorityColor, formatDate, statusLabel } from '@/lib/utils'
import type { TimelineEntry } from '@/types/timeline'

export function TimelineEntryCard({ entry }: { entry: TimelineEntry }) {
  return (
    <div className="rounded-md border border-gray-200 bg-white p-3 transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-900">
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-1">{entry.title}</h4>
        <Badge className={priorityColor(entry.priority)}>{entry.priority}</Badge>
      </div>
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{entry.description}</p>
      <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
        <span>{statusLabel(entry.status)}</span>
        <Badge className="bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
          {entry.source === 'commitment' ? 'Commitment' : 'Item'}
        </Badge>
        {entry.deadline && <span className="ml-auto">{formatDate(entry.deadline)}</span>}
      </div>
    </div>
  )
}
