import { Router } from "express";
import { listExercises, toExerciseDTO, findExerciseById } from "./exercise.repo";
import { requireAuth } from "../../middleware/authMiddleware";

export const exerciseRouter = Router();

// nếu muốn chỉ user đã login mới xem được exercises:
exerciseRouter.use(requireAuth);

// GET /exercises?search=&tag=&limit=&offset=
exerciseRouter.get("/", (req, res) => {
  const { search, tag, limit, offset } = req.query;

  const rows = listExercises({
    search: search as string | undefined,
    tag: tag as string | undefined,
    limit: limit ? Number(limit) : undefined,
    offset: offset ? Number(offset) : undefined,
  });

  const exercises = rows.map(toExerciseDTO);
  return res.json({ items: exercises });
});

// GET /exercises/:id (nếu cần)
exerciseRouter.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const row = findExerciseById(id);
  if (!row) return res.status(404).json({ message: "Exercise not found" });
  return res.json({ exercise: toExerciseDTO(row) });
});
