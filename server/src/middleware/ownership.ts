import { Request, Response, NextFunction } from "express";
import { WorkspaceItem } from "../models/WorkspaceItem.js";
import { Commitment } from "../models/Commitment.js";

/**
 * Extend Express Request type to include verified resources
 * After middleware runs, controllers can access pre-verified resources
 */
declare global {
  namespace Express {
    interface Request {
      workspaceItem?: any; // Will hold verified WorkspaceItem document
      commitment?: any;    // Will hold verified Commitment document
    }
  }
}

/**
 * Middleware: Verify WorkspaceItem Ownership
 *
 * Purpose: Checks if the workspace item exists AND belongs to the authenticated user
 *
 * How it works:
 * 1. Extract item ID from req.params.id
 * 2. Extract user ID from req.userId (set by auth middleware)
 * 3. Query database: WorkspaceItem.findOne({ _id: id, userId: req.userId })
 * 4. If not found: Return 404 (don't reveal if item exists for security)
 * 5. If found: Attach to req.workspaceItem and call next()
 *
 * Usage in routes:
 *   router.get("/:id", requireAuth, verifyWorkspaceItemOwnership, getWorkspaceItemById)
 */
export async function verifyWorkspaceItemOwnership(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Step 1: Get the item ID from URL params
    const itemId = req.params.id;

    // Step 2: Get the user ID from request (set by auth middleware)
    const userId = req.userId;

    // Step 3: Query database with both _id and userId
    // This ensures the item exists AND belongs to the authenticated user
    const item = await WorkspaceItem.findOne({
      _id: itemId,
      userId: userId,
    });

    // Step 4: If not found, return 404
    // Security note: We return 404 whether the item doesn't exist OR belongs to another user
    // This prevents leaking information about other users' data
    if (!item) {
      res.status(404).json({ error: "Workspace item not found" });
      return;
    }

    // Step 5: If found, attach to req.workspaceItem
    // Controller can now use req.workspaceItem without re-querying
    req.workspaceItem = item;

    // Step 6: Call next() to continue to controller
    next();
  } catch (error) {
    // Error handling: Log error for debugging
    console.error("Workspace item ownership verification failed:", error);

    // Return 404 instead of 500 to avoid revealing system details
    // This covers cases like invalid MongoDB ObjectId format
    res.status(404).json({ error: "Workspace item not found" });
  }
}

/**
 * Middleware: Verify Commitment Ownership
 *
 * Purpose: Checks if the commitment exists AND belongs to the authenticated user
 *
 * How it works:
 * 1. Extract commitment ID from req.params.id
 * 2. Extract user ID from req.userId (set by auth middleware)
 * 3. Query database: Commitment.findOne({ _id: id, userId: req.userId })
 * 4. If not found: Return 404 (don't reveal if commitment exists for security)
 * 5. If found: Attach to req.commitment and call next()
 *
 * Usage in routes:
 *   router.patch("/:id", requireAuth, verifyCommitmentOwnership, updateCommitmentById)
 */
export async function verifyCommitmentOwnership(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Step 1: Get the commitment ID from URL params
    const commitmentId = req.params.id;

    // Step 2: Get the user ID from request (set by auth middleware)
    const userId = req.userId;

    // Step 3: Query database with both _id and userId
    // This ensures the commitment exists AND belongs to the authenticated user
    const commitment = await Commitment.findOne({
      _id: commitmentId,
      userId: userId,
    });

    // Step 4: If not found, return 404
    // Security note: We return 404 whether the commitment doesn't exist OR belongs to another user
    // This prevents leaking information about other users' data
    if (!commitment) {
      res.status(404).json({ error: "Commitment not found" });
      return;
    }

    // Step 5: If found, attach to req.commitment
    // Controller can now use req.commitment without re-querying
    req.commitment = commitment;

    // Step 6: Call next() to continue to controller
    next();
  } catch (error) {
    // Error handling: Log error for debugging
    console.error("Commitment ownership verification failed:", error);

    // Return 404 instead of 500 to avoid revealing system details
    // This covers cases like invalid MongoDB ObjectId format
    res.status(404).json({ error: "Commitment not found" });
  }
}
