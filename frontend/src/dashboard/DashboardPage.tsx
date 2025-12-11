import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadAuth, clearAuth } from "../utils/authStorage";
import MealFoodModal, {
  FoodItem,
  MealType,
} from "../components/MealFoodModal";
import ActivityModal, {
  ActivityItem,
  ActivityType,
} from "../components/ActivityModal";
import { calcBMI, calcBMR, calcTDEE } from "../utils/bodyCalc";

interface MealLog {
  mealType: MealType;
  foods: FoodItem[];
}

interface ActivityLog {
  activityType: ActivityType;
  activities: ActivityItem[];
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const auth = loadAuth();

  const [mealLogs, setMealLogs] = useState<MealLog[]>([
    { mealType: "breakfast", foods: [] },
    { mealType: "lunch", foods: [] },
    { mealType: "dinner", foods: [] },
    { mealType: "snack", foods: [] },
  ]);

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([
    { activityType: "cardio", activities: [] },
    { activityType: "strength", activities: [] },
  ]);

  const [foodModalOpen, setFoodModalOpen] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<MealType | null>(
    null
  );

  const [activityModalOpen, setActivityModalOpen] = useState(false);
  const [selectedActivityType, setSelectedActivityType] =
    useState<ActivityType | null>(null);

  useEffect(() => {
    if (!auth || !auth.user) {
      navigate("/signin", { replace: true });
    }
  }, [auth, navigate]);

  const handleLogout = () => {
    clearAuth();
    navigate("/signin", { replace: true });
  };

  const displayName =
    (auth?.user as any)?.firstName ||
    (auth?.user as any)?.first_name ||
    (auth?.user as any)?.full_name ||
    auth?.user?.email ||
    "User";

  // ==== Nutrition summary from mealLogs ====
const totalCaloriesConsumed = mealLogs.reduce((sum, log) => {
  const kcal = log.foods.reduce(
    (s, f) => s + f.caloriesPerServing, // ✅ dùng field mới
    0
  );
  return sum + kcal;
}, 0);


  // ==== Activity summary from activityLogs ====
  const totalCaloriesBurned = activityLogs.reduce((sum, log) => {
    const kcal = log.activities.reduce(
      (s, a) => s + a.caloriesPerSession,
      0
    );
    return sum + kcal;
  }, 0);

  const baseGoal = 2000; // TODO: nối với goal người dùng
  const burned = totalCaloriesBurned;
  const remaining = baseGoal - totalCaloriesConsumed + burned;

  // ==== User profile calculations ====
  const user = auth?.user as any;
  const weightKg = user?.weightKg || user?.weight_kg;
  const heightCm = user?.heightCm || user?.height_cm;
  const age = user?.age;
  const gender = user?.gender;

  const bmi = calcBMI(weightKg, heightCm);
  const bmr = calcBMR(weightKg, heightCm, age, gender);
  const tdee = calcTDEE(bmr, user?.activityLevel || user?.activity_level);

  // ====== Meal handlers ======
  const handleOpenFoodModal = (mealType: MealType) => {
    setSelectedMealType(mealType);
    setFoodModalOpen(true);
  };

  const handleAddFoodToMeal = (mealType: MealType, food: FoodItem) => {
    setMealLogs((prev) =>
      prev.map((log) =>
        log.mealType === mealType
          ? { ...log, foods: [...log.foods, food] }
          : log
      )
    );
  };

  const handleCloseFoodModal = () => {
    setFoodModalOpen(false);
    setSelectedMealType(null);
  };

  const getFoodsForMeal = (mealType: MealType) =>
    mealLogs.find((m) => m.mealType === mealType)?.foods ?? [];

