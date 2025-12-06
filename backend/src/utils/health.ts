export function calcBMI(weightKg: number, heightCm: number): number {
  const h = heightCm / 100;
  if (!h) return 0;
  return weightKg / (h * h);
}

// Harris-Benedict (đơn giản, có thể chỉnh sau)
export function calcBMR(
  gender: "male" | "female" | "other",
  weightKg: number,
  heightCm: number,
  age: number
): number {
  if (!weightKg || !heightCm || !age) return 0;

  if (gender === "female") {
    return 655.1 + 9.563 * weightKg + 1.85 * heightCm - 4.676 * age;
  }
  // male + other dùng công thức male
  return 66.47 + 13.75 * weightKg + 5.003 * heightCm - 6.755 * age;
}

export function calcTDEE(
  bmr: number,
  activityLevel:
    | "sedentary"
    | "light"
    | "moderate"
    | "active"
    | "very_active"
    | string
): number {
  if (!bmr) return 0;
  const map: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };
  const factor = map[activityLevel] || 1.2;
  return bmr * factor;
}
