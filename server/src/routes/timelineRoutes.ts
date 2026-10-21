import { Router } from "express";
import { getTimeline } from "../controllers/timelineController.js";
import { validate } from "../middleware/validate.js";
import { timelineQuerySchema } from "../schemas/timeline.schema.js";

const router = Router();

router.get("/", validate(timelineQuerySchema, "query"), getTimeline);

export default router;
