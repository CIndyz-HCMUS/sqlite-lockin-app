import { Router } from "express";
import { AuthedRequest, requireAuth } from "../../middleware/authMiddleware";
import {
  createSleepLog,
  deleteSleepLog,
  listSleepLogsForUser,
  toSleepLogDTO,
  updateSleepLog,
} from "./sleepLog.repo";
import { findSleepLogById } from "./sleepLog.repo";

export const sleepLogRouter = Router();

// GET /logs/sleep?date=YYYY-MM-DD
sleepLogRouter.get("/", requireAuth, (req: AuthedRequest, res) => {
  const userId = req.userId!;
  const { date } = req.query;

  const rows = listSleepLogsForUser(userId, {
    date: date as string | undefined,
  });

  const items = rows.map(toSleepLogDTO);
  return res.json({ items });
});

// POST /logs/sleep
sleepLogRouter.post("/", requireAuth, (req: AuthedRequest, res) => {
  const userId = req.userId!;
  const { startTime, endTime, sleepDate, quality, notes } = req.body;

  if (!startTime || !endTime) {
    return res
      .status(400)
      .json({ message: "Missing startTime or endTime" });
  }

  const row = createSleepLog({
    userId,
    startTime,
    endTime,
    sleepDate,
    quality,
    notes,
  });

  return res.status(201).json({ sleepLog: toSleepLogDTO(row) });
});

// PUT /logs/sleep/:id
sleepLogRouter.put("/:id", requireAuth, (req: AuthedRequest, res) => {
  const userId = req.userId!;
  const id = Number(req.params.id);

  const row = updateSleepLog(id, userId, req.body);
  if (!row) {
    return res.status(404).json({ message: "Sleep log not found" });
  }

  return res.json({ sleepLog: toSleepLogDTO(row) });
});

// DELETE /logs/sleep/:id
sleepLogRouter.delete("/:id", requireAuth, (req: AuthedRequest, res) => {
  const userId = req.userId!;
  const id = Number(req.params.id);

  const ok = deleteSleepLog(id, userId);
  if (!ok) {
    return res.status(404).json({ message: "Sleep log not found" });
  }

  return res.status(204).send();
});
