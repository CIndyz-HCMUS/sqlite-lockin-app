import {
  createUser,
  findUserByEmail,
} from "../users/user.repo";
import { RegisterInput } from "./auth.types";
import { hashPassword, comparePassword } from "../../utils/password";
import { signAccessToken } from "../../utils/jwt";
import { sanitizeUser } from "../users/user.service";

export function register(input: RegisterInput) {
  const existing = findUserByEmail(input.email);
  if (existing) {
    const err = new Error("EMAIL_EXISTS");
    // @ts-ignore
    err.status = 409;
    throw err;
  }

  const passwordHash = hashPassword(input.password);

  const user = createUser({
    email: input.email,
    passwordHash,
    firstName: input.firstName,
    lastName: input.lastName,
    age: input.age,
    gender: input.gender,
    heightCm: input.heightCm,
    weightKg: input.weightKg,
    activityLevel: input.activityLevel,
    goalType: input.goalType,
    targetWeightKg: input.targetWeightKg,
    dailyCalorieAdjustment: input.dailyCalorieAdjustment,
  });

  const accessToken = signAccessToken({ userId: user.id });

  return {
    user: sanitizeUser(user),
    accessToken,
  };
}

export function login(email: string, password: string) {
  const user = findUserByEmail(email);
  if (!user) {
    const err = new Error("INVALID_CREDENTIALS");
    // @ts-ignore
    err.status = 401;
    throw err;
  }

  const ok = comparePassword(password, user.password_hash);
  if (!ok) {
    const err = new Error("INVALID_CREDENTIALS");
    // @ts-ignore
    err.status = 401;
    throw err;
  }

  const accessToken = signAccessToken({ userId: user.id });

  return {
    user: sanitizeUser(user),
    accessToken,
  };
}
