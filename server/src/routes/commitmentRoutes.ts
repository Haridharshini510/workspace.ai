import { Router } from "express";
import {getCommitments, createCommitment, getCommitmentById, updateCommitmentById,deleteCommitmentById} from "../controllers/commitmentController.js";
import { validate } from "../middleware/validate.js";
import {
  createCommitmentSchema,
  updateCommitmentSchema,
  commitmentIdSchema,
} from "../schemas/commitment.schema.js";
const router = Router();

router.get("/", getCommitments);
router.post("/", validate(createCommitmentSchema), createCommitment);
router.get("/:id",validate(commitmentIdSchema, "params"), getCommitmentById);
router.patch("/:id",validate(commitmentIdSchema, "params"), validate(updateCommitmentSchema), updateCommitmentById);
router.delete("/:id",validate(commitmentIdSchema, "params"), deleteCommitmentById);


export default router;