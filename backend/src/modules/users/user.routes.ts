import { Router } from "express";
import { AuthedRequest, requireAuth } from "../../middleware/authMiddleware";
import { findUserById } from "./user.repo";
import { sanitizeUser } from "./user.service";

export const userRouter = Router();

userRouter.get("/me", requireAuth, (req: AuthedRequest, res) => {
  const userId = req.userId!;
  const user = findUserById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });
  return res.json({ user: sanitizeUser(user) });
});
