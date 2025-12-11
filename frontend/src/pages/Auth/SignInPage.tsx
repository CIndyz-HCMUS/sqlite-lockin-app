import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../../services/authService";
import { saveAuth } from "../../utils/authStorage";

const SignInPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await loginApi(email, password);
      saveAuth({ user: res.user, token: res.accessToken });
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const goToSignUp = () => {
    navigate("/signup");
  };

  return (
    <div className="auth-page">
      <div className="auth-logo">LockIn</div>

      <div className="auth-tabs">
        <button className="auth-tab active">Sign In</button>
        <button className="auth-tab" onClick={goToSignUp}>
          Sign Up
        </button>
      </div>

      <div className="auth-card">
        <div className="auth-title">Sign in to continue</div>
        <div className="auth-subtitle">Welcome back :)</div>

        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>Username / Email</label>
            <input
              className="auth-input"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="auth-field">
            <label>Password</label>
            <input
              className="auth-input"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="error-text">{error}</p>}

          <button className="auth-button" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <div className="auth-or">OR</div>
          <button
            type="button"
            className="auth-google-btn"
            onClick={() => alert("Google sign-in chưa làm")}
          >
            CONTINUE WITH GOOGLE
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignInPage;
