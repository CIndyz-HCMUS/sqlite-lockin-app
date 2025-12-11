import { Router } from "express";
import { StatsController } from "../controllers/stats.controller";
import { authMiddleware } from "../middleware/auth";

const statsRouter = Router();

statsRouter.get("/today", authMiddleware, StatsController.getTodayStats);

export default statsRouter;
