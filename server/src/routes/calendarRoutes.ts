import { Router } from "express";
import { syncCalendarEvents } from "../controllers/calendarController.js";
import { requireAuth } from "../middleware/auth.js";
import { requireSyncLock } from "../middleware/syncLock.js";

const router = Router();

// Apply auth middleware to all routes
router.use(requireAuth);

// Sync Google Calendar events to workspace items
// Query params: ?daysAhead=30 (optional, default 30)
router.post("/sync", requireSyncLock("calendar"), syncCalendarEvents);

export default router;
