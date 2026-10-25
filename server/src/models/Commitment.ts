import { Schema, model, Types } from "mongoose";
import { IWorkspaceItem } from "./WorkspaceItem.js";
import type { HydratedDocument } from "mongoose";
interface ICommitment {
  title: string;
  description: string;
  status: string;
  priority: string;
  deadline?: Date;
  workspaceItemId: Types.ObjectId;
  hiddenFromTimeline?: boolean;
}

const commitmentSchema = new Schema<ICommitment>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, required: true, enum: ["not_started", "in_progress", "completed", "dismissed"] },
    priority: { type: String, required: true, enum: ["urgent", "high", "medium", "low"] },
    deadline: { type: Date },
    workspaceItemId: { type: Types.ObjectId, ref: "WorkspaceItem", required: true },
    hiddenFromTimeline: { type: Boolean, default: false },
  },
  { timestamps: true }
);


export const Commitment = model<ICommitment>("Commitment", commitmentSchema);
export type { ICommitment };
