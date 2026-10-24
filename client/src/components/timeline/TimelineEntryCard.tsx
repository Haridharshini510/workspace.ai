import { Badge } from '@/components/ui/Badge'
import { priorityColor, formatDate, statusLabel } from '@/lib/utils'
import type { TimelineEntry } from '@/types/timeline'

export function TimelineEntryCard({ entry }: { entry: TimelineEntry }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-3 transition-colors hover:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-600">
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-satoshi text-sm font-medium text-neutral-950 dark:text-neutral-50 line-clamp-1">{entry.title}</h4>
        <Badge className={priorityColor(entry.priority)}>{entry.priority}</Badge>
      </div>
      <p className="mt-1 font-newsreader text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1">{entry.description}</p>
      <div className="mt-2 flex items-center gap-2 font-satoshi text-xs text-neutral-400">
        <span>{statusLabel(entry.status)}</span>
        <Badge className="bg-neutral-950/5 text-neutral-500 dark:bg-neutral-50/10 dark:text-neutral-400">
          {entry.source === 'commitment' ? 'Commitment' : 'Item'}
        </Badge>
        {entry.deadline && <span className="ml-auto">{formatDate(entry.deadline)}</span>}
      </div>
    </div>
  )
}
