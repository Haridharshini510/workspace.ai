import { Badge } from '@/components/ui/Badge'
import { priorityColor, formatDate } from '@/lib/utils'
import { itemTypeLabels, itemStatusLabels } from '@/lib/constants'
import type { WorkspaceItem } from '@/types/workspace-item'

export function WorkspaceItemDetail({ item }: { item: WorkspaceItem }) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-satoshi text-2xl font-bold text-neutral-950 dark:text-neutral-50">{item.title}</h2>
        <p className="mt-2 font-newsreader text-sm text-neutral-600 dark:text-neutral-400">{item.description}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge className="bg-neutral-950/5 text-neutral-600 dark:bg-neutral-50/10 dark:text-neutral-300">
          {itemTypeLabels[item.type]}
        </Badge>
        <Badge className="bg-neutral-950/5 text-neutral-600 dark:bg-neutral-50/10 dark:text-neutral-400">
          {itemStatusLabels[item.status]}
        </Badge>
        <Badge className={priorityColor(item.priority)}>{item.priority}</Badge>
      </div>
      <dl className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="font-satoshi text-neutral-500 dark:text-neutral-400">Source</dt>
          <dd className="font-satoshi font-medium text-neutral-950 dark:text-neutral-50">{item.source}</dd>
        </div>
        <div>
          <dt className="font-satoshi text-neutral-500 dark:text-neutral-400">Deadline</dt>
          <dd className="font-satoshi font-medium text-neutral-950 dark:text-neutral-50">{formatDate(item.deadline)}</dd>
        </div>
        {item.eventDate && (
          <div>
            <dt className="font-satoshi text-neutral-500 dark:text-neutral-400">Event Date</dt>
            <dd className="font-satoshi font-medium text-neutral-950 dark:text-neutral-50">{formatDate(item.eventDate)}</dd>
          </div>
        )}
        <div>
          <dt className="font-satoshi text-neutral-500 dark:text-neutral-400">Created</dt>
          <dd className="font-satoshi font-medium text-neutral-950 dark:text-neutral-50">{formatDate(item.createdAt)}</dd>
        </div>
      </dl>
    </div>
  )
}
