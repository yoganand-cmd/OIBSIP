import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Register() {
const [formData, setFormData] = useState({
name: "",
email: "",
password: ""
});

const [showPassword, setShowPassword] = useState(false);
const [loading, setLoading] = useState(false);
const [message, setMessage] = useState("");
const [messageType, setMessageType] = useState("");

const handleChange = (event) => {
setFormData({
...formData,
[event.target.name]: event.target.value
});

setMessage("");

};

const handleSubmit = async (event) => {
event.preventDefault();

setLoading(true);
setMessage("");

try {
  const response = await axios.post(
    "http://localhost:5000/api/auth/register",
    formData
  );

  setMessage(
  response.data.message ||
    "Registration successful. Check your email to verify your account."
);
  setMessageType("success");
  console.log(response.data);
} catch (error) {
  setMessage(
    error.response?.data?.message || "Registration failed. Please try again."
  );
  setMessageType("error");
} finally {
  setLoading(false);
}

};

return (
<div className="register-page">
<style>{`
.register-page {
min-height: 100vh;
display: flex;
align-items: center;
justify-content: center;
padding: 48px 20px;
background:
radial-gradient(ellipse at top right, rgba(243,108,50,0.09), transparent 42%),
#fffaf5;
color: #302019;
}

    .register-layout {
      display: grid;
      grid-template-columns: 0.9fr 1.1fr;
      width: min(960px, 100%);
      overflow: hidden;
      border: 1px solid #f0e5dc;
      border-radius: 26px;
      background: #fff;
      box-shadow: 0 20px 65px rgba(73,39,20,0.10);
    }

    .register-welcome-panel {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 620px;
      overflow: hidden;
      padding: 38px;
      background: #382219;
      color: white;
    }

    .register-welcome-panel::before {
      position: absolute;
      top: -80px;
      right: -95px;
      width: 250px;
      height: 250px;
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 50%;
      content: "";
    }

    .register-welcome-panel::after {
      position: absolute;
      right: -65px;
      bottom: -100px;
      width: 280px;
      height: 280px;
      border: 1px solid rgba(255,255,255,0.10);
      border-radius: 50%;
      content: "";
    }

    .register-brand {
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

    .register-brand-icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
      background: #f36c32;
      font-size: 23px;
    }

    .register-welcome-copy {
      position: relative;
      z-index: 1;
      margin: 45px 0;
    }

    .register-welcome-eyebrow {
      color: #ffb18d;
      font-size: 11px;
      font-weight: 850;
      letter-spacing: 2px;
      text-transform: uppercase;
    }

    .register-welcome-title {
      margin: 18px 0;
      color: white !important;
      font-size: clamp(30px, 3.4vw, 42px);
      font-weight: 900;
      letter-spacing: -1.5px;
      line-height: 1.13;
    }

    .register-welcome-text {
      max-width: 300px;
      margin: 0;
      color: #ddc9be;
      font-size: 14px;
      line-height: 1.9;
    }

    .register-benefits {
      position: relative;
      z-index: 1;
      display: grid;
      gap: 15px;
      margin-top: 28px;
    }

    .register-benefit {
      display: flex;
      align-items: center;
      gap: 11px;
      color: #f3e5dc;
      font-size: 13px;
    }

    .register-benefit-icon {
      width: 29px;
      height: 29px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 9px;
      background: rgba(243,108,50,0.18);
      color: #ffb18d;
    }

    .register-welcome-footer {
      position: relative;
      z-index: 1;
      color: #ddc9be;
      font-size: 12px;
    }

    .register-form-panel {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 40px 45px;
    }

    .register-mobile-brand {
      display: none;
    }

    .register-heading {
      margin: 0;
      color: #302019 !important;
      font-size: 31px;
      font-weight: 900;
      letter-spacing: -1px;
    }

    .register-description {
      margin: 10px 0 26px;
      color: #817168;
      font-size: 14px;
      line-height: 1.7;
    }

    .register-field {
      margin-bottom: 19px;
    }

    .register-label {
      display: block;
      margin-bottom: 9px;
      color: #49352b;
      font-size: 13px;
      font-weight: 800;
    }

    .register-input-wrap {
      position: relative;
    }

    .register-input {
      width: 100%;
      min-height: 48px;
      padding: 12px 14px;
      border: 1px solid #e8ddd4;
      border-radius: 11px;
      background: #fffdfa;
      color: #302019;
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }

    .register-input::placeholder {
      color: #ad9c91;
    }

    .register-input:focus {
      border-color: #f36c32;
      box-shadow: 0 0 0 4px rgba(243,108,50,0.12);
    }

    .register-password-input {
      padding-right: 78px;
    }

    .register-password-toggle {
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

    .register-password-toggle:focus-visible {
      outline: 2px solid #f36c32;
      outline-offset: 2px;
      border-radius: 4px;
    }

    .register-message {
      margin-bottom: 18px;
      padding: 12px 14px;
      border-radius: 10px;
      font-size: 13px;
      line-height: 1.6;
      overflow-wrap: anywhere;
    }

    .register-message.success {
      border: 1px solid #b9dfc8;
      background: #effaf3;
      color: #216c40;
    }

    .register-message.error {
      border: 1px solid #f1c5c1;
      background: #fff2f0;
      color: #a52f28;
    }

    .register-submit {
      display: flex;
      width: 100%;
      min-height: 50px;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-top: 6px;
      padding: 13px 18px;
      border: 0;
      border-radius: 11px;
      background: #f36c32;
      color: white;
      font-size: 14px;
      font-weight: 850;
      transition: background 0.2s ease, transform 0.2s ease;
    }

    .register-submit:hover:not(:disabled) {
      transform: translateY(-2px);
      background: #d94f1c;
    }

    .register-submit:disabled {
      cursor: not-allowed;
      opacity: 0.7;
    }

    .register-submit:focus-visible {
      outline: 3px solid #f7b79a;
      outline-offset: 3px;
    }

    .register-login-prompt {
      margin-top: 25px;
      color: #817168;
      font-size: 13px;
      text-align: center;
      line-height: 1.8;
    }

    .register-login-link {
      color: #b94718;
      font-weight: 850;
      text-decoration: none;
    }

    .register-login-link:hover {
      color: #d94f1c;
      text-decoration: underline;
    }

    .register-home-link {
      display: inline-block;
      margin-top: 18px;
      color: #99887e;
      font-size: 12px;
      font-weight: 700;
      text-align: center;
      text-decoration: none;
    }

    .register-home-link:hover {
      color: #b94718;
    }

    @media (max-width: 760px) {
      .register-page {
        padding: 28px 16px;
      }

      .register-layout {
        grid-template-columns: 1fr;
        width: min(490px, 100%);
        border-radius: 22px;
      }

      .register-welcome-panel {
        display: none;
      }

      .register-form-panel {
        padding: 34px 27px;
      }

      .register-mobile-brand {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 28px;
        color: #302019;
        font-size: 16px;
        font-weight: 850;
      }

      .register-mobile-brand .register-brand-icon {
        color: white;
      }

      .register-heading {
        font-size: 29px;
      }
    }

    @media (max-width: 380px) {
      .register-form-panel {
        padding: 28px 20px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .register-input,
      .register-submit {
        transition: none;
      }

      .register-submit:hover:not(:disabled) {
        transform: none;
      }
    }
  `}</style>

  <div className="register-layout">
    <aside className="register-welcome-panel">
      <div className="register-brand">
        <span className="register-brand-icon">🍕</span>
        <span>Pizza Delivery</span>
      </div>

      <div className="register-welcome-copy">
        <div className="register-welcome-eyebrow">
          A slice of happiness
        </div>

        <h2 className="register-welcome-title">
          Great pizza.
          <br />
          Great moments.
          <br />
          Starts here.
        </h2>

        <p className="register-welcome-text">
          Create your account and make ordering your favourite pizza
          simple, convenient, and delicious.
        </p>

        <div className="register-benefits">
          <div className="register-benefit">
            <span className="register-benefit-icon">✓</span>
            <span>Quick and easy ordering</span>
          </div>

          <div className="register-benefit">
            <span className="register-benefit-icon">✓</span>
            <span>Keep track of your orders</span>
          </div>

          <div className="register-benefit">
            <span className="register-benefit-icon">✓</span>
            <span>Your pizza favourites, all in one place</span>
          </div>
        </div>
      </div>

      <div className="register-welcome-footer">
        Freshly made. Happily delivered. 🍕
      </div>
    </aside>

    <main className="register-form-panel">
      <div className="register-mobile-brand">
        <span className="register-brand-icon">🍕</span>
        <span>Pizza Delivery</span>
      </div>

      <h1 className="register-heading">Create your account</h1>

      <p className="register-description">
        Join us and get ready for your next delicious order.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="register-field">
          <label className="register-label" htmlFor="name">
            Full Name
          </label>

          <input
            type="text"
            id="name"
            name="name"
            className="register-input"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            autoComplete="name"
            required
          />
        </div>

        <div className="register-field">
          <label className="register-label" htmlFor="email">
            Email Address
          </label>

          <input
            type="email"
            id="email"
            name="email"
            className="register-input"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            required
          />
        </div>

        <div className="register-field">
          <label className="register-label" htmlFor="password">
            Password
          </label>

          <div className="register-input-wrap">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              className="register-input register-password-input"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />

            <button
              type="button"
              className="register-password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {message && (
          <div
            className={`register-message ${messageType}`}
            role={messageType === "error" ? "alert" : "status"}
          >
            {message}
          </div>
        )}

        <button
          type="submit"
          className="register-submit"
          disabled={loading}
        >
          {loading ? "Creating account..." : "Create Account →"}
        </button>
      </form>

      <div className="register-login-prompt">
        Already have an account?{" "}
        <Link to="/login" className="register-login-link">
          Sign in
        </Link>
      </div>

      <Link to="/" className="register-home-link">
        ← Back to Home
      </Link>
    </main>
  </div>
</div>

);
}

export default Register;