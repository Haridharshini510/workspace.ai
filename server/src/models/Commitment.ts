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
  userId: Types.ObjectId;
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
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

commitmentSchema.index({ userId: 1, createdAt: -1 });
commitmentSchema.index({ userId: 1, status: 1 });
commitmentSchema.index({ userId: 1, priority: 1 });
commitmentSchema.index({ userId: 1, deadline: 1 });
commitmentSchema.index({ userId: 1, hiddenFromTimeline: 1, deadline: 1 });
commitmentSchema.index({ workspaceItemId: 1 });
commitmentSchema.index({ userId: 1, status: 1, deadline: 1 });

export const Commitment = model<ICommitment>("Commitment", commitmentSchema);
export type { ICommitment };
