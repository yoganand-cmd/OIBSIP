
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config/api";
export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("Verifying your email...");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("The verification link is invalid or missing.");
      return;
    }

    let cancelled = false;

    axios
      .post(`${API_BASE_URL}/api/auth/verify-email`, { token })
      .then((response) => {
        if (cancelled) return;
        setStatus(response.data.message || "Email verified successfully.");
        setSuccess(true);
      })
      .catch((error) => {
        if (cancelled) return;
        setStatus(
          error.response?.data?.message ||
            "Email verification failed. Please request a new link."
        );
      });

    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  return (
    <main style={{ maxWidth: 480, margin: "80px auto", padding: 24 }}>
      <h1>Email Verification</h1>
      <p role="status">{status}</p>
      {success && <p>You can now sign in to your account.</p>}
      <Link to="/login">Go to Login</Link>
    </main>
  );
}
