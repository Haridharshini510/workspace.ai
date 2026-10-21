import { Router } from "express";
import { getTimeline } from "../controllers/timelineController.js";

const router = Router();

router.get("/", getTimeline);
router.post("/", getTimeline);


export default router;
