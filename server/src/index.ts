import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import session from "express-session";
import passport from "./config/passport.js";
import { connectDatabase } from "./config/database.js";
import workspaceItemRoutes from "./routes/workspaceItemRoutes.js";
import commitmentRoutes from "./routes/commitmentRoutes.js";
import timelineRoutes from "./routes/timelineRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import gmailRoutes from "./routes/gmailRoutes.js";
import calendarRoutes from "./routes/calendarRoutes.js";
import { generalLimiter, authLimiter, syncLimiter, writeLimiter } from "./middleware/rateLimiter.js";
import { requestTimeout } from "./middleware/requestTimeout.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());

// CORS configuration - allow requests from frontend
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());
app.use(requestTimeout());

// Session middleware (used temporarily during OAuth flow)
app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      maxAge: 10 * 60 * 1000, // 10 minutes (only for OAuth flow)
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

app.use(generalLimiter);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Auth routes (public - tighter rate limit on login attempts)
app.use("/api/auth", authLimiter, authRoutes);

// Protected routes
app.use("/api/workspace-items", writeLimiter, workspaceItemRoutes);
app.use("/api/commitments", writeLimiter, commitmentRoutes);
app.use("/api/timeline", timelineRoutes);
app.use("/api/gmail", syncLimiter, gmailRoutes);
app.use("/api/calendar", syncLimiter, calendarRoutes);

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Not found" });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

async function start() {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start();
