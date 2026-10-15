import type { Request, Response } from "express";
import { Commitment } from "../models/Commitment.js";
import { organizeTimeline } from "../services/timelineService.js";

export async function getTimeline(req: Request, res: Response) {
  try {
    const commitments = await Commitment.find();

    const timeline = organizeTimeline(commitments);

    res.status(200).json(timeline);
  } catch (error) {
    console.error("Failed to fetch timeline:", error);
    res.status(500).json({ error: "Failed to fetch timeline" });
  }
}