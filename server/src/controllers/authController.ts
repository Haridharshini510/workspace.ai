import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

// Generate JWT token for authenticated user
export function generateToken(userId: string): string {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: "7d", // Token valid for 7 days
  });
}

// Handle successful Google OAuth callback
export async function handleGoogleCallback(req: Request, res: Response) {
  try {
    // User is attached to req by Passport after successful OAuth
    const user = req.user as any;

    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
    }

    // Generate JWT token
    const token = generateToken(user._id.toString());

    // Redirect to frontend with token in URL
    // Frontend will extract token and store it
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  } catch (error) {
    console.error("Auth callback error:", error);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`);
  }
}

// Get current authenticated user info
export async function getCurrentUser(req: Request, res: Response) {
  try {
    // req.userId is set by auth middleware
    const userId = (req as any).userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return user info (excluding sensitive data)
    res.status(200).json({
      _id: user._id,
      email: user.email,
      name: user.name,
      picture: user.picture,
    });
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({ error: "Failed to get user info" });
  }
}

// Logout (client-side will remove token)
export function logout(req: Request, res: Response) {
  // With JWT, logout is primarily client-side (remove token from storage)
  // This endpoint can be used for logging/analytics
  res.status(200).json({ message: "Logged out successfully" });
}