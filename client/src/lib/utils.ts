import type { Priority } from '@/types/common'

export function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function priorityColor(priority: Priority): string {
  const colors: Record<Priority, string> = {
    urgent: 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950',
    high: 'text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-950',
    medium: 'text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-950',
    low: 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-950',
  }
  return colors[priority]
}

export function statusLabel(status: string): string {
  return status
    .split('_')
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ')
}
