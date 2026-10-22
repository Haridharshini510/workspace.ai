import { api } from './client'
import type { Commitment, CreateCommitmentPayload, UpdateCommitmentPayload } from '@/types/commitment'

export function fetchCommitments(filters?: Record<string, string>) {
  const params = new URLSearchParams(filters).toString()
  const query = params ? `?${params}` : ''
  return api.get<Commitment[]>(`/commitments${query}`)
}

export function fetchCommitment(id: string) {
  return api.get<Commitment>(`/commitments/${id}`)
}

export function createCommitment(payload: CreateCommitmentPayload) {
  return api.post<Commitment>('/commitments', payload)
}

export function updateCommitment(id: string, payload: UpdateCommitmentPayload) {
  return api.patch<Commitment>(`/commitments/${id}`, payload)
}

export function deleteCommitment(id: string) {
  return api.del<Commitment>(`/commitments/${id}`)
}
