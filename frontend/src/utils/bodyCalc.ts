// src/utils/bodyCalc.ts

// BMI = weight (kg) / height(m)^2
export function calcBMI(weightKg?: number, heightCm?: number): number | null {
  if (!weightKg || !heightCm) return null;
  const h = heightCm / 100;
  if (h <= 0) return null;
  const bmi = weightKg / (h * h);
  return Number(bmi.toFixed(1));
}

// Mifflin-St Jeor BMR (đơn giản): gender = "male" | "female"
export function calcBMR(
  weightKg?: number,
  heightCm?: number,
  age?: number,
  gender?: string
): number | null {
  if (!weightKg || !heightCm || !age) return null;

  const isMale = gender === "male";
  const bmr =
    10 * weightKg +
    6.25 * heightCm -
    5 * age +
    (isMale ? 5 : -161); // Mifflin-St Jeor

  return Number(bmr.toFixed(0));
}

// Activity factor: low / medium / high
export function calcTDEE(
  bmr: number | null,
  activityLevel?: string
): number | null {
  if (!bmr) return null;

  let factor = 1.2; // default sedentary
  if (activityLevel === "medium") factor = 1.55;
  if (activityLevel === "high") factor = 1.725;

  return Number((bmr * factor).toFixed(0));
}
