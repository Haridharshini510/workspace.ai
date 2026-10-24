import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { WorkspaceItemCard } from '@/components/workspace-items/WorkspaceItemCard'
import type { WorkspaceItem } from '@/types/workspace-item'

interface OpportunitySourceSectionProps {
  source: string
  items: WorkspaceItem[]
}

export function OpportunitySourceSection({ source, items }: OpportunitySourceSectionProps) {
  const [expanded, setExpanded] = useState(true)

  return (
    <section>
      <button
        onClick={() => setExpanded((e) => !e)}
        className="flex w-full items-center gap-2 py-2 text-left font-satoshi text-sm font-semibold text-neutral-950 dark:text-neutral-50"
      >
        {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        {source}
        <span className="text-xs font-normal text-neutral-400">({items.length})</span>
      </button>
      {expanded && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <div key={item._id} className="animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
              <WorkspaceItemCard item={item} />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
