import { Badge } from '@/components/ui/Badge'
import type { ActionabilityResult } from '@/types/workspace-item'

const styles = {
  actionable: 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400',
  informational: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  uncertain: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
}

export function ActionabilityBadge({ decision, reason }: ActionabilityResult) {
  return (
    <div className="flex items-center gap-2">
      <Badge className={styles[decision]}>{decision}</Badge>
      <span className="text-xs text-gray-500 dark:text-gray-400">{reason}</span>
    </div>
  )
}
