import type { Request, Response } from "express";
import { Commitment } from "../models/Commitment.js";
import { organizeTimeline } from "../services/timelineService.js";

export async function getTimeline(req: Request, res: Response) {
  try {
    const commitments = await Commitment.find();

    
const timeline = organizeTimeline(commitments);

const { category } = req.query;

const validCategories = [
  "overdue",
  "upcoming",
  "completed",
  "undated",
] as const;

if (category !== undefined) {
  if (
    typeof category !== "string" ||
    !validCategories.includes(
      category as (typeof validCategories)[number]
    )
  ) {
    res.status(400).json({
      error: "Invalid category",
      validCategories,
    });
    return;
  }

  res.status(200).json({
    category,
    commitments: timeline[category as (typeof validCategories)[number]],
  });
  return;
}


const summary = {
  total:
    timeline.overdue.length +
    timeline.upcoming.length +
    timeline.completed.length +
    timeline.undated.length,
  overdue: timeline.overdue.length,
  upcoming: timeline.upcoming.length,
  completed: timeline.completed.length,
  undated: timeline.undated.length,
};

res.status(200).json({
  ...timeline,
  summary,
});

  } catch (error) {
    console.error("Failed to fetch timeline:", error);
    res.status(500).json({ error: "Failed to fetch timeline" });
  }
}
