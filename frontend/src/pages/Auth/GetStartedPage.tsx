// frontend/src/pages/auth/GetStartedPage.tsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { registerApi } from "../../services/authService";
import { calcBMI, calcBMR, calcTDEE } from "../../utils/bodyCalc";

interface SignupStep1State {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  age?: number;
}

const GetStartedPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fromSignup = location.state as SignupStep1State | null;

  const [weightKg, setWeightKg] = useState<string>("");
  const [heightCm, setHeightCm] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [goalType, setGoalType] = useState<string>("");
  const [targetWeightKg, setTargetWeightKg] = useState<string>("");
  const [activityLevel, setActivityLevel] = useState<string>("");
  const [dailyCalorieAdjustment, setDailyCalorieAdjustment] =
    useState<string>("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // nếu không đi từ SignUp thì đá về /signup
  useEffect(() => {
    if (!fromSignup || !fromSignup.email || !fromSignup.password) {
      navigate("/signup", { replace: true });
    }
  }, [fromSignup, navigate]);

  // ====== TÍNH BMI / BMR / TDEE ======
  const weight = weightKg ? Number(weightKg) : undefined;
  const height = heightCm ? Number(heightCm) : undefined;
  const targetWeight = targetWeightKg ? Number(targetWeightKg) : undefined;
  const age = fromSignup?.age;

  const currentBMI = calcBMI(weight, height);
  const targetBMI = calcBMI(targetWeight, height);
  const bmr = calcBMR(weight, height, age, gender);
  const tdee = calcTDEE(bmr, activityLevel);

  const safeMinBMI = 18.5;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromSignup) return;

    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      await registerApi({
        email: fromSignup.email,
        password: fromSignup.password,
        firstName: fromSignup.firstName,
        lastName: fromSignup.lastName,
        age: fromSignup.age,
        weightKg: weight,
        heightCm: height,
        gender: gender || undefined,
        goalType: goalType || undefined,
        targetWeightKg: targetWeight,
        activityLevel: activityLevel || undefined,
        dailyCalorieAdjustment: dailyCalorieAdjustment
          ? Number(dailyCalorieAdjustment)
          : undefined,
      });

      setSuccess("Account created! Please sign in.");
      setTimeout(() => {
        navigate("/signin", { replace: true });
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="get-started-page">
      <form className="get-started-card" onSubmit={handleSubmit}>
        {/* header: title + nút quay lại */}
        <div className="get-started-header">
          <div className="get-started-title">Get Started</div>

          <button
            type="button"
            className="get-started-back"
            onClick={() => navigate(-1)} // quay lại màn trước
          >
            ← Back
          </button>
        </div>

        {/* grid các field */}
        <div className="get-started-grid">
          <div>
            <div className="get-started-label">Your weight (kg)</div>
            <input
              className="get-started-input"
              type="number"
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
            />
          </div>

          <div>
            <div className="get-started-label">Your height (cm)</div>
            <input
              className="get-started-input"
              type="number"
              value={heightCm}
              onChange={(e) => setHeightCm(e.target.value)}
            />
          </div>

          <div>
            <div className="get-started-label">Your gender?</div>
            <select
              className="get-started-select"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Select your gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <div className="get-started-label">What is your goal?</div>
            <select
              className="get-started-select"
              value={goalType}
              onChange={(e) => setGoalType(e.target.value)}
            >
              <option value="">Select your goal</option>
              <option value="lose">Lose weight</option>
              <option value="maintain">Maintain</option>
              <option value="gain">Gain muscle</option>
            </select>
          </div>

          <div>
            <div className="get-started-label">What is your target weight?</div>
            <input
              className="get-started-input"
              type="number"
              value={targetWeightKg}
              onChange={(e) => setTargetWeightKg(e.target.value)}
            />
          </div>

          <div>
            <div className="get-started-label">What is your activity level?</div>
            <select
              className="get-started-select"
              value={activityLevel}
              onChange={(e) => setActivityLevel(e.target.value)}
            >
              <option value="">Select your activity level</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="get-started-full">
            <div className="get-started-label">
              How much calories a day do you want to adjust?
            </div>
            <input
              className="get-started-input"
              type="number"
              value={dailyCalorieAdjustment}
              onChange={(e) => setDailyCalorieAdjustment(e.target.value)}
            />
          </div>
        </div>

        {/* các dòng BMI / BMR / TDEE */}
        {currentBMI && (
          <p className="hint-text">
            Your current BMI is <strong>{currentBMI}</strong>.
          </p>
        )}

        {targetBMI && (
          <p className="hint-text">
            Your target BMI is <strong>{targetBMI}</strong>.
          </p>
        )}

        {targetBMI && targetBMI < safeMinBMI && (
          <p className="warning-text">
            Your BMI shouldn&apos;t be under {safeMinBMI}. Please reconsider your
            target weight.
          </p>
        )}

        {bmr && tdee && (
          <p className="hint-text">
            Your BMR is <strong>{bmr}</strong> kcal, your TDEE is{" "}
            <strong>{tdee}</strong> kcal.
          </p>
        )}

        {bmr &&
          dailyCalorieAdjustment &&
          Number(dailyCalorieAdjustment) > 0 &&
          bmr - Number(dailyCalorieAdjustment) < bmr * 0.7 && (
            <p className="warning-text">
              You shouldn&apos;t consume calories below your BMR too much. Lower
              your deficit or raise your activity level!
            </p>
          )}

        {error && <p className="error-text">{error}</p>}
        {success && <p className="success-text">{success}</p>}

        <button
          className="get-started-button"
          type="submit"
          disabled={loading}
        >
          {loading ? "Creating..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default GetStartedPage;
