import { z } from "zod";

export const createCommitmentSchema = z.object({
  title: z.string(),
  description: z.string(),

  status: z.enum([
    "not_started",
    "in_progress",
    "completed",
    "dismissed",
  ]),

  priority: z.enum([
    "urgent",
    "high",
    "medium",
    "low",
  ]),

  deadline: z.coerce.date().optional(),
  workspaceItemId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId"),
});

export const updateCommitmentSchema =
  createCommitmentSchema.partial();

export const commitmentIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId"),
});