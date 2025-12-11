import { Router } from "express";
import { requireAuth, AuthedRequest } from "../../middleware/authMiddleware";
import { createWorkoutLog, toWorkoutLogDTO } from "./workout.repo";

export const workoutRouter = Router();

workoutRouter.use(requireAuth);

// POST /workout-logs
workoutRouter.post("/", (req: AuthedRequest, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const {
      exerciseId,
      minutes,
      loggedAt,
    }: { exerciseId: number; minutes: number; loggedAt?: string } = req.body;

    if (!exerciseId || minutes == null) {
      return res
        .status(400)
        .json({ message: "exerciseId and minutes are required" });
    }

    const row = createWorkoutLog({
      userId,
      exerciseId,
      minutes,
      loggedAt,
    });

    return res.status(201).json({ workoutLog: toWorkoutLogDTO(row) });
  } catch (err: any) {
    console.error(err);
    return res
      .status(500)
      .json({ message: err.message || "Failed to create workout log" });
  }
});
