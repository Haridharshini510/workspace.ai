import { Router } from "express";
import { syncGmailEmails, getGmailSyncStatus } from "../controllers/gmailController.js";
import { requireAuth } from "../middleware/auth.js";
import { requireSyncLock } from "../middleware/syncLock.js";

const router = Router();

// Apply auth middleware to all routes
router.use(requireAuth);

// Sync Gmail emails to workspace items
router.post("/sync", requireSyncLock("gmail"), syncGmailEmails);

// Get Gmail connection status
router.get("/status", getGmailSyncStatus);

export default router;
