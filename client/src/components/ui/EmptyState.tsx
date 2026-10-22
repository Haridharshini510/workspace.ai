import { Inbox } from 'lucide-react'

interface EmptyStateProps {
  title?: string
  message?: string
}

export function EmptyState({ title = 'Nothing here yet', message = 'Items will appear here once created.' }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
      <Inbox className="h-12 w-12 text-gray-300 dark:text-gray-600" />
      <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>
    </div>
  )
}
