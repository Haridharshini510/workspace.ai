import type { Priority } from './common'

export type WorkspaceItemType = 'information' | 'opportunity' | 'event' | 'announcement'
export type WorkspaceItemStatus = 'open' | 'closed' | 'upcoming' | 'active' | 'expired'

export interface WorkspaceItem {
  _id: string
  title: string
  description: string
  type: WorkspaceItemType
  status: WorkspaceItemStatus
  priority: Priority
  source: string
  deadline?: string
  eventDate?: string
  createdAt: string
  updatedAt: string
}

export interface CreateWorkspaceItemPayload {
  title: string
  description: string
  type: WorkspaceItemType
  status: WorkspaceItemStatus
  priority: Priority
  source: string
  deadline?: string
  eventDate?: string
  hiddenFromTimeline?: boolean
}

export type UpdateWorkspaceItemPayload = Partial<CreateWorkspaceItemPayload>

export type ActionabilityDecision = 'actionable' | 'informational' | 'uncertain'

export interface ActionabilityResult {
  decision: ActionabilityDecision
  reason: string
}

export type CommitmentGenerationOutcome = 'created' | 'informational' | 'needs_review' | 'already_exists'

export interface CommitmentGenerationResult {
  outcome: CommitmentGenerationOutcome
  commitment?: import('./commitment').Commitment
  reason?: string
}
