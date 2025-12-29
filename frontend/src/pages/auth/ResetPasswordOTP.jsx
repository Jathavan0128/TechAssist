// src/pages/auth/ResetPasswordOTP.jsx
import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function ResetPasswordOTP() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const email = state?.email || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [toast, setToast] = useState({ show: false, type: "", msg: "" });
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(45);

  const notify = (type, msg) => {
    setToast({ show: true, type, msg });
    setTimeout(() => setToast({ show: false }), 1800);
  };

  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1].focus();
  };

  const handleBackspace = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const checkStrength = (pass) => {
    let score = 0;
    if (pass.length > 5) score++;
    if (pass.length > 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 1) return { label: "Weak", color: "bg-red-500", width: "25%" };
    if (score === 2) return { label: "Medium", color: "bg-yellow-500", width: "50%" };
    if (score === 3) return { label: "Strong", color: "bg-green-500", width: "75%" };
    return { label: "Very Strong", color: "bg-blue-600", width: "100%" };
  };

  const strength = checkStrength(newPass);

  useEffect(() => {
    if (countdown === 0) return;
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const resendOTP = async () => {
    try {
      await api.post("/users/forgot-password-otp", { email });
      notify("success", "New OTP sent!");
      setCountdown(45);
    } catch {
      notify("error", "Failed to resend OTP");
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (otp.join("").length < 6) return notify("error", "Enter 6-digit OTP");
    if (newPass !== confirmPass) return notify("error", "Passwords do not match");

    setLoading(true);
    try {
      await api.post("/users/reset-password-otp", {
        email,
        otp: otp.join(""),
        newPassword: newPass,
      });
      notify("success", "Password reset successful!");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      notify("error", err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-xl shadow-lg">
      {toast.show && (
        <div
          className={`mb-4 px-4 py-3 rounded-lg text-white ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.msg}
        </div>
      )}

      <h1 className="text-2xl font-bold text-center mb-2">Reset Password</h1>
      <p className="text-gray-600 text-center mb-6">
        OTP sent to <strong>{email}</strong>
      </p>

      <form onSubmit={submit} className="space-y-6">
        <div className="flex justify-between">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => (inputRefs.current[idx] = el)}
              type="text"
              maxLength="1"
              className="w-12 h-12 text-center text-xl border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={digit}
              onChange={(e) => handleOtpChange(e.target.value, idx)}
              onKeyDown={(e) => handleBackspace(e, idx)}
            />
          ))}
        </div>

        <div className="text-center text-sm">
          {countdown > 0 ? (
            <span className="text-gray-500">Resend OTP in {countdown}s</span>
          ) : (
            <button
              type="button"
              onClick={resendOTP}
              className="text-indigo-600 underline"
            >
              Resend OTP
            </button>
          )}
        </div>

        <input
          type="password"
          placeholder="New Password"
          className="w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          value={newPass}
          onChange={(e) => setNewPass(e.target.value)}
          required
        />

        {newPass && (
          <div>
            <div className="text-sm text-gray-600 mb-1">{strength.label}</div>
            <div className="w-full h-2 bg-gray-200 rounded">
              <div
                className={`h-2 rounded ${strength.color}`}
                style={{ width: strength.width }}
              />
            </div>
          </div>
        )}

        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          value={confirmPass}
          onChange={(e) => setConfirmPass(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-semibold transition ${
            loading ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}
