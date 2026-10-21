export type TimelineCategory = "upcoming" | "overdue" | "completed" | "undated";
type SortField = "deadline" | "priority";

export interface TimelineEntry {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  deadline?: Date;
  source: "commitment" | "workspace_item";
}

const priorityRank: Record<string, number> = {
  urgent: 4,
  high: 3,
  medium: 2,
  low: 1,
};

export function sortEntries(
  entries: TimelineEntry[],
  sortBy: SortField = "deadline"
): TimelineEntry[] {
  return [...entries].sort((a, b) => {
    if (sortBy === "priority") {
      const diff = (priorityRank[b.priority] ?? 0) - (priorityRank[a.priority] ?? 0);
      if (diff !== 0) return diff;
    }

    if (!a.deadline && !b.deadline) return 0;
    if (!a.deadline) return 1;
    if (!b.deadline) return -1;
    return a.deadline.getTime() - b.deadline.getTime();
  });
}

export function getTimelineCategory(
  entry: TimelineEntry,
  now: Date = new Date()
): TimelineCategory {
  if (entry.status === "completed") return "completed";
  if (!entry.deadline) return "undated";
  if (entry.deadline.getTime() < now.getTime()) return "overdue";
  return "upcoming";
}

export function organizeTimeline(entries: TimelineEntry[], now: Date = new Date()) {
  const timeline: Record<TimelineCategory, TimelineEntry[]> = {
    overdue: [],
    upcoming: [],
    completed: [],
    undated: [],
  };

  for (const entry of entries) {
    const category = getTimelineCategory(entry, now);
    timeline[category].push(entry);
  }

  const summary = {
    total: entries.length,
    overdue: timeline.overdue.length,
    upcoming: timeline.upcoming.length,
    completed: timeline.completed.length,
    undated: timeline.undated.length,
  };

  return { ...timeline, summary };
}
