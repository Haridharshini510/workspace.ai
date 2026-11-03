import { Schema, model, Types } from "mongoose";

interface ISyncLock {
  userId: Types.ObjectId;
  type: string;
  expiresAt: Date;
}

const syncLockSchema = new Schema<ISyncLock>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, required: true, enum: ["gmail", "calendar"] },
  expiresAt: { type: Date, required: true },
});

// Only one lock per user per sync type
syncLockSchema.index({ userId: 1, type: 1 }, { unique: true });

// Auto-delete expired locks
syncLockSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const SyncLock = model<ISyncLock>("SyncLock", syncLockSchema);
