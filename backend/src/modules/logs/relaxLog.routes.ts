import { Router } from "express";
import { AuthedRequest, requireAuth } from "../../middleware/authMiddleware";
import {
  createRelaxLog,
  deleteRelaxLog,
  listRelaxLogsForUser,
  toRelaxLogDTO,
  updateRelaxLog,
} from "./relaxLog.repo";
import { findRelaxLogById } from "./relaxLog.repo";

export const relaxLogRouter = Router();

// GET /logs/relax?date=YYYY-MM-DD
relaxLogRouter.get("/", requireAuth, (req: AuthedRequest, res) => {
  const userId = req.userId!;
  const { date } = req.query;

  const rows = listRelaxLogsForUser(userId, {
    date: date as string | undefined,
  });

  const items = rows.map(toRelaxLogDTO);
  return res.json({ items });
});

// POST /logs/relax
relaxLogRouter.post("/", requireAuth, (req: AuthedRequest, res) => {
  const userId = req.userId!;
  const {
    methodName,
    durationMin,
    loggedAt,
    moodBefore,
    moodAfter,
    notes,
    relaxId,
  } = req.body;

  if (!methodName || durationMin == null) {
    return res
      .status(400)
      .json({ message: "Missing methodName or durationMin" });
  }

  const row = createRelaxLog({
    userId,
    methodName,
    durationMin,
    loggedAt,
    moodBefore,
    moodAfter,
    notes,
    relaxId,
  });

  return res.status(201).json({ relaxLog: toRelaxLogDTO(row) });
});

// PUT /logs/relax/:id
relaxLogRouter.put("/:id", requireAuth, (req: AuthedRequest, res) => {
  const userId = req.userId!;
  const id = Number(req.params.id);

  const row = updateRelaxLog(id, userId, req.body);
  if (!row) {
    return res.status(404).json({ message: "Relax log not found" });
  }

  return res.json({ relaxLog: toRelaxLogDTO(row) });
});

// DELETE /logs/relax/:id
relaxLogRouter.delete("/:id", requireAuth, (req: AuthedRequest, res) => {
  const userId = req.userId!;
  const id = Number(req.params.id);

  const ok = deleteRelaxLog(id, userId);
  if (!ok) {
    return res.status(404).json({ message: "Relax log not found" });
  }

  return res.status(204).send();
});
