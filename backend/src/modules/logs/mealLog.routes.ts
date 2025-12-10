import { Router } from "express";
import { AuthedRequest, requireAuth } from "../../middleware/authMiddleware";
import {
  createMealLog,
  deleteMealLog,
  findMealLogById,
  listMealLogsForUser,
  toMealLogDTO,
  updateMealLog,
} from "./mealLog.repo";

export const mealLogRouter = Router();

// GET /logs/meals?date=YYYY-MM-DD
mealLogRouter.get("/", requireAuth, (req: AuthedRequest, res) => {
  const userId = req.userId!;
  const { date } = req.query;

  const rows = listMealLogsForUser(userId, {
    date: date as string | undefined,
  });

  const items = rows.map(toMealLogDTO);
  return res.json({ items });
});

// POST /logs/meals
mealLogRouter.post("/", requireAuth, (req: AuthedRequest, res, next) => {
  try {
    const userId = req.userId!;
    const { foodId, servings, mealType, loggedAt, notes } = req.body;

    if (!foodId || servings == null) {
      return res
        .status(400)
        .json({ message: "Missing foodId or servings" });
    }

    const row = createMealLog({
      userId,
      foodId,
      servings,
      mealType,
      loggedAt,
      notes,
    });

    return res.status(201).json({ mealLog: toMealLogDTO(row) });
  } catch (err: any) {
    if (err.message === "FOOD_NOT_FOUND") {
      return res.status(404).json({ message: "Food not found" });
    }
    next(err);
  }
});

// PUT /logs/meals/:id
mealLogRouter.put("/:id", requireAuth, (req: AuthedRequest, res, next) => {
  try {
    const id = Number(req.params.id);
    const userId = req.userId!;

    const row = updateMealLog(id, userId, req.body);
    if (!row) {
      return res.status(404).json({ message: "Meal log not found" });
    }

    return res.json({ mealLog: toMealLogDTO(row as any) });
  } catch (err: any) {
    if (err.message === "FOOD_NOT_FOUND") {
      return res.status(404).json({ message: "Food not found" });
    }
    next(err);
  }
});

// DELETE /logs/meals/:id
mealLogRouter.delete("/:id", requireAuth, (req: AuthedRequest, res) => {
  const id = Number(req.params.id);
  const userId = req.userId!;
  const ok = deleteMealLog(id, userId);

  if (!ok) {
    return res.status(404).json({ message: "Meal log not found" });
  }
  return res.status(204).send();
});
