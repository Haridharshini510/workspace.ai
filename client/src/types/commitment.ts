import type { Priority } from './common'

export type CommitmentStatus = 'not_started' | 'in_progress' | 'completed' | 'dismissed'

export interface Commitment {
  _id: string
  title: string
  description: string
  status: CommitmentStatus
  priority: Priority
  deadline?: string
  workspaceItemId: string
  createdAt: string
  updatedAt: string
}

export interface CreateCommitmentPayload {
  title: string
  description: string
  status: CommitmentStatus
  priority: Priority
  deadline?: string
  workspaceItemId: string
  hiddenFromTimeline?: boolean
}

export type UpdateCommitmentPayload = Partial<CreateCommitmentPayload>
