import { Router } from "express";
import { AuthedRequest, requireAuth } from "../../middleware/authMiddleware";
import {
  createWorkoutLog,
  deleteWorkoutLog,
  listWorkoutLogsForUser,
  toWorkoutLogDTO,
  updateWorkoutLog,
} from "./workoutLog.repo";
import { findWorkoutLogById } from "./workoutLog.repo";

export const workoutLogRouter = Router();

// GET /logs/workouts?date=YYYY-MM-DD
workoutLogRouter.get("/", requireAuth, (req: AuthedRequest, res) => {
  const userId = req.userId!;
  const { date } = req.query;

  const rows = listWorkoutLogsForUser(userId, {
    date: date as string | undefined,
  });

  const items = rows.map(toWorkoutLogDTO);
  return res.json({ items });
});

// POST /logs/workouts
workoutLogRouter.post("/", requireAuth, (req: AuthedRequest, res, next) => {
  try {
    const userId = req.userId!;
    const { exerciseId, durationMin, intensity, loggedAt, notes } = req.body;

    if (!exerciseId || durationMin == null) {
      return res
        .status(400)
        .json({ message: "Missing exerciseId or durationMin" });
    }

    const row = createWorkoutLog({
      userId,
      exerciseId,
      durationMin,
      intensity,
      loggedAt,
      notes,
    });

    return res.status(201).json({ workoutLog: toWorkoutLogDTO(row as any) });
  } catch (err: any) {
    if (err.message === "EXERCISE_NOT_FOUND") {
      return res.status(404).json({ message: "Exercise not found" });
    }
    next(err);
  }
});

// PUT /logs/workouts/:id
workoutLogRouter.put("/:id", requireAuth, (req: AuthedRequest, res, next) => {
  try {
    const id = Number(req.params.id);
    const userId = req.userId!;

    const row = updateWorkoutLog(id, userId, req.body);
    if (!row) {
      return res.status(404).json({ message: "Workout log not found" });
    }

    return res.json({ workoutLog: toWorkoutLogDTO(row as any) });
  } catch (err: any) {
    if (err.message === "EXERCISE_NOT_FOUND") {
      return res.status(404).json({ message: "Exercise not found" });
    }
    next(err);
  }
});

// DELETE /logs/workouts/:id
workoutLogRouter.delete("/:id", requireAuth, (req: AuthedRequest, res) => {
  const id = Number(req.params.id);
  const userId = req.userId!;

  const ok = deleteWorkoutLog(id, userId);
  if (!ok) {
    return res.status(404).json({ message: "Workout log not found" });
  }

  return res.status(204).send();
});
