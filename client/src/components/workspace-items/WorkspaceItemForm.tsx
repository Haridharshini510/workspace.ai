import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { itemTypeLabels, itemStatusLabels, priorityLabels } from '@/lib/constants'
import type { WorkspaceItem, CreateWorkspaceItemPayload } from '@/types/workspace-item'

interface WorkspaceItemFormProps {
  initial?: WorkspaceItem
  onSubmit: (data: CreateWorkspaceItemPayload) => void
  onCancel: () => void
  isPending?: boolean
}

const typeOptions = Object.entries(itemTypeLabels).map(([value, label]) => ({ value, label }))
const statusOptions = Object.entries(itemStatusLabels).map(([value, label]) => ({ value, label }))
const priorityOptions = Object.entries(priorityLabels).map(([value, label]) => ({ value, label }))

export function WorkspaceItemForm({ initial, onSubmit, onCancel, isPending }: WorkspaceItemFormProps) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [type, setType] = useState(initial?.type ?? 'information')
  const [status, setStatus] = useState(initial?.status ?? 'open')
  const [priority, setPriority] = useState(initial?.priority ?? 'medium')
  const [source, setSource] = useState(initial?.source ?? '')
  const [deadline, setDeadline] = useState(initial?.deadline?.slice(0, 10) ?? '')
  const [eventDate, setEventDate] = useState(initial?.eventDate?.slice(0, 10) ?? '')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const e: Record<string, string> = {}
    if (!title.trim()) e.title = 'Title is required'
    if (!description.trim()) e.description = 'Description is required'
    if (!source.trim()) e.source = 'Source is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    const payload: CreateWorkspaceItemPayload = {
      title: title.trim(),
      description: description.trim(),
      type: type as CreateWorkspaceItemPayload['type'],
      status: status as CreateWorkspaceItemPayload['status'],
      priority: priority as CreateWorkspaceItemPayload['priority'],
      source: source.trim(),
    }
    if (deadline) payload.deadline = deadline
    if (eventDate) payload.eventDate = eventDate
    onSubmit(payload)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input id="title" label="Title" value={title} onChange={(e) => setTitle(e.target.value)} error={errors.title} />
      <Textarea id="description" label="Description" value={description} onChange={(e) => setDescription(e.target.value)} error={errors.description} />
      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
          <Select value={type} onChange={setType} options={typeOptions} />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
          <Select value={status} onChange={setStatus} options={statusOptions} />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Priority</label>
          <Select value={priority} onChange={setPriority} options={priorityOptions} />
        </div>
      </div>
      <Input id="source" label="Source" value={source} onChange={(e) => setSource(e.target.value)} error={errors.source} />
      <div className="grid grid-cols-2 gap-3">
        <Input id="deadline" label="Deadline" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
        <Input id="eventDate" label="Event Date" type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isPending}>{initial ? 'Update' : 'Create'}</Button>
      </div>
    </form>
  )
}
