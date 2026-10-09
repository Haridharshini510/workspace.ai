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
}

const commitmentSchema = new Schema<ICommitment>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, required: true },
    priority: { type: String, required: true },
    deadline: { type: Date },
    workspaceItemId: { type: Types.ObjectId, ref: "WorkspaceItem", required: true },
  },
  { timestamps: true }
);


export const Commitment = model<ICommitment>("Commitment", commitmentSchema);
export type { ICommitment };
