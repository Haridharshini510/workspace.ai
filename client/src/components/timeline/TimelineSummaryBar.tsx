import type { TimelineSummary } from '@/types/timeline'

const cards = [
  { key: 'overdue' as const, label: 'Overdue', color: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400' },
  { key: 'upcoming' as const, label: 'Upcoming', color: 'bg-neutral-950/5 text-neutral-950 dark:bg-neutral-50/10 dark:text-neutral-50' },
  { key: 'completed' as const, label: 'Completed', color: 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400' },
  { key: 'undated' as const, label: 'Undated', color: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300' },
]

export function TimelineSummaryBar({ summary }: { summary: TimelineSummary }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {cards.map(({ key, label, color }) => (
        <div key={key} className={`rounded-xl p-3 ${color}`}>
          <p className="font-satoshi text-2xl font-bold">{summary[key]}</p>
          <p className="font-satoshi text-xs font-medium">{label}</p>
        </div>
      ))}
    </div>
  )
}
