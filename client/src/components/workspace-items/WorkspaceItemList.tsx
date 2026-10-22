import { WorkspaceItemCard } from './WorkspaceItemCard'
import type { WorkspaceItem } from '@/types/workspace-item'

interface WorkspaceItemListProps {
  items: WorkspaceItem[]
  onEdit?: (item: WorkspaceItem) => void
  onDelete?: (item: WorkspaceItem) => void
}

export function WorkspaceItemList({ items, onEdit, onDelete }: WorkspaceItemListProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, i) => (
        <div key={item._id} className="animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
          <WorkspaceItemCard item={item} onEdit={onEdit} onDelete={onDelete} />
        </div>
      ))}
    </div>
  )
}
