import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";

export function validate(schema: ZodType,location: "body" | "query" | "params" = "body") {
  return (req: Request, res: Response, next: NextFunction) => {
    const data = req[location];
    const result = schema.safeParse(data);

    if (!result.success) {
      res.status(400).json({
        error: "Invalid request data",
        details: result.error.issues,
      });
      return;
    }

    req[location] = result.data;
    next();
  };
}