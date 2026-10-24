import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { commitmentStatusLabels, priorityLabels } from '@/lib/constants'
import type { Commitment, CreateCommitmentPayload } from '@/types/commitment'

interface CommitmentFormProps {
  initial?: Commitment
  workspaceItemId?: string
  onSubmit: (data: CreateCommitmentPayload) => void
  onCancel: () => void
  isPending?: boolean
}

const statusOptions = Object.entries(commitmentStatusLabels).map(([value, label]) => ({ value, label }))
const priorityOptions = Object.entries(priorityLabels).map(([value, label]) => ({ value, label }))

export function CommitmentForm({ initial, workspaceItemId, onSubmit, onCancel, isPending }: CommitmentFormProps) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [status, setStatus] = useState(initial?.status ?? 'not_started')
  const [priority, setPriority] = useState(initial?.priority ?? 'medium')
  const [deadline, setDeadline] = useState(initial?.deadline?.slice(0, 10) ?? '')
  const [itemId, setItemId] = useState(initial?.workspaceItemId ?? workspaceItemId ?? '')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const e: Record<string, string> = {}
    if (!title.trim()) e.title = 'Title is required'
    if (!description.trim()) e.description = 'Description is required'
    if (!itemId.trim()) e.workspaceItemId = 'Workspace Item ID is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    const payload: CreateCommitmentPayload = {
      title: title.trim(),
      description: description.trim(),
      status: status as CreateCommitmentPayload['status'],
      priority: priority as CreateCommitmentPayload['priority'],
      workspaceItemId: itemId.trim(),
    }
    if (deadline) payload.deadline = deadline
    onSubmit(payload)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input id="title" label="Title" value={title} onChange={(e) => setTitle(e.target.value)} error={errors.title} />
      <Textarea id="description" label="Description" value={description} onChange={(e) => setDescription(e.target.value)} error={errors.description} />
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="block font-satoshi text-sm font-medium text-neutral-700 dark:text-neutral-300">Status</label>
          <Select value={status} onChange={setStatus} options={statusOptions} />
        </div>
        <div className="space-y-1">
          <label className="block font-satoshi text-sm font-medium text-neutral-700 dark:text-neutral-300">Priority</label>
          <Select value={priority} onChange={setPriority} options={priorityOptions} />
        </div>
      </div>
      <Input id="deadline" label="Deadline" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
      <Input id="workspaceItemId" label="Workspace Item ID" value={itemId} onChange={(e) => setItemId(e.target.value)} error={errors.workspaceItemId} />
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isPending}>{initial ? 'Update' : 'Create'}</Button>
      </div>
    </form>
  )
}
