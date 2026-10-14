
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config/api";
export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setSuccess(false);

    const token = searchParams.get("token");

    if (!token) {
      setMessage("The password reset link is invalid or missing.");
      return;
    }

    if (password.length < 8) {
      setMessage("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/reset-password`,
        { token, password }
      );

      setMessage(response.data.message || "Password reset successfully.");
      setSuccess(true);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Unable to reset password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: 480, margin: "80px auto", padding: 24 }}>
      <h1>Reset Password</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="new-password">New password</label>
        <input
          id="new-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          minLength={8}
          autoComplete="new-password"
          required
          style={{
            display: "block",
            width: "100%",
            padding: 12,
            margin: "12px 0",
            boxSizing: "border-box",
          }}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>

      {message && <p role="status">{message}</p>}
      {success && <Link to="/login">Go to Login</Link>}
    </main>
  );
}
