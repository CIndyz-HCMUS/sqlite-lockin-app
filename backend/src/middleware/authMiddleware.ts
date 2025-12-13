// backend/src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import { verifyAccessToken, AccessTokenPayload } from "../utils/jwt";

export interface AuthedRequest extends Request {
  userId?: number;
  user?: AccessTokenPayload;
}

// Middleware yêu cầu login
export function requireAuth(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  // Header dạng: Authorization: Bearer <token>
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Missing Authorization header" });
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Invalid Authorization format" });
  }

  try {
    const decoded = verifyAccessToken(token);

    // Lưu user vào request để routes dùng lại
    req.userId = decoded.userId;
    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
