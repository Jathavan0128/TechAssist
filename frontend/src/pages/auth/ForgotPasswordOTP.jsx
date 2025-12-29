// src/pages/auth/ForgotPasswordOTP.jsx
import React, { useState } from "react";
import api from "../../api/axios";
import { Link, useNavigate } from "react-router-dom";

export default function ForgotPasswordOTP() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      await api.post("/users/forgot-password-otp", { email });
      setStatus({ type: "success", message: "OTP sent if email exists" });
      setTimeout(() => {
        navigate("/reset-password", { state: { email } });
      }, 900);
    } catch (err) {
      setStatus({
        type: "error",
        message: err.response?.data?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 bg-white p-8 rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">Forgot Password</h1>

      {status && (
        <div
          className={`p-3 mb-4 rounded-lg text-sm ${
            status.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {status.message}
        </div>
      )}

      <form onSubmit={submit} className="space-y-4">
        <input
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          placeholder="Enter your email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send OTP"}
        </button>
      </form>

      <Link
        to="/login"
        className="block mt-4 text-indigo-600 underline text-center text-sm"
      >
        Back to login
      </Link>
    </div>
  );
}
