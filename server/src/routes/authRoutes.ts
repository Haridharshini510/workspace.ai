import { Router } from "express";
import passport from "../config/passport.js";
import { handleGoogleCallback, getCurrentUser, logout } from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Start Google OAuth flow
// When user visits this endpoint, they're redirected to Google login
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email", "https://www.googleapis.com/auth/gmail.readonly"],
    accessType: "offline", // Get refresh token for Gmail API later
    prompt: "consent", // Force consent screen to get refresh token
  })
);

// Google OAuth callback
// Google redirects here after user approves permissions
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false, // We're using JWT, not sessions
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=auth_failed`,
  }),
  handleGoogleCallback
);

// Get current authenticated user
// Protected route - requires valid JWT token
router.get("/me", requireAuth, getCurrentUser);

// Logout endpoint
router.post("/logout", logout);

export default router;
