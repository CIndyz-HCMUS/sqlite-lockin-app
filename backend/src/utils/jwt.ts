// backend/src/utils/jwt.ts
import jwt, { SignOptions } from "jsonwebtoken";
import { ENV } from "../config/env";

// Kiểu payload bên trong access token
export interface AccessTokenPayload {
  userId: number;
  email: string;
}

// SECRET đọc từ ENV (có thể fallback dev-secret)
const JWT_SECRET = ENV.JWT_SECRET || "dev-secret";

// thời gian sống của access token
const ACCESS_TOKEN_EXPIRES_IN: SignOptions["expiresIn"] = "7d";

// Hàm dùng cho auth.service.ts (và các nơi khác)
export function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  } as SignOptions);
}

// Hàm verify dùng cho middleware
export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, JWT_SECRET) as AccessTokenPayload;
}

// Alias nếu chỗ khác dùng signToken / verifyToken
export const signToken = signAccessToken;
export const verifyToken = verifyAccessToken;
