import { Badge } from '@/components/ui/Badge'
import type { ActionabilityResult } from '@/types/workspace-item'

const styles = {
  actionable: 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400',
  informational: 'bg-neutral-950/5 text-neutral-600 dark:bg-neutral-50/10 dark:text-neutral-400',
  uncertain: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
}

export function ActionabilityBadge({ decision, reason }: ActionabilityResult) {
  return (
    <div className="flex items-center gap-2">
      <Badge className={styles[decision]}>{decision}</Badge>
      <span className="font-newsreader text-xs text-neutral-500 dark:text-neutral-400">{reason}</span>
    </div>
  )
}
