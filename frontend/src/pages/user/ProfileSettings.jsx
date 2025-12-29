// src/pages/user/ProfileSettings.jsx
import { useState } from "react";
import api from "../../api/axios";
import useAuth from "../../hooks/useAuth";

export default function ProfileSettings() {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, type: "", msg: "" });

  const notify = (type, msg) => {
    setToast({ show: true, type, msg });
    setTimeout(() => setToast({ show: false }), 2000);
  };

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isFormValid =
    name.trim().length >= 3 &&
    isValidEmail(email) &&
    (name !== user?.name || email !== user?.email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setLoading(true);
    try {
      const res = await api.put("/users/update-profile", { name, email });
      notify("success", "Profile updated!");
      updateUser(res.data.user);
    } catch (err) {
      notify("error", err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Profile Settings</h2>

      {toast.show && (
        <div
          className={`mb-4 px-4 py-3 rounded-lg text-white shadow-lg ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.msg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            className="w-full px-3 py-2 border rounded-xl"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {name.trim().length < 3 && (
            <p className="text-red-600 text-sm mt-1">
              Name must be at least 3 characters
            </p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            className="w-full px-3 py-2 border rounded-xl"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {!isValidEmail(email) && (
            <p className="text-red-600 text-sm mt-1">Enter a valid email</p>
          )}
        </div>

        <button
          type="submit"
          disabled={!isFormValid || loading}
          className={`w-full py-3 rounded-xl text-white font-semibold transition ${
            !isFormValid
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
