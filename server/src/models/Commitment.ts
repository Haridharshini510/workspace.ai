import { Schema, model } from "mongoose";
import { IWorkspaceItem } from "./WorkspaceItem.js";

interface ICommitment {
  title: string;
  description: string;
  status: string;
  priority: string;
  deadline?: Date;
  workspaceItemId: Schema.Types.ObjectId;
}

const commitmentSchema = new Schema<ICommitment>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, required: true },
    priority: { type: String, required: true },
    deadline: { type: Date },
    workspaceItemId: { type: Schema.Types.ObjectId, ref: "WorkspaceItem", required: true },
  },
  { timestamps: true }
);


export const Commitment = model<ICommitment>("Commitment", commitmentSchema);
export type { ICommitment };
