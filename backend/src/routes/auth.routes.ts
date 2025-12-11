import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth";

export const authRouter = Router();

// /auth/register
authRouter.post("/register", AuthController.register);

// /auth/login
authRouter.post("/login", AuthController.login);

// /auth/me
authRouter.get("/me", authMiddleware, AuthController.me);
