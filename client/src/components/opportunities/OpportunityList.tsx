import { OpportunitySourceSection } from './OpportunitySourceSection'
import type { WorkspaceItem } from '@/types/workspace-item'

const KNOWN_SOURCES = ['Unstop', 'Devfolio', 'Devpost', 'Luma']

interface OpportunityListProps {
  items: WorkspaceItem[]
}

export function OpportunityList({ items }: OpportunityListProps) {
  const grouped = new Map<string, WorkspaceItem[]>()
  for (const item of items) {
    const key = item.source || 'Other'
    if (!grouped.has(key)) grouped.set(key, [])
    grouped.get(key)!.push(item)
  }

  const sorted = [...grouped.entries()].sort(([a], [b]) => {
    const ai = KNOWN_SOURCES.indexOf(a)
    const bi = KNOWN_SOURCES.indexOf(b)
    if (ai !== -1 && bi !== -1) return ai - bi
    if (ai !== -1) return -1
    if (bi !== -1) return 1
    return a.localeCompare(b)
  })

  return (
    <div className="space-y-4">
      {sorted.map(([source, group]) => (
        <OpportunitySourceSection key={source} source={source} items={group} />
      ))}
    </div>
  )
}
