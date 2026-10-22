import type { TimelineSummary } from '@/types/timeline'

const cards = [
  { key: 'overdue' as const, label: 'Overdue', color: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400' },
  { key: 'upcoming' as const, label: 'Upcoming', color: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400' },
  { key: 'completed' as const, label: 'Completed', color: 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400' },
  { key: 'undated' as const, label: 'Undated', color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' },
]

export function TimelineSummaryBar({ summary }: { summary: TimelineSummary }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {cards.map(({ key, label, color }) => (
        <div key={key} className={`rounded-lg p-3 ${color}`}>
          <p className="text-2xl font-bold">{summary[key]}</p>
          <p className="text-xs font-medium">{label}</p>
        </div>
      ))}
    </div>
  )
}
