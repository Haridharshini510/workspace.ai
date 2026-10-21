import type { Request, Response } from "express";
import { Commitment } from "../models/Commitment.js";
import { WorkspaceItem } from "../models/WorkspaceItem.js";
import {
  organizeTimeline,
  sortEntries,
  type TimelineEntry,
  type TimelineCategory,
} from "../services/timelineService.js";

function toTimelineEntry(
  doc: { _id: unknown; title: string; description: string; status: string; priority: string; deadline?: Date; eventDate?: Date },
  source: "commitment" | "workspace_item"
): TimelineEntry {
  const completedStatuses = ["completed", "closed", "expired"];
  return {
    _id: String(doc._id),
    title: doc.title,
    description: doc.description,
    status: completedStatuses.includes(doc.status) ? "completed" : doc.status,
    priority: doc.priority,
    deadline: doc.deadline ?? doc.eventDate,
    source,
  };
}

export async function getTimeline(req: Request, res: Response) {
  try {
    const { category, sortBy, page, limit } = req.query as unknown as {
      category?: TimelineCategory;
      sortBy?: "deadline" | "priority";
      page: number;
      limit: number;
    };

    const [commitments, workspaceItems] = await Promise.all([
      Commitment.find(),
      WorkspaceItem.find({
        $or: [
          { deadline: { $ne: null } },
          { eventDate: { $ne: null } },
        ],
      }),
    ]);

    const entries: TimelineEntry[] = [
      ...commitments.map((c) => toTimelineEntry(c, "commitment")),
      ...workspaceItems.map((w) => toTimelineEntry(w, "workspace_item")),
    ];

    const timeline = organizeTimeline(entries);
    const selectedSort = sortBy ?? "deadline";

    function paginate(items: TimelineEntry[]) {
      const total = items.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      return {
        items: items.slice(startIndex, startIndex + limit),
        pagination: { page, limit, total, totalPages },
      };
    }

    if (category) {
      const sorted = sortEntries(timeline[category], selectedSort);
      const result = paginate(sorted);
      res.status(200).json({
        category,
        sortBy: selectedSort,
        entries: result.items,
        pagination: result.pagination,
      });
      return;
    }

    const overdue = paginate(sortEntries(timeline.overdue, selectedSort));
    const upcoming = paginate(sortEntries(timeline.upcoming, selectedSort));
    const completed = paginate(sortEntries(timeline.completed, selectedSort));
    const undated = paginate(sortEntries(timeline.undated, selectedSort));

    res.status(200).json({
      overdue: overdue.items,
      upcoming: upcoming.items,
      completed: completed.items,
      undated: undated.items,
      summary: timeline.summary,
      sortBy: selectedSort,
      pagination: {
        page,
        limit,
        overdue: { total: overdue.pagination.total, totalPages: overdue.pagination.totalPages },
        upcoming: { total: upcoming.pagination.total, totalPages: upcoming.pagination.totalPages },
        completed: { total: completed.pagination.total, totalPages: completed.pagination.totalPages },
        undated: { total: undated.pagination.total, totalPages: undated.pagination.totalPages },
      },
    });
  } catch (error) {
    console.error("Failed to fetch timeline:", error);
    res.status(500).json({ error: "Failed to fetch timeline" });
  }
}
