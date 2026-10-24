import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Zap } from 'lucide-react'
import { useWorkspaceItem, useActionability, useItemCommitments, useGenerateCommitment } from '@/hooks/use-workspace-items'
import { WorkspaceItemDetail } from '@/components/workspace-items/WorkspaceItemDetail'
import { ActionabilityBadge } from '@/components/workspace-items/ActionabilityBadge'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { priorityColor, formatDate, statusLabel } from '@/lib/utils'
import { routes } from '@/lib/constants'
import type { Priority } from '@/types/common'
import { useState } from 'react'

export default function ItemDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: item, isLoading, isError } = useWorkspaceItem(id!)
  const { data: actionability } = useActionability(id!)
  const { data: commitments } = useItemCommitments(id!)
  const generateMutation = useGenerateCommitment()
  const [generateMsg, setGenerateMsg] = useState<string | null>(null)

  const handleGenerate = () => {
    setGenerateMsg(null)
    generateMutation.mutate(id!, {
      onSuccess: (result) => {
        if (result.outcome === 'created') {
          setGenerateMsg('Commitment created!')
        } else if (result.outcome === 'already_exists') {
          setGenerateMsg('A commitment already exists for this item.')
        } else {
          setGenerateMsg(result.reason ?? `Outcome: ${result.outcome}`)
        }
      },
    })
  }

  if (isLoading) return <LoadingSpinner />
  if (isError || !item) return <ErrorMessage message="Failed to load item." onRetry={() => navigate(0)} />

  return (
    <div className="space-y-6">
      <Link to={routes.info} className="inline-flex items-center gap-1 font-satoshi text-sm text-neutral-500 transition-colors hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-neutral-50">
        <ArrowLeft className="h-4 w-4" /> Back to items
      </Link>

      <WorkspaceItemDetail item={item} />

      {actionability && (
        <section className="space-y-1">
          <h3 className="font-satoshi text-sm font-semibold text-neutral-700 dark:text-neutral-300">Actionability</h3>
          <ActionabilityBadge {...actionability} />
        </section>
      )}

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-satoshi text-sm font-semibold text-neutral-700 dark:text-neutral-300">Linked Commitments</h3>
          <Button size="sm" onClick={handleGenerate} disabled={generateMutation.isPending}>
            <Zap className="h-3.5 w-3.5" /> Generate Commitment
          </Button>
        </div>
        {generateMsg && (
          <p className="font-newsreader text-sm text-neutral-600 dark:text-neutral-400">{generateMsg}</p>
        )}
        {commitments && commitments.length === 0 && (
          <p className="font-newsreader text-sm text-neutral-500 dark:text-neutral-400">No commitments linked yet.</p>
        )}
        {commitments && commitments.length > 0 && (
          <div className="space-y-2">
            {commitments.map((c) => (
              <div key={c._id} className="rounded-xl border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900">
                <div className="flex items-center justify-between">
                  <span className="font-satoshi text-sm font-medium text-neutral-950 dark:text-neutral-50">{c.title}</span>
                  <Badge className={priorityColor(c.priority as Priority)}>{c.priority}</Badge>
                </div>
                <div className="mt-1 flex gap-2 font-satoshi text-xs text-neutral-500 dark:text-neutral-400">
                  <span>{statusLabel(c.status)}</span>
                  {c.deadline && <span>Due {formatDate(c.deadline)}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
