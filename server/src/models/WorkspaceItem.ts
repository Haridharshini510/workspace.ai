import { Schema, Types, model } from "mongoose";

interface IContextEntry {
  date: Date;
  summary: string;
  emailId: string;
}

interface IWorkspaceItem {
  title: string;
  description: string;
  type: string;
  status: string;
  priority: string;
  source: string;
  sourceEmails: string[];
  threadIds: string[];
  sourceCalendarEventId?: string;
  contextHistory: IContextEntry[];
  deadline?: Date;
  eventDate?: Date;
  hiddenFromTimeline?: boolean;
  userId: Types.ObjectId;
  _id: Types.ObjectId
}

const contextEntrySchema = new Schema<IContextEntry>(
  {
    date: { type: Date, required: true },
    summary: { type: String, required: true },
    emailId: { type: String, required: true },
  },
  { _id: false }
);

const workspaceItemSchema = new Schema<IWorkspaceItem>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, required: true, enum: ["information", "opportunity", "event", "announcement"] },
    status: { type: String, required: true, enum: ["open", "closed", "upcoming", "active", "expired"] },
    priority: { type: String, required: true, enum: ["urgent", "high", "medium", "low"] },
    source: { type: String, required: true },
    sourceEmails: { type: [String], default: [] },
    threadIds: { type: [String], default: [] },
    sourceCalendarEventId: { type: String },
    contextHistory: { type: [contextEntrySchema], default: [] },
    deadline: { type: Date },
    eventDate: { type: Date },
    hiddenFromTimeline: { type: Boolean, default: false },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);


export const WorkspaceItem = model<IWorkspaceItem>("WorkspaceItem", workspaceItemSchema);
export type { IWorkspaceItem };
