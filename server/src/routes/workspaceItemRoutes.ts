import { Router } from "express";
import {getWorkspaceItems, createWorkspaceItem, getWorkspaceItemById, updateWorkspaceItemById,deleteWorkspaceItemById,getWorkspaceItemActionability} from "../controllers/workspaceItemController.js";
import { validate } from "../middleware/validate.js";
import {
  createWorkspaceItemSchema,
  updateWorkspaceItemSchema,
  workspaceItemIdSchema,
} from "../schemas/workspaceItem.schema.js";
const router = Router();

router.get("/", getWorkspaceItems);
router.post("/", validate(createWorkspaceItemSchema), createWorkspaceItem);
router.get("/:id",validate(workspaceItemIdSchema, "params"), getWorkspaceItemById);
router.patch("/:id",validate(workspaceItemIdSchema, "params"), validate(updateWorkspaceItemSchema), updateWorkspaceItemById);
router.delete("/:id",validate(workspaceItemIdSchema, "params"), deleteWorkspaceItemById);
router.get("/:id/actionability",validate(workspaceItemIdSchema, "params"), getWorkspaceItemActionability);


export default router;