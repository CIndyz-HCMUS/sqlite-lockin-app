import { Router } from "express";
import { AuthedRequest, requireAuth } from "../../middleware/authMiddleware";
import { createFavorite, deleteFavorite, listFavoritesWithItems } from "./favorite.repo";
import { FavoriteItemType } from "./favorite.types";

export const favoriteRouter = Router();

// GET /me/favorites?itemType=food|exercise
favoriteRouter.get("/", requireAuth, (req: AuthedRequest, res) => {
  const userId = req.userId!;
  const { itemType } = req.query;

  let type: FavoriteItemType | undefined;
  if (itemType === "food" || itemType === "exercise") {
    type = itemType;
  }

  const items = listFavoritesWithItems(userId, type);
  return res.json({ items });
});

// POST /me/favorites
favoriteRouter.post("/", requireAuth, (req: AuthedRequest, res) => {
  const userId = req.userId!;
  const { itemType, itemId } = req.body;

  if (!itemType || !itemId) {
    return res.status(400).json({ message: "Missing itemType or itemId" });
  }

  if (itemType !== "food" && itemType !== "exercise") {
    return res.status(400).json({ message: "Invalid itemType" });
  }

  try {
    const row = createFavorite({
      userId,
      itemType,
      itemId: Number(itemId),
    });

    const items = listFavoritesWithItems(userId, itemType);
    const favorite = items.find((f) => f.id === row.id);

    return res.status(201).json({ favorite });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to create favorite" });
  }
});

// DELETE /me/favorites/:id
favoriteRouter.delete("/:id", requireAuth, (req: AuthedRequest, res) => {
  const userId = req.userId!;
  const id = Number(req.params.id);

  const ok = deleteFavorite(id, userId);
  if (!ok) {
    return res.status(404).json({ message: "Favorite not found" });
  }
  return res.status(204).send();
});
