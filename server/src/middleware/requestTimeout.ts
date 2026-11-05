import type { Request, Response, NextFunction } from "express";

const DEFAULT_TIMEOUT = 5 * 60 * 1000; // 5 minutes

export function requestTimeout(ms: number = DEFAULT_TIMEOUT) {
  return (req: Request, res: Response, next: NextFunction) => {
    const timer = setTimeout(() => {
      if (!res.headersSent) {
        res.status(503).json({
          error: "Service Unavailable",
          message: "Request timed out",
        });
      }
    }, ms);

    res.on("finish", () => clearTimeout(timer));
    res.on("close", () => clearTimeout(timer));

    next();
  };
}
