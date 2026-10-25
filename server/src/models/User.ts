import { Schema, Types, model } from "mongoose";

interface IUser {
  googleId: string;
  email: string;
  name: string;
  picture?: string;
  _id: Types.ObjectId;
}

const userSchema = new Schema<IUser>(
  {
    googleId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    picture: { type: String },
  },
  { timestamps: true }
);

export const User = model<IUser>("User", userSchema);
export type { IUser };