import type { IWorkspaceItem } from "../models/WorkspaceItem.js";
import { determineActionability } from "./actionabilityService.js";
import { Commitment } from "../models/Commitment.js";
import type { HydratedDocument } from "mongoose";
import type { ICommitment } from "../models/Commitment.js";

type CommitmentGenerationResult =
  | { outcome: "created"; commitment: HydratedDocument<ICommitment> }
  | { outcome: "informational"; reason: string }    
  | { outcome: "needs_review"; reason: string }
  | { outcome: "already_exists" };
  
export async function generateCommitment(item: HydratedDocument<IWorkspaceItem>): Promise<CommitmentGenerationResult> {
  const commitmentExists = await Commitment.findOne({ workspaceItemId: item._id });
  if (commitmentExists) {
    return { outcome: "already_exists" };
  }
  const actionability = determineActionability(item)
  if(actionability.decision === "actionable") {
    const commitment = await Commitment.create({
      title: item.title,
      description: item.description,
        status: "not_started",
        priority: "medium",
        deadline: item.deadline,
        workspaceItemId: item._id,
    });
    return { outcome: "created", commitment };
  }
  else if(actionability.decision === "informational") {
    return { outcome: "informational", reason: actionability.reason };
  }
  return { outcome: "needs_review", reason: actionability.reason };
}