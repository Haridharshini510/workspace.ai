import { useNavigate } from 'react-router-dom'
import { Calendar, Pencil, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { routes, itemTypeLabels } from '@/lib/constants'
import { priorityColor, formatDate } from '@/lib/utils'
import type { WorkspaceItem } from '@/types/workspace-item'

interface WorkspaceItemCardProps {
  item: WorkspaceItem
  onEdit?: (item: WorkspaceItem) => void
  onDelete?: (item: WorkspaceItem) => void
}

export function WorkspaceItemCard({ item, onEdit, onDelete }: WorkspaceItemCardProps) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(routes.itemDetail(item._id))}
      className="cursor-pointer rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-900"
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">{item.title}</h3>
        <div className="flex shrink-0 items-center gap-1">
          <Badge className={priorityColor(item.priority)}>{item.priority}</Badge>
          {onEdit && (
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(item) }}
              className="rounded p-1 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(item) }}
              className="rounded p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
      <p className="mb-3 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{item.description}</p>
      <div className="flex flex-wrap items-center gap-2">
        <Badge className="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
          {itemTypeLabels[item.type] ?? item.type}
        </Badge>
        <Badge className="bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
          {item.status}
        </Badge>
        {item.deadline && (
          <span className="ml-auto flex items-center gap-1 text-xs text-gray-400">
            <Calendar className="h-3 w-3" />
            {formatDate(item.deadline)}
          </span>
        )}
      </div>
    </div>
  )
}
