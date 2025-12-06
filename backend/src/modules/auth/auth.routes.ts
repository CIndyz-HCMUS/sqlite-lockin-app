import { Router } from "express";
import { login, register } from "./auth.service";

export const authRouter = Router();

authRouter.post("/register", (req, res, next) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      age,
      gender,
      heightCm,
      weightKg,
      activityLevel,
      goalType,
      targetWeightKg,
      dailyCalorieAdjustment,
    } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res
        .status(400)
        .json({ message: "Missing email, password, firstName or lastName" });
    }

    const result = register({
      email,
      password,
      firstName,
      lastName,
      age,
      gender,
      heightCm,
      weightKg,
      activityLevel,
      goalType,
      targetWeightKg,
      dailyCalorieAdjustment,
    });

    return res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

authRouter.post("/login", (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Missing email or password" });
    }

    const result = login(email, password);
    return res.json(result);
  } catch (err) {
    next(err);
  }
});
