import "dotenv/config";
import express from "express";
import { connectDatabase } from "./config/database.js";
import workspaceItemRoutes from "./routes/workspaceItemRoutes.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/workspace-items", workspaceItemRoutes);


async function start() {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start();
