import { apiRequest } from "./api";

export interface AuthUser {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  full_name?: string;
  role?: string;
  // thêm field khác nếu backend trả về
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  age?: number;
  gender?: string;
  heightCm?: number;
  weightKg?: number;
  activityLevel?: string;
  goalType?: string;
  targetWeightKg?: number;
  dailyCalorieAdjustment?: number;
}

export async function loginApi(
  email: string,
  password: string
): Promise<LoginResponse> {
  return apiRequest<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function registerApi(
  payload: RegisterPayload
): Promise<LoginResponse> {
  return apiRequest<LoginResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
