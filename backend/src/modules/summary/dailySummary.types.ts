export interface DailySummaryDTO {
  date: string;

  caloriesIntake: number;
  caloriesBurned: number;
  netCalories: number;

  totalMeals: number;
  macros: {
    protein: number;
    carb: number;
    fat: number;
  };

  totalWorkouts: number;
  totalWorkoutMin: number;

  totalRelaxSessions: number;
  totalRelaxMin: number;
  avgMoodBefore: number | null;
  avgMoodAfter: number | null;

  totalSleepMin: number;
  avgSleepQuality: number | null;

  totalWaterMl: number;
  totalWaterEvents: number;
}
