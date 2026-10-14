
import { Commitment } from "../models/Commitment.js";
import type { HydratedDocument } from "mongoose";
import type { IWorkspaceItem } from "../models/WorkspaceItem.js";
import { determinePriority } from "./priorityService.js";

export async function syncCommitmentFromWorkspaceItem(
  item: HydratedDocument<IWorkspaceItem>
): Promise<void> {
  
  const commitment = await Commitment.findOne({
    workspaceItemId: item._id,
  });

  if (!commitment) {
    return;
  }
  
  commitment.deadline = item.deadline;

  commitment.priority = determinePriority({
    title: item.title,
    description: item.description,
    deadline: item.deadline,
  });

  await commitment.save();


}
