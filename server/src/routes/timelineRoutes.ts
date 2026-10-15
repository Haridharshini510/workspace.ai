import { Router } from "express";
import { getTimeline } from "../controllers/timelineController.js";

const router = Router();

router.get("/", getTimeline);

export default router;
