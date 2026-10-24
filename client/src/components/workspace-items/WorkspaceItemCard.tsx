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
      className="cursor-pointer rounded-xl border border-neutral-200 bg-white p-4 transition-all hover:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-600"
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="font-satoshi text-sm font-semibold text-neutral-950 line-clamp-1 dark:text-neutral-50">{item.title}</h3>
        <div className="flex shrink-0 items-center gap-1">
          <Badge className={priorityColor(item.priority)}>{item.priority}</Badge>
          {onEdit && (
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(item) }}
              className="rounded-full p-1 text-neutral-400 transition-colors hover:text-neutral-950 dark:hover:text-neutral-50"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(item) }}
              className="rounded-full p-1 text-neutral-400 transition-colors hover:text-red-600 dark:hover:text-red-400"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
      <p className="mb-3 font-newsreader text-xs text-neutral-500 line-clamp-2 dark:text-neutral-400">{item.description}</p>
      <div className="flex flex-wrap items-center gap-2">
        <Badge className="bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
          {itemTypeLabels[item.type] ?? item.type}
        </Badge>
        <Badge className="bg-neutral-950/5 text-neutral-950 dark:bg-neutral-50/10 dark:text-neutral-50">
          {item.status}
        </Badge>
        {item.deadline && (
          <span className="ml-auto flex items-center gap-1 font-satoshi text-xs text-neutral-400">
            <Calendar className="h-3 w-3" />
            {formatDate(item.deadline)}
          </span>
        )}
      </div>
    </div>
  )
}
