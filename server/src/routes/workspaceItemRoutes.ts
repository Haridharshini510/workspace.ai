import { Router } from "express";
import {getWorkspaceItems, createWorkspaceItem, getWorkspaceItemById, updateWorkspaceItemById,deleteWorkspaceItemById,getWorkspaceItemActionability} from "../controllers/workspaceItemController.js";
import { validate } from "../middleware/validate.js";
import { requireAuth } from "../middleware/auth.js";
import { verifyWorkspaceItemOwnership } from "../middleware/ownership.js";
import {
  createWorkspaceItemSchema,
  updateWorkspaceItemSchema,
  workspaceItemIdSchema,
  workspaceItemQuerySchema,
} from "../schemas/workspaceItem.schema.js";
import { generateCommitmentForWorkspaceItem, getCommitmentsByWorkspaceItem } from "../controllers/commitmentController.js";
const router = Router();

// Apply auth middleware to all routes
router.use(requireAuth);

router.get("/", validate(workspaceItemQuerySchema, "query"), getWorkspaceItems);
router.post("/", validate(createWorkspaceItemSchema), createWorkspaceItem);
router.get("/:id",validate(workspaceItemIdSchema, "params"), verifyWorkspaceItemOwnership, getWorkspaceItemById);
router.patch("/:id",validate(workspaceItemIdSchema, "params"), verifyWorkspaceItemOwnership, validate(updateWorkspaceItemSchema), updateWorkspaceItemById);
router.delete("/:id",validate(workspaceItemIdSchema, "params"), verifyWorkspaceItemOwnership, deleteWorkspaceItemById);
router.get("/:id/actionability",validate(workspaceItemIdSchema, "params"), verifyWorkspaceItemOwnership, getWorkspaceItemActionability);
router.get("/:id/commitments",validate(workspaceItemIdSchema, "params"), verifyWorkspaceItemOwnership, getCommitmentsByWorkspaceItem);
router.post("/:id/generate-commitment",validate(workspaceItemIdSchema, "params"), verifyWorkspaceItemOwnership, generateCommitmentForWorkspaceItem);

export default router;