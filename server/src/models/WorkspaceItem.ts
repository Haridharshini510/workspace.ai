import { Schema, Types, model } from "mongoose";

interface IWorkspaceItem {
  title: string;
  description: string;
  type: string;
  status: string;
  priority: string;
  source: string;
  deadline?: Date;
  eventDate?: Date;
  hiddenFromTimeline?: boolean;
  userId: Types.ObjectId;
  _id: Types.ObjectId
}

const workspaceItemSchema = new Schema<IWorkspaceItem>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, required: true, enum: ["information", "opportunity", "event", "announcement"] },
    status: { type: String, required: true, enum: ["open", "closed", "upcoming", "active", "expired"] },
    priority: { type: String, required: true, enum: ["urgent", "high", "medium", "low"] },
    source: { type: String, required: true },
    deadline: { type: Date },
    eventDate: { type: Date },
    hiddenFromTimeline: { type: Boolean, default: false },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);


export const WorkspaceItem = model<IWorkspaceItem>("WorkspaceItem", workspaceItemSchema);
export type { IWorkspaceItem };
