import { Router } from "express";
import { AuthedRequest, requireAuth } from "../../middleware/authMiddleware";
import {
  createExercise,
  deleteExercise,
  findExerciseById,
  listExercises,
  toExerciseDTO,
  updateExercise,
} from "./exercise.repo";

export const exerciseRouter = Router();

// GET /exercises
exerciseRouter.get("/", (req, res) => {
  const { search, tag, category, limit, offset } = req.query;

  const rows = listExercises({
    search: search as string | undefined,
    tag: tag as string | undefined,
    category: category as string | undefined,
    limit: limit ? Number(limit) : undefined,
    offset: offset ? Number(offset) : undefined,
  });

  const items = rows.map(toExerciseDTO);
  return res.json({ items });
});

// GET /exercises/:id
exerciseRouter.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const row = findExerciseById(id);
  if (!row) return res.status(404).json({ message: "Exercise not found" });
  return res.json({ exercise: toExerciseDTO(row) });
});

// POST /exercises
exerciseRouter.post("/", requireAuth, (req: AuthedRequest, res) => {
  const { name, category, intensity, caloriesPerMin, imageUrl, tags } =
    req.body;

  if (!name || caloriesPerMin == null) {
    return res
      .status(400)
      .json({ message: "Missing required fields for exercise" });
  }

  const row = createExercise({
    name,
    category,
    intensity,
    caloriesPerMin,
    imageUrl,
    tags,
    createdByUser: req.userId,
  });

  return res.status(201).json({ exercise: toExerciseDTO(row) });
});

// PUT /exercises/:id
exerciseRouter.put("/:id", requireAuth, (req: AuthedRequest, res) => {
  const id = Number(req.params.id);
  const row = updateExercise(id, req.body);
  if (!row) return res.status(404).json({ message: "Exercise not found" });
  return res.json({ exercise: toExerciseDTO(row) });
});

// DELETE /exercises/:id
exerciseRouter.delete("/:id", requireAuth, (req: AuthedRequest, res) => {
  const id = Number(req.params.id);
  const existing = findExerciseById(id);
  if (!existing)
    return res.status(404).json({ message: "Exercise not found" });
  deleteExercise(id);
  return res.status(204).send();
});
