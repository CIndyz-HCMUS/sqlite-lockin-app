import { Router } from "express";
import { AuthedRequest, requireAuth } from "../../middleware/authMiddleware";
import { getDailySummary } from "./dailySummary.service";

export const dailySummaryRouter = Router();  // 👈 export const

// GET /me/daily-summary?date=YYYY-MM-DD
dailySummaryRouter.get("/", requireAuth, (req: AuthedRequest, res) => {
  const userId = req.userId!;
  let date = req.query.date as string | undefined;

  if (!date) {
    date = new Date().toISOString().slice(0, 10);
  }

  const summary = getDailySummary(userId, date);
  return res.json({ summary });
});
