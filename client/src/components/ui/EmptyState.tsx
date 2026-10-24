import { Inbox } from 'lucide-react'

interface EmptyStateProps {
  title?: string
  message?: string
}

export function EmptyState({ title = 'Nothing here yet', message = 'Items will appear here once created.' }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
      <Inbox className="h-10 w-10 text-neutral-300 dark:text-neutral-700" />
      <h3 className="font-satoshi text-sm font-medium text-neutral-950 dark:text-neutral-50">{title}</h3>
      <p className="font-newsreader text-sm text-neutral-500 dark:text-neutral-400">{message}</p>
    </div>
  )
}
