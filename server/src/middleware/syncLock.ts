import { Request, Response, NextFunction } from "express";
import { SyncLock } from "../models/SyncLock.js";

const LOCK_TTL_MS = 5 * 60 * 1000;

export function requireSyncLock(type: "gmail" | "calendar") {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;

    try {
      await SyncLock.create({
        userId,
        type,
        expiresAt: new Date(Date.now() + LOCK_TTL_MS),
      });
    } catch (error: any) {
      if (error.code === 11000) {
        res.status(409).json({
          error: `A ${type} sync is already in progress. Please wait and try again.`,
        });
        return;
      }
      throw error;
    }

    // Release the lock when the response finishes, regardless of success or failure
    res.on("finish", async () => {
      try {
        await SyncLock.deleteOne({ userId, type });
      } catch {
        // Lock will auto-expire via TTL if delete fails
      }
    });

    next();
  };
}
