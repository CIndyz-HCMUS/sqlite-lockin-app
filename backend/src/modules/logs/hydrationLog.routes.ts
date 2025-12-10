// src/modules/logs/hydrationLog.routes.ts
import { Router } from "express";
import { AuthedRequest, requireAuth } from "../../middleware/authMiddleware";
import {
  createHydrationLog,
  deleteHydrationLog,
  listHydrationLogsForUser,
  toHydrationLogDTO,
  updateHydrationLog,
} from "./hydrationLog.repo";

export const hydrationLogRouter = Router();

// GET /logs/water?date=YYYY-MM-DD
hydrationLogRouter.get("/", requireAuth, (req: AuthedRequest, res) => {
  const userId = req.userId!;
  const { date } = req.query;

  const rows = listHydrationLogsForUser(userId, {
    date: date as string | undefined,
  });

  const items = rows.map(toHydrationLogDTO);
  return res.json({ items });
});

// POST /logs/water
hydrationLogRouter.post("/", requireAuth, (req: AuthedRequest, res) => {
  const userId = req.userId!;
  const { amountMl, loggedAt, drinkDate, source, notes } = req.body;

  if (amountMl == null) {
    return res.status(400).json({ message: "Missing amountMl" });
  }

  const row = createHydrationLog({
    userId,
    amountMl,
    loggedAt,
    drinkDate,
    source,
    notes,
  });

  return res.status(201).json({ hydrationLog: toHydrationLogDTO(row) });
});

// PUT /logs/water/:id
hydrationLogRouter.put("/:id", requireAuth, (req: AuthedRequest, res) => {
  const userId = req.userId!;
  const id = Number(req.params.id);

  const row = updateHydrationLog(id, userId, req.body);
  if (!row) {
    return res.status(404).json({ message: "Hydration log not found" });
  }

  return res.json({ hydrationLog: toHydrationLogDTO(row) });
});

// DELETE /logs/water/:id
hydrationLogRouter.delete("/:id", requireAuth, (req: AuthedRequest, res) => {
  const userId = req.userId!;
  const id = Number(req.params.id);

  const ok = deleteHydrationLog(id, userId);
  if (!ok) {
    return res.status(404).json({ message: "Hydration log not found" });
  }

  return res.status(204).send();
});
