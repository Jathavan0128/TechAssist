// src/pages/user/ChangePassword.jsx
import React, { useState } from "react";
import api from "../../api/axios";

export default function ChangePassword() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const updateField = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitChange = async (e) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      return setStatus({
        type: "error",
        message: "New passwords do not match",
      });
    }

    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const res = await api.put("/users/change-password", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      setStatus({
        type: "success",
        message: res.data.message || "Password updated!",
      });

      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setStatus({
        type: "error",
        message: err.response?.data?.message || "Failed to update password",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-semibold mb-4">Change Password</h1>

      {status.message && (
        <div
          className={`p-3 mb-4 rounded ${
            status.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {status.message}
        </div>
      )}

      <form onSubmit={submitChange} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Current Password</label>
          <input
            type="password"
            name="currentPassword"
            className="w-full px-3 py-2 border rounded focus:ring focus:ring-indigo-200"
            value={form.currentPassword}
            onChange={updateField}
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">New Password</label>
          <input
            type="password"
            name="newPassword"
            className="w-full px-3 py-2 border rounded focus:ring focus:ring-indigo-200"
            value={form.newPassword}
            onChange={updateField}
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            className="w-full px-3 py-2 border rounded focus:ring focus:ring-indigo-200"
            value={form.confirmPassword}
            onChange={updateField}
            required
          />
        </div>

        <button
          disabled={loading}
          className="w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-gray-400"
        >
          {loading ? "Updating..." : "Change Password"}
        </button>
      </form>
    </div>
  );
}
