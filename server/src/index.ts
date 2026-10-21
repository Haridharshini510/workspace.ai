import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import { connectDatabase } from "./config/database.js";
import workspaceItemRoutes from "./routes/workspaceItemRoutes.js";
import commitmentRoutes from "./routes/commitmentRoutes.js";
import timelineRoutes from "./routes/timelineRoutes.js";
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/workspace-items", workspaceItemRoutes);
app.use("/api/commitments", commitmentRoutes);
app.use("/api/timeline", timelineRoutes);

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
