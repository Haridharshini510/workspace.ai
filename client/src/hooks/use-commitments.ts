import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/constants'
import { useToast } from '@/components/ui/ToastProvider'
import { fetchCommitments, fetchCommitment, createCommitment, updateCommitment, deleteCommitment } from '@/api/commitments'
import type { CreateCommitmentPayload, UpdateCommitmentPayload } from '@/types/commitment'

export function useCommitments(filters?: Record<string, string>) {
  return useQuery({
    queryKey: queryKeys.commitments.list(filters),
    queryFn: () => fetchCommitments(filters),
  })
}

export function useCommitment(id: string) {
  return useQuery({
    queryKey: queryKeys.commitments.detail(id),
    queryFn: () => fetchCommitment(id),
    enabled: !!id,
  })
}

export function useCreateCommitment() {
  const qc = useQueryClient()
  const { addToast } = useToast()
  return useMutation({
    mutationFn: (payload: CreateCommitmentPayload) => createCommitment(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.commitments.all })
      qc.invalidateQueries({ queryKey: queryKeys.timeline.all })
      qc.invalidateQueries({ queryKey: queryKeys.workspaceItems.all })
      addToast('Commitment created', 'success')
    },
    onError: () => addToast('Failed to create commitment', 'error'),
  })
}

export function useUpdateCommitment() {
  const qc = useQueryClient()
  const { addToast } = useToast()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCommitmentPayload }) =>
      updateCommitment(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.commitments.all })
      qc.invalidateQueries({ queryKey: queryKeys.timeline.all })
      addToast('Commitment updated', 'success')
    },
    onError: () => addToast('Failed to update commitment', 'error'),
  })
}

export function useDeleteCommitment() {
  const qc = useQueryClient()
  const { addToast } = useToast()
  return useMutation({
    mutationFn: (id: string) => deleteCommitment(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.commitments.all })
      qc.invalidateQueries({ queryKey: queryKeys.timeline.all })
      addToast('Commitment deleted', 'success')
    },
    onError: () => addToast('Failed to delete commitment', 'error'),
  })
}