  const renderMealBox = (mealType: MealType, label: string) => {
    const foods = getFoodsForMeal(mealType);
    const total = foods.reduce(
      (sum, f) => sum + f.caloriesPerServing, 
      0
    );

    return (
      <div className="meal-box">
        <div className="meal-box-header">
          <span>{label}</span>
          <button
            type="button"
            className="meal-add-btn"
            onClick={() => handleOpenFoodModal(mealType)}
          >
            Add Food
          </button>
        </div>
        <div className="meal-box-body">
          {foods.length === 0 ? (
            <div className="meal-box-empty">No food logged</div>
          ) : (
            <>
              <ul className="meal-food-list">
                {foods.map((f) => (
                  <li key={`${mealType}-${f.id}-${Math.random()}`}>
                    <span>{f.name}</span>
                    <span>{f.caloriesPerServing} kcal</span>
                  </li>
                ))}
              </ul>
              <div className="meal-box-total">
                Total: <strong>{total} kcal</strong>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  // ====== Activity handlers ======
  const handleOpenActivityModal = (type: ActivityType) => {
    setSelectedActivityType(type);
    setActivityModalOpen(true);
  };

  const handleAddActivity = (
    type: ActivityType,
    activity: ActivityItem
  ) => {
    setActivityLogs((prev) =>
      prev.map((log) =>
        log.activityType === type
          ? { ...log, activities: [...log.activities, activity] }
          : log
      )
    );
  };

  const handleCloseActivityModal = () => {
    setActivityModalOpen(false);
    setSelectedActivityType(null);
  };

  const getActivitiesForType = (type: ActivityType) =>
    activityLogs.find((l) => l.activityType === type)?.activities ?? [];

  const renderActivityBox = (type: ActivityType, label: string) => {
    const acts = getActivitiesForType(type);
    const total = acts.reduce(
      (sum, a) => sum + a.caloriesPerSession,
      0
    );

    return (
      <div className="activity-box">
        <div className="activity-header">
          <span>{label}</span>
          <button
            type="button"
            className="activity-add-btn"
            onClick={() => handleOpenActivityModal(type)}
          >
            Add Activity
          </button>
        </div>
        <div className="activity-body">
          {acts.length === 0 ? (
            <div className="activity-empty">No activity logged</div>
          ) : (
            <>
              <ul className="activity-list">
                {acts.map((a) => (
                  <li key={`${type}-${a.id}-${Math.random()}`}>
                    <span>{a.name}</span>
                    <span>{a.caloriesPerSession} kcal</span>
                  </li>
                ))}
              </ul>
              <div className="activity-total">
                Total: <strong>{total} kcal</strong>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-shell">
      {/* TOP BAR */}
      <header className="topbar">
        <div className="topbar-left">
          <div className="topbar-logo">LockIn</div>
          <nav className="topbar-nav">
            <button className="topbar-nav-item active">Meal</button>
            <button className="topbar-nav-item">Activity</button>
            <button className="topbar-nav-item">Relaxation</button>
            <button className="topbar-nav-item">Report</button>
            <button className="topbar-nav-item">My Plan</button>
          </nav>
        </div>
        <div className="topbar-right">
          <button className="topbar-icon">Q&amp;A</button>
          <div className="topbar-avatar" />
          <button className="dashboard-logout" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="dashboard-main">
        {/* LEFT COLUMN */}
        <div className="dashboard-main-left">
          {/* TODAY CARD */}
          <section className="today-card">
            <div className="today-header">
              <div className="today-title">TODAY, DATE</div>
            </div>

            <div className="today-top">
              <div className="today-circle">
                <div className="today-circle-inner">
                  <div className="today-circle-label">consumed</div>
                  <div className="today-circle-value">
                    {totalCaloriesConsumed}
                  </div>
                  <div className="today-circle-unit">kcal</div>
                </div>
              </div>

              <div className="today-goal">
                <div className="today-goal-row">
                  <div className="today-goal-label">Base Goal</div>
                  <div className="today-goal-value">{baseGoal} kcal</div>
                </div>
                <div className="today-goal-row">
                  <div className="today-goal-label">Remaining</div>
                  <div className="today-goal-value">
                    {remaining > 0 ? remaining : 0} kcal
                  </div>
                </div>
                <div className="today-goal-row">
                  <div className="today-goal-label">Burned</div>
                  <div className="today-goal-value">{burned} kcal</div>
                </div>
              </div>
            </div>

            {/* Macros – tạm thời để 0 */}
            <div className="today-macros">
              <div className="macro-box">Carb 0/0g</div>
              <div className="macro-box">Protein 0/0g</div>
              <div className="macro-box">Fat 0/0g</div>
              <div className="macro-box">Fiber 0/0g</div>
            </div>
          </section>

          {/* MEAL DIARY */}
          <section className="panel">
            <div className="panel-title">Meal</div>
            <div className="meal-grid">
              {renderMealBox("breakfast", "Breakfast")}
              {renderMealBox("lunch", "Lunch")}
              {renderMealBox("dinner", "Dinner")}
              {renderMealBox("snack", "Snacks")}
            </div>
          </section>

          {/* ACTIVITY */}
          <section className="panel">
            <div className="panel-title">Activity</div>
            <div className="activity-grid">
              {renderActivityBox("cardio", "Cardiovascular")}
              {renderActivityBox("strength", "Strength Training")}
            </div>
          </section>

          {/* BOTTOM PLACEHOLDER */}
          <section className="bottom-placeholder" />
        </div>

        {/* RIGHT COLUMN: profile như cũ */}
        <div className="dashboard-main-right">
          <section className="profile-card">
            <div className="profile-header">
              <div className="profile-title">USER PROFILE</div>
              <div className="profile-avatar-large" />
            </div>
            <div className="profile-body">
              <div className="profile-row">
                <span>Name</span>
                <span>{displayName}</span>
              </div>
              <div className="profile-row">
                <span>Sex</span>
                <span>{gender || "--"}</span>
              </div>
              <div className="profile-row">
                <span>Height</span>
                <span>{heightCm ? `${heightCm} cm` : "--"}</span>
              </div>
              <div className="profile-row">
                <span>Weight</span>
                <span>{weightKg ? `${weightKg} kg` : "--"}</span>
              </div>
              <div className="profile-row">
                <span>Age</span>
                <span>{age ?? "--"}</span>
              </div>
            </div>
          </section>

          <section className="profile-card">
            <div className="profile-subtitle">BODY MEASUREMENTS</div>
            {["Neck", "Bust", "Waist", "Upper Arm", "Thigh"].map((field) => (
              <div key={field} className="profile-row">
                <span>{field}</span>
                <span>-- cm</span>
              </div>
            ))}
          </section>

          <section className="profile-card">
            <div className="profile-subtitle">GOAL</div>
            <div className="profile-row">
              <span>Target Weight</span>
              <span>
                {user?.targetWeightKg || user?.target_weight_kg
                  ? `${user.targetWeightKg || user.target_weight_kg} kg`
                  : "--"}
              </span>
            </div>

            <div className="profile-metric">
              <div className="profile-metric-title">
                BMR (Basal Metabolic Rate)
              </div>
              <div className="profile-metric-value">
                {bmr ? `${bmr} kcal` : "--"}
              </div>
              <div className="profile-metric-desc">
                Minimum energy your body needs to survive.
              </div>
            </div>

            <div className="profile-metric">
              <div className="profile-metric-title">
                TDEE (Total Daily Energy Expenditure)
              </div>
              <div className="profile-metric-value">
                {tdee ? `${tdee} kcal` : "--"}
              </div>
              <div className="profile-metric-desc">
                BMR + calories burned from everyday activities.
              </div>
            </div>

            <div className="profile-metric">
              <div className="profile-metric-title">BMI (Body Mass Index)</div>
              <div className="profile-metric-value">
                {bmi ? bmi.toFixed(1) : "---"}
              </div>
              <div className="profile-metric-desc">
                A simple number used to estimate whether your weight is healthy
                for your height.
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* MODALS */}
      <MealFoodModal
        open={foodModalOpen}
        mealType={selectedMealType}
        onClose={handleCloseFoodModal}
        onAddFood={handleAddFoodToMeal}
      />

      <ActivityModal
        open={activityModalOpen}
        activityType={selectedActivityType}
        onClose={handleCloseActivityModal}
        onAddActivity={handleAddActivity}
      />
    </div>
  );
};

export default DashboardPage;
