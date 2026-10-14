import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API_BASE_URL from "../config/api";
function Login() {
const { login } = useAuth();
const navigate = useNavigate();

const [formData, setFormData] = useState({
email: "",
password: ""
});

const [showPassword, setShowPassword] = useState(false);
const [loading, setLoading] = useState(false);
const [errorMessage, setErrorMessage] = useState("");
const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
const [forgotPasswordMessage, setForgotPasswordMessage] = useState("");
const handleChange = (event) => {
setFormData({
...formData,
[event.target.name]: event.target.value
});

setErrorMessage("");

};

const handleForgotPassword = async (event) => {
  event.preventDefault();
  setForgotPasswordMessage("");

  const email = formData.email.trim().toLowerCase();

  if (!email) {
    setForgotPasswordMessage("Please enter your email address above first.");
    return;
  }

  setLoading(true);

  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/auth/forgot-password`,
      { email }
    );

    setForgotPasswordMessage(
      response.data.message || "Please check your email for a reset link."
    );
  } catch (error) {
    setForgotPasswordMessage(
      error.response?.data?.message ||
        "Could not request a password reset. Please try again."
    );
  } finally {
    setLoading(false);
  }
};

const handleSubmit = async (event) => {
event.preventDefault();
setLoading(true);
setErrorMessage("");

try {
  const response = await axios.post(
    `${API_BASE_URL}/api/auth/login`,
    formData
  );

  login(response.data.user, response.data.token);

  // Redirect to Home page after successful login
  navigate("/");

  console.log(response.data);
} catch (error) {
  setErrorMessage(
    error.response?.data?.message || "Login failed. Please try again."
  );
} finally {
  setLoading(false);
}

};

return (
<div className="login-page">
<style>{`
.login-page {
min-height: 100vh;
display: flex;
align-items: center;
justify-content: center;
padding: 48px 20px;
background:
radial-gradient(ellipse at top left, rgba(243,108,50,0.09), transparent 42%),
#fffaf5;
color: #302019;
}

    .login-layout {
      display: grid;
      grid-template-columns: 0.9fr 1.1fr;
      width: min(920px, 100%);
      overflow: hidden;
      border: 1px solid #f0e5dc;
      border-radius: 26px;
      background: #fff;
      box-shadow: 0 20px 65px rgba(73,39,20,0.10);
    }

    .login-welcome-panel {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 540px;
      overflow: hidden;
      padding: 38px;
      background: #382219;
      color: white;
    }

    .login-welcome-panel::before {
      position: absolute;
      top: -80px;
      right: -95px;
      width: 250px;
      height: 250px;
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 50%;
      content: "";
    }

    .login-welcome-panel::after {
      position: absolute;
      right: -65px;
      bottom: -100px;
      width: 280px;
      height: 280px;
      border: 1px solid rgba(255,255,255,0.10);
      border-radius: 50%;
      content: "";
    }

    .login-brand {
      position: relative;
      z-index: 1;
      display: flex;
      align-items: center;
      gap: 10px;
      color: white;
      font-size: 17px;
      font-weight: 850;
      letter-spacing: -0.4px;
    }

    .login-brand-icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
      background: #f36c32;
      font-size: 23px;
    }

    .login-welcome-copy {
      position: relative;
      z-index: 1;
      margin: 48px 0;
    }

    .login-welcome-eyebrow {
      color: #ffb18d;
      font-size: 11px;
      font-weight: 850;
      letter-spacing: 2px;
      text-transform: uppercase;
    }

    .login-welcome-title {
      margin: 18px 0;
      color: white !important;
      font-size: clamp(30px, 3.4vw, 42px);
      font-weight: 900;
      letter-spacing: -1.5px;
      line-height: 1.13;
    }

    .login-welcome-text {
      max-width: 300px;
      margin: 0;
      color: #ddc9be;
      font-size: 14px;
      line-height: 1.9;
    }

    .login-welcome-footer {
      position: relative;
      z-index: 1;
      color: #ddc9be;
      font-size: 12px;
    }

    .login-form-panel {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 45px;
    }

    .login-mobile-brand {
      display: none;
    }

    .login-heading {
      margin: 0;
      color: #302019 !important;
      font-size: 31px;
      font-weight: 900;
      letter-spacing: -1px;
    }

    .login-description {
      margin: 10px 0 30px;
      color: #817168;
      font-size: 14px;
      line-height: 1.7;
    }

    .login-field {
      margin-bottom: 21px;
    }

    .login-label {
      display: block;
      margin-bottom: 9px;
      color: #49352b;
      font-size: 13px;
      font-weight: 800;
    }

    .login-input-wrap {
      position: relative;
    }

    .login-input {
      width: 100%;
      min-height: 49px;
      padding: 13px 14px;
      border: 1px solid #e8ddd4;
      border-radius: 11px;
      background: #fffdfa;
      color: #302019;
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }

    .login-input::placeholder {
      color: #ad9c91;
    }

    .login-input:focus {
      border-color: #f36c32;
      box-shadow: 0 0 0 4px rgba(243,108,50,0.12);
    }

    .login-password-input {
      padding-right: 78px;
    }

    .login-password-toggle {
      position: absolute;
      top: 50%;
      right: 13px;
      transform: translateY(-50%);
      padding: 5px;
      border: 0;
      background: transparent;
      color: #b94718;
      font-size: 12px;
      font-weight: 800;
      cursor: pointer;
    }

    .login-password-toggle:focus-visible {
      outline: 2px solid #f36c32;
      outline-offset: 2px;
      border-radius: 4px;
    }

    .login-error {
      margin-bottom: 19px;
      padding: 12px 14px;
      border: 1px solid #f1c5c1;
      border-radius: 10px;
      background: #fff2f0;
      color: #a52f28;
      font-size: 13px;
      line-height: 1.6;
    }

    .login-submit {
      display: flex;
      width: 100%;
      min-height: 50px;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-top: 7px;
      padding: 13px 18px;
      border: 0;
      border-radius: 11px;
      background: #f36c32;
      color: white;
      font-size: 14px;
      font-weight: 850;
      transition: background 0.2s ease, transform 0.2s ease;
    }

    .login-submit:hover:not(:disabled) {
      transform: translateY(-2px);
      background: #d94f1c;
    }

    .login-submit:disabled {
      cursor: not-allowed;
      opacity: 0.7;
    }

    .login-submit:focus-visible {
      outline: 3px solid #f7b79a;
      outline-offset: 3px;
    }

    .login-register-prompt {
      margin-top: 27px;
      color: #817168;
      font-size: 13px;
      text-align: center;
      line-height: 1.8;
    }

    .login-register-link {
      color: #b94718;
      font-weight: 850;
      text-decoration: none;
    }

    .login-register-link:hover {
      color: #d94f1c;
      text-decoration: underline;
    }

    .login-home-link {
      display: inline-block;
      margin-top: 20px;
      color: #99887e;
      font-size: 12px;
      font-weight: 700;
      text-align: center;
      text-decoration: none;
    }

    .login-home-link:hover {
      color: #b94718;
    }

    @media (max-width: 720px) {
      .login-page {
        padding: 28px 16px;
      }

      .login-layout {
        grid-template-columns: 1fr;
        width: min(470px, 100%);
        border-radius: 22px;
      }

      .login-welcome-panel {
        display: none;
      }

      .login-form-panel {
        padding: 34px 27px;
      }

      .login-mobile-brand {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 31px;
        color: #302019;
        font-size: 16px;
        font-weight: 850;
      }

      .login-mobile-brand .login-brand-icon {
        color: white;
      }

      .login-heading {
        font-size: 29px;
      }
    }

    @media (max-width: 380px) {
      .login-form-panel {
        padding: 28px 20px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .login-input,
      .login-submit {
        transition: none;
      }

      .login-submit:hover:not(:disabled) {
        transform: none;
      }
    }
  `}</style>

  <div className="login-layout">
    <aside className="login-welcome-panel">
      <div className="login-brand">
        <span className="login-brand-icon">🍕</span>
        <span>Pizza Delivery</span>
      </div>

      <div className="login-welcome-copy">
        <div className="login-welcome-eyebrow">
          Good food, good mood
        </div>

        <h2 className="login-welcome-title">
          Your next
          <br />
          favourite slice
          <br />
          is waiting.
        </h2>

        <p className="login-welcome-text">
          Sign in to continue your pizza journey. Your favourites are
          just a few clicks away.
        </p>
      </div>

      <div className="login-welcome-footer">
        Freshly made. Happily delivered. 🍕
      </div>
    </aside>

    <main className="login-form-panel">
      <div className="login-mobile-brand">
        <span className="login-brand-icon">🍕</span>
        <span>Pizza Delivery</span>
      </div>

      <h1 className="login-heading">Welcome back!</h1>

      <p className="login-description">
        Sign in to your account to continue ordering.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="login-field">
          <label className="login-label" htmlFor="email">
            Email Address
          </label>

          <input
            type="email"
            id="email"
            name="email"
            className="login-input"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            required
          />
        </div>

        <div className="login-field">
          <label className="login-label" htmlFor="password">
            Password
          </label>

          <div className="login-input-wrap">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              className="login-input login-password-input"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />

            <button
              type="button"
              className="login-password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {errorMessage && (
          <div className="login-error" role="alert">
            {errorMessage}
          </div>
        )}

<div style={{ textAlign: "right", marginBottom: "18px" }}>
  <button
    type="button"
    onClick={() => {
      setForgotPasswordMode(!forgotPasswordMode);
      setForgotPasswordMessage("");
    }}
    style={{
      border: "none",
      background: "transparent",
      color: "#b94718",
      fontWeight: 800,
      cursor: "pointer",
      fontSize: "13px",
    }}
  >
    {forgotPasswordMode ? "Cancel" : "Forgot password?"}
  </button>
</div>

{forgotPasswordMode && (
  <div style={{ marginBottom: "18px" }}>
    <p>
      Enter your email in the email field above, then request a password
      reset link.
    </p>

    <button
      type="button"
      className="login-submit"
      disabled={loading}
      onClick={handleForgotPassword}
    >
      {loading ? "Sending..." : "Send Reset Link"}
    </button>

    {forgotPasswordMessage && (
      <div className="login-error" role="status">
        {forgotPasswordMessage}
      </div>
    )}
  </div>
)}


        <button
          type="submit"
          className="login-submit"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In →"}
        </button>
      </form>

      <div className="login-register-prompt">
        Don't have an account?{" "}
        <Link to="/register" className="login-register-link">
          Create an account
        </Link>
      </div>

      <Link to="/" className="login-home-link">
        ← Back to Home
      </Link>
    </main>
  </div>
</div>

);
}

export default Login;