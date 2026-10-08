import { z } from "zod";

export const createWorkspaceItemSchema = z.object({
  title: z.string(),
  description: z.string(),

  type: z.enum([
    "information",
    "opportunity",
    "event",
    "announcement",
  ]),

  status: z.enum([
    "open",
    "closed",
    "upcoming",
    "active",
    "expired",
  ]),

  priority: z.enum([
    "urgent",
    "high",
    "medium",
    "low",
  ]),

  source: z.string(),

  deadline: z.coerce.date().optional(),
  eventDate: z.coerce.date().optional(),
});

export const updateWorkspaceItemSchema =
  createWorkspaceItemSchema.partial();

export const workspaceItemIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId"),
});