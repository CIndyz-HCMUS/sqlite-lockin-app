// backend/src/modules/meal/meal.routes.ts
import { Router } from "express";
import { requireAuth, AuthedRequest } from "../../middleware/authMiddleware";
import { createMealLog, MealType, toMealLogDTO } from "./meal.repo";

export const mealRouter = Router();

// tất cả /meal-logs đều cần login
mealRouter.use(requireAuth);

// POST /meal-logs
mealRouter.post("/", (req: AuthedRequest, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const {
      mealType,
      foodId,
      servings,
      date,
    }: {
      mealType: MealType;
      foodId: number;
      servings: number;
      date?: string;
    } = req.body;

    if (!mealType || !foodId || !servings) {
      return res
        .status(400)
        .json({ message: "mealType, foodId, servings are required" });
    }

    const today =
      date || new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    const row = createMealLog({
      userId,
      mealType,
      foodId,
      servings,
      date: today,
    });

    return res.status(201).json({ mealLog: toMealLogDTO(row) });
  } catch (err: any) {
    console.error(err);
    return res
      .status(500)
      .json({ message: err.message || "Failed to create meal log" });
  }
});
