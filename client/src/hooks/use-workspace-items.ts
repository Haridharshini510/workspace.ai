import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/constants'
import { useToast } from '@/components/ui/ToastProvider'
import {
  fetchWorkspaceItems,
  fetchWorkspaceItem,
  createWorkspaceItem,
  updateWorkspaceItem,
  deleteWorkspaceItem,
  fetchActionability,
  fetchItemCommitments,
  generateItemCommitment,
} from '@/api/workspace-items'
import type { CreateWorkspaceItemPayload, UpdateWorkspaceItemPayload } from '@/types/workspace-item'

export function useWorkspaceItems(filters?: Record<string, string>) {
  return useQuery({
    queryKey: queryKeys.workspaceItems.list(filters),
    queryFn: () => fetchWorkspaceItems(filters),
  })
}

export function useWorkspaceItem(id: string) {
  return useQuery({
    queryKey: queryKeys.workspaceItems.detail(id),
    queryFn: () => fetchWorkspaceItem(id),
    enabled: !!id,
  })
}

export function useCreateWorkspaceItem() {
  const qc = useQueryClient()
  const { addToast } = useToast()
  return useMutation({
    mutationFn: (payload: CreateWorkspaceItemPayload) => createWorkspaceItem(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.workspaceItems.all })
      addToast('Item created', 'success')
    },
    onError: () => addToast('Failed to create item', 'error'),
  })
}

export function useUpdateWorkspaceItem() {
  const qc = useQueryClient()
  const { addToast } = useToast()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateWorkspaceItemPayload }) =>
      updateWorkspaceItem(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.workspaceItems.all })
      addToast('Item updated', 'success')
    },
    onError: () => addToast('Failed to update item', 'error'),
  })
}

export function useDeleteWorkspaceItem() {
  const qc = useQueryClient()
  const { addToast } = useToast()
  return useMutation({
    mutationFn: (id: string) => deleteWorkspaceItem(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.workspaceItems.all })
      qc.invalidateQueries({ queryKey: queryKeys.commitments.all })
      qc.invalidateQueries({ queryKey: queryKeys.timeline.all })
      addToast('Item deleted', 'success')
    },
    onError: () => addToast('Failed to delete item', 'error'),
  })
}

export function useActionability(id: string) {
  return useQuery({
    queryKey: queryKeys.workspaceItems.actionability(id),
    queryFn: () => fetchActionability(id),
    enabled: !!id,
  })
}

export function useItemCommitments(id: string) {
  return useQuery({
    queryKey: queryKeys.workspaceItems.commitments(id),
    queryFn: () => fetchItemCommitments(id),
    enabled: !!id,
  })
}

export function useGenerateCommitment() {
  const qc = useQueryClient()
  const { addToast } = useToast()
  return useMutation({
    mutationFn: (id: string) => generateItemCommitment(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.commitments.all })
      qc.invalidateQueries({ queryKey: queryKeys.workspaceItems.all })
      qc.invalidateQueries({ queryKey: queryKeys.timeline.all })
      addToast('Commitment generated', 'success')
    },
    onError: () => addToast('Failed to generate commitment', 'error'),
  })
}
