import { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error("ERROR:", err);

  return res.status(500).json({
    message: "Internal server error",
    error: err?.message || "Unknown error",
  });
}
