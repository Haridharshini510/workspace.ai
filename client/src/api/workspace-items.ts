import { api } from './client'
import type { WorkspaceItem, CreateWorkspaceItemPayload, UpdateWorkspaceItemPayload, ActionabilityResult, CommitmentGenerationResult } from '@/types/workspace-item'
import type { Commitment } from '@/types/commitment'

export function fetchWorkspaceItems(filters?: Record<string, string>) {
  const params = new URLSearchParams(filters).toString()
  const query = params ? `?${params}` : ''
  return api.get<WorkspaceItem[]>(`/workspace-items${query}`)
}

export function fetchWorkspaceItem(id: string) {
  return api.get<WorkspaceItem>(`/workspace-items/${id}`)
}

export function createWorkspaceItem(payload: CreateWorkspaceItemPayload) {
  return api.post<WorkspaceItem>('/workspace-items', payload)
}

export function updateWorkspaceItem(id: string, payload: UpdateWorkspaceItemPayload) {
  return api.patch<WorkspaceItem>(`/workspace-items/${id}`, payload)
}

export function deleteWorkspaceItem(id: string) {
  return api.del<WorkspaceItem>(`/workspace-items/${id}`)
}

export function fetchActionability(id: string) {
  return api.get<ActionabilityResult>(`/workspace-items/${id}/actionability`)
}

export function fetchItemCommitments(id: string) {
  return api.get<Commitment[]>(`/workspace-items/${id}/commitments`)
}

export function generateItemCommitment(id: string) {
  return api.post<CommitmentGenerationResult>(`/workspace-items/${id}/generate-commitment`, {})
}
