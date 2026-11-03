import { Router } from "express";
import {getCommitments, createCommitment, getCommitmentById, updateCommitmentById,deleteCommitmentById} from "../controllers/commitmentController.js";
import { validate } from "../middleware/validate.js";
import { requireAuth } from "../middleware/auth.js";
import { verifyCommitmentOwnership } from "../middleware/ownership.js";
import {
  createCommitmentSchema,
  updateCommitmentSchema,
  commitmentIdSchema,
  commitmentQuerySchema,
} from "../schemas/commitment.schema.js";
const router = Router();

// Apply auth middleware to all routes
router.use(requireAuth);

router.get("/", validate(commitmentQuerySchema, "query"), getCommitments);
router.post("/", validate(createCommitmentSchema), createCommitment);
router.get("/:id",validate(commitmentIdSchema, "params"), verifyCommitmentOwnership, getCommitmentById);
router.patch("/:id",validate(commitmentIdSchema, "params"), verifyCommitmentOwnership, validate(updateCommitmentSchema), updateCommitmentById);
router.delete("/:id",validate(commitmentIdSchema, "params"), verifyCommitmentOwnership, deleteCommitmentById);

export default router;