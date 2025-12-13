import {
  createUser,
  findUserByEmail,
} from "../users/user.repo";
import { RegisterInput } from "./auth.types";
import { hashPassword, comparePassword } from "../../utils/password";
import { signAccessToken } from "../../utils/jwt";
import { sanitizeUser } from "../users/user.service";

// ✅ Đổi sang async để dùng được await
export async function register(input: RegisterInput) {
  const existing = await findUserByEmail(input.email);
  if (existing) {
    const err = new Error("EMAIL_EXISTS");
    // @ts-ignore
    err.status = 409;
    throw err;
  }

  // ✅ hashPassword trả về Promise<string> → phải await
  const passwordHash = await hashPassword(input.password);

  const user = await createUser({
    email: input.email,
    passwordHash, // ✅ giờ là string, không còn Promise<string>
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

  // ✅ AccessTokenPayload yêu cầu { userId, email }
  const accessToken = signAccessToken({
    userId: user.id,
    email: user.email,
  });

  return {
    user: sanitizeUser(user),
    accessToken,
  };
}

// ✅ Đổi sang async để dùng được await (nếu comparePassword là async)
export async function login(email: string, password: string) {
  const user = await findUserByEmail(email);
  if (!user) {
    const err = new Error("INVALID_CREDENTIALS");
    // @ts-ignore
    err.status = 401;
    throw err;
  }

  // Nếu comparePassword là sync thì await cũng không sao,
  // còn nếu nó trả về Promise<boolean> thì bắt buộc phải await.
  const ok = await comparePassword(password, user.password_hash);
  if (!ok) {
    const err = new Error("INVALID_CREDENTIALS");
    // @ts-ignore
    err.status = 401;
    throw err;
  }

  const accessToken = signAccessToken({
    userId: user.id,
    email: user.email,
  });

  return {
    user: sanitizeUser(user),
    accessToken,
  };
}
