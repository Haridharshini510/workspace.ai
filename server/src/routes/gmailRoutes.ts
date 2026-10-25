import { Router } from "express";
import { syncGmailEmails, getGmailSyncStatus } from "../controllers/gmailController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Apply auth middleware to all routes
router.use(requireAuth);

// Sync Gmail emails to workspace items
router.post("/sync", syncGmailEmails);

// Get Gmail connection status
router.get("/status", getGmailSyncStatus);

export default router;
