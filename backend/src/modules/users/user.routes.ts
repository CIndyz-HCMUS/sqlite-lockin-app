import { Router } from "express";
import { AuthedRequest, requireAuth } from "../../middleware/authMiddleware";
import { findUserById } from "./user.repo";
import { sanitizeUser } from "./user.service";
import { updateUser } from "./user.repo";
import { sanitizeUser } from "./user.service";

export const userRouter = Router();

userRouter.get("/me", requireAuth, (req: AuthedRequest, res) => {
  const userId = req.userId!;
  const user = findUserById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });
  return res.json({ user: sanitizeUser(user) });
});
userRouter.put("/me/profile", requireAuth, (req: AuthedRequest, res) => {
  const userId = req.userId!;
  const { firstName, lastName, age, gender } = req.body;

  const updated = updateUser(userId, {
    first_name: firstName,
    last_name: lastName,
    age,
    gender
  });

  return res.json({ user: sanitizeUser(updated!) });
});


// PUT /me/body
userRouter.put("/me/body", requireAuth, (req: AuthedRequest, res) => {
  const userId = req.userId!;
  const { heightCm, weightKg, activityLevel } = req.body;

  const updated = updateUser(userId, {
    height_cm: heightCm,
    weight_kg: weightKg,
    activity_level: activityLevel
  });

  return res.json({ user: sanitizeUser(updated!) });
});


// PUT /me/goal
userRouter.put("/me/goal", requireAuth, (req: AuthedRequest, res) => {
  const userId = req.userId!;
  const { goalType, targetWeightKg, dailyCalorieAdjustment } = req.body;

  const updated = updateUser(userId, {
    goal_type: goalType,
    target_weight_kg: targetWeightKg,
    daily_calorie_adjustment: dailyCalorieAdjustment
  });

  return res.json({ user: sanitizeUser(updated!) });
});