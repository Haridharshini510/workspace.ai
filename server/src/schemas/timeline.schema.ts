import { z } from "zod";

export const timelineQuerySchema = z.object({
  category: z.enum(["overdue", "upcoming", "completed", "undated"]).optional(),
  sortBy: z.enum(["deadline", "priority"]).optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
});
