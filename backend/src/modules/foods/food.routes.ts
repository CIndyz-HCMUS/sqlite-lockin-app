import { Router } from "express";
import { requireAuth, AuthedRequest } from "../../middleware/authMiddleware";
import {
  createFood,
  deleteFood,
  findFoodById,
  listFoods,
  toFoodDTO,
  updateFood,
} from "./food.repo";

export const foodRouter = Router();

// GET /foods?search=&tag=&limit=&offset=
foodRouter.get("/", (req, res) => {
  const { search, tag, limit, offset } = req.query;

  const rows = listFoods({
    search: search as string | undefined,
    tag: tag as string | undefined,
    limit: limit ? Number(limit) : undefined,
    offset: offset ? Number(offset) : undefined,
  });

  const foods = rows.map(toFoodDTO);
  return res.json({ items: foods });
});

// GET /foods/:id
foodRouter.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const row = findFoodById(id);
  if (!row) return res.status(404).json({ message: "Food not found" });
  return res.json({ food: toFoodDTO(row) });
});

// POST /foods  (tạm requireAuth, sau này check role admin)
foodRouter.post("/", requireAuth, (req: AuthedRequest, res) => {
  const {
    name,
    brand,
    category,
    servingSize,
    servingUnit,
    calories,
    protein,
    carb,
    fat,
    fiber,
    sugar,
    sodium,
    imageUrl,
    tags,
  } = req.body;

  if (
    !name ||
    servingSize == null ||
    !servingUnit ||
    calories == null ||
    protein == null ||
    carb == null ||
    fat == null
  ) {
    return res
      .status(400)
      .json({ message: "Missing required fields for food" });
  }

  const row = createFood({
    name,
    brand,
    category,
    servingSize,
    servingUnit,
    calories,
    protein,
    carb,
    fat,
    fiber,
    sugar,
    sodium,
    imageUrl,
    tags,
    createdByUser: req.userId,
  });

  return res.status(201).json({ food: toFoodDTO(row) });
});

// PUT /foods/:id
foodRouter.put("/:id", requireAuth, (req: AuthedRequest, res) => {
  const id = Number(req.params.id);

  const row = updateFood(id, req.body);
  if (!row) return res.status(404).json({ message: "Food not found" });

  return res.json({ food: toFoodDTO(row) });
});

// DELETE /foods/:id
foodRouter.delete("/:id", requireAuth, (req: AuthedRequest, res) => {
  const id = Number(req.params.id);

  const existing = findFoodById(id);
  if (!existing) return res.status(404).json({ message: "Food not found" });

  deleteFood(id);
  return res.status(204).send();
});
