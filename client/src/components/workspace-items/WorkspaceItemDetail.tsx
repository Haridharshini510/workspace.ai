import { Badge } from '@/components/ui/Badge'
import { priorityColor, formatDate } from '@/lib/utils'
import { itemTypeLabels, itemStatusLabels } from '@/lib/constants'
import type { WorkspaceItem } from '@/types/workspace-item'

export function WorkspaceItemDetail({ item }: { item: WorkspaceItem }) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{item.title}</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge className="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
          {itemTypeLabels[item.type]}
        </Badge>
        <Badge className="bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
          {itemStatusLabels[item.status]}
        </Badge>
        <Badge className={priorityColor(item.priority)}>{item.priority}</Badge>
      </div>
      <dl className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-gray-500 dark:text-gray-400">Source</dt>
          <dd className="font-medium text-gray-900 dark:text-gray-100">{item.source}</dd>
        </div>
        <div>
          <dt className="text-gray-500 dark:text-gray-400">Deadline</dt>
          <dd className="font-medium text-gray-900 dark:text-gray-100">{formatDate(item.deadline)}</dd>
        </div>
        {item.eventDate && (
          <div>
            <dt className="text-gray-500 dark:text-gray-400">Event Date</dt>
            <dd className="font-medium text-gray-900 dark:text-gray-100">{formatDate(item.eventDate)}</dd>
          </div>
        )}
        <div>
          <dt className="text-gray-500 dark:text-gray-400">Created</dt>
          <dd className="font-medium text-gray-900 dark:text-gray-100">{formatDate(item.createdAt)}</dd>
        </div>
      </dl>
    </div>
  )
}
