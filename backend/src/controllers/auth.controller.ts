import { Request, Response } from "express";
import { query, run } from "../db";
import { hashPassword, comparePassword } from "../utils/password";
import { signToken } from "../utils/jwt";
import { PublicUser } from "../types/user";
import { AuthRequest } from "../middleware/auth";

function toPublicUser(row: any): PublicUser {
  return {
    id: row.id,
    email: row.email,
    full_name: row.full_name,
    role: row.role,
  };
}

export const AuthController = {
  // POST /auth/register (nếu sau này bạn muốn dùng controller thay vì auth.service)
  register: async (req: Request, res: Response) => {
    try {
      const { email, password, full_name } = req.body;

      if (!email || !password || !full_name) {
        return res
          .status(400)
          .json({ message: "email, password, full_name are required" });
      }

      if (password.length < 6) {
        return res
          .status(400)
          .json({ message: "Password must be at least 6 characters" });
      }

      const existing = await query("SELECT id FROM users WHERE email = ?", [
        email,
      ]);
      if (existing.rows.length > 0) {
        return res.status(409).json({ message: "Email already in use" });
      }

      const passwordHash = await hashPassword(password);

      await run(
        "INSERT INTO users (email, password_hash, full_name, role) VALUES (?, ?, ?, ?)",
        [email, passwordHash, full_name, "user"]
      );

      const inserted = await query(
        "SELECT id, email, full_name, role FROM users WHERE email = ?",
        [email]
      );

      const user = toPublicUser(inserted.rows[0]);
      const token = signToken({ userId: user.id, role: user.role });

      return res.status(201).json({ user, token });
    } catch (error) {
      console.error("Error in register:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  // POST /auth/login (phiên bản dùng DB, không đụng auth.service)
  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "email and password are required" });
      }

      const result = await query(
        "SELECT id, email, password_hash, full_name, role FROM users WHERE email = ?",
        [email]
      );

      if (result.rows.length === 0) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const userRow = result.rows[0];

      const isMatch = await comparePassword(password, userRow.password_hash);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const user = toPublicUser(userRow);
      const token = signToken({ userId: user.id, role: user.role });

      return res.json({ user, token });
    } catch (error) {
      console.error("Error in login:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  // GET /auth/me
  me: async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { userId } = req.user;

      const result = await query(
        "SELECT id, email, full_name, role FROM users WHERE id = ?",
        [userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const user = toPublicUser(result.rows[0]);

      return res.json({ user });
    } catch (error) {
      console.error("Error in me:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
};
