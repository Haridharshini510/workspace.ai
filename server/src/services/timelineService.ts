import type { HydratedDocument } from "mongoose";
import type { ICommitment } from "../models/Commitment.js";
export type TimelineCategory =
  | "upcoming"
  | "overdue"
  | "completed"
  | "undated";

export function getTimelineCategory(
  commitment: HydratedDocument<ICommitment>,
  now: Date = new Date()
): TimelineCategory {
  if (commitment.status === "completed") {
    return "completed";
  }

  if (!commitment.deadline) {
    return "undated";
  }

  if (commitment.deadline.getTime() < now.getTime()) {
    return "overdue";
  }

  return "upcoming";
}

export function organizeTimeline(
  commitments: HydratedDocument<ICommitment>[],
  now: Date = new Date()
) {
  const timeline = {
    overdue: [] as HydratedDocument<ICommitment>[],
    upcoming: [] as HydratedDocument<ICommitment>[],
    completed: [] as HydratedDocument<ICommitment>[],
    undated: [] as HydratedDocument<ICommitment>[],
  };

  for (const commitment of commitments) {
    const category = getTimelineCategory(commitment, now);
    timeline[category].push(commitment);
  }

  timeline.overdue.sort(
    (a, b) => a.deadline!.getTime() - b.deadline!.getTime()
  );

  timeline.upcoming.sort(
    (a, b) => a.deadline!.getTime() - b.deadline!.getTime()
  );

  return {
  ...timeline,
  summary: {
    total:
      timeline.overdue.length +
      timeline.upcoming.length +
      timeline.completed.length +
      timeline.undated.length,

    overdue: timeline.overdue.length,
    upcoming: timeline.upcoming.length,
    completed: timeline.completed.length,
    undated: timeline.undated.length,
  },
};
}
