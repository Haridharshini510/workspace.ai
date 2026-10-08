import { Schema, model } from "mongoose";

interface IWorkspaceItem {
  title: string;
  description: string;
  type: string;
  status: string;
  priority: string;
  source: string;
  deadline?: Date;
  eventDate?: Date;
}

const workspaceItemSchema = new Schema<IWorkspaceItem>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, required: true },
    status: { type: String, required: true },
    priority: { type: String, required: true },
    source: { type: String, required: true },
    deadline: { type: Date },
    eventDate: { type: Date },
  },
  { timestamps: true }
);


export const WorkspaceItem = model<IWorkspaceItem>("WorkspaceItem", workspaceItemSchema);
export type { IWorkspaceItem };
