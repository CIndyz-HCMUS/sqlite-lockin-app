import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface SignupStep1State {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  age?: number;
}

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState<string>("");

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!firstName || !lastName || !email || !password) {
      setError("Please fill all required fields.");
      return;
    }

    const state: SignupStep1State = {
      firstName,
      lastName,
      email,
      password,
      age: age ? Number(age) : undefined,
    };

    navigate("/getting-started", { state });
  };

  const goToSignIn = () => {
    navigate("/signin");
  };

  return (
    <div className="auth-page">
      <div className="auth-logo">LockIn</div>

      <div className="auth-tabs">
        <button className="auth-tab" onClick={goToSignIn}>
          Sign In
        </button>
        <button className="auth-tab active">Sign Up</button>
      </div>

      <div className="auth-card">
        <div className="auth-title">Join fitness community!</div>
        <div className="auth-subtitle">Create your LockIn account</div>

        <form onSubmit={handleSubmit}>
          <div className="auth-field-row">
            <div className="auth-field" style={{ flex: 1 }}>
              <label>First Name</label>
              <input
                className="auth-input"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            <div className="auth-field" style={{ flex: 1 }}>
              <label>Last Name</label>
              <input
                className="auth-input"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div className="auth-field">
            <label>Password</label>
            <input
              className="auth-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="auth-field">
            <label>Email</label>
            <input
              className="auth-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="auth-field">
            <label>Age</label>
            <input
              className="auth-input"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>

          {error && <p className="error-text">{error}</p>}

          <button className="auth-button" type="submit">
            Sign Up
          </button>

          <div className="auth-or">OR</div>
          <button
            type="button"
            className="auth-google-btn"
            onClick={() => alert("Google sign-up chưa làm")}
          >
            CONTINUE WITH GOOGLE
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
