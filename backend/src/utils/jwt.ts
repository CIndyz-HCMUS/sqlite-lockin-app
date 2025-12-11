// backend/src/utils/jwt.ts
import jwt, { SignOptions } from "jsonwebtoken";
import { ENV } from "../config/env";

const JWT_SECRET = ENV.JWT_SECRET || "dev-secret";

// Kiểu payload bên trong access token
export interface AccessTokenPayload {
  userId: number;
  email: string;
}

// kiểu của expiresIn trong SignOptions
const ACCESS_TOKEN_EXPIRES_IN: SignOptions["expiresIn"] = "7d";

// Hàm dùng cho auth.service.ts
export function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  } as SignOptions);
}

// Hàm verify dùng cho middleware
export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, JWT_SECRET) as AccessTokenPayload;
}

// Nếu chỗ khác trong code có dùng signToken / verifyToken thì alias luôn
export const signToken = signAccessToken;
export const verifyToken = verifyAccessToken;
