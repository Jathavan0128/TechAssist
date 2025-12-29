
import { useState, useContext } from "react";
import {
  EyeIcon,
  EyeSlashIcon,
  AtSymbolIcon,
  UserIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { AuthContext } from "../../context/AuthContext";

export default function RegisterForm() {
  const { register } = useContext(AuthContext);

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPass, setShowPass] = useState(false);

  // Validation + UI
  const [emailValid, setEmailValid] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [toast, setToast] = useState({ show: false, type: "", msg: "" });

  // Email validation helper
  const validateEmail = (email) => {
    const valid = /\S+@\S+\.\S+/.test(email);
    setEmailValid(valid || email.length === 0);
  };

  // Password strength meter
  const checkStrength = (pwd) => {
    if (!pwd) return setPasswordStrength("");

    if (pwd.length < 6) return setPasswordStrength("Weak");
    if (!/[A-Z]/.test(pwd) || !/[0-9]/.test(pwd))
      return setPasswordStrength("Medium");

    return setPasswordStrength("Strong");
  };

  // Display toast message
  const showToast = (type, msg) => {
    setToast({ show: true, type, msg });
    setTimeout(() => setToast({ show: false }), 2000);
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await register(form);
      showToast("success", "Account created!");
    } catch (err) {
      showToast("error", err?.message || "Registration failed.");
    }
  };

  return (
    <div>
      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`mb-4 px-4 py-2 rounded-lg text-white shadow-lg animate-slide-in ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.msg}
        </div>
      )}

      <h2 className="text-center text-3xl font-semibold text-gray-900 dark:text-white mb-6">
        Create Account
      </h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Name */}
        <div className="relative">
          <UserIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="w-full pl-10 pr-4 py-3 border rounded-xl bg-gray-50
                       focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Email */}
        <div className="relative">
          <AtSymbolIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3" />

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => {
              setForm({ ...form, email: e.target.value });
              validateEmail(e.target.value);
            }}
            required
            className={`w-full pl-10 pr-4 py-3 border rounded-xl bg-gray-50
              focus:ring-1 ${
                emailValid
                  ? "focus:border-blue-500"
                  : "border-red-500 focus:border-red-500"
              }`}
          />
        </div>

        {!emailValid && (
          <p className="text-red-500 text-sm -mt-3">Invalid email format</p>
        )}

        {/* Password */}
        <div className="relative">
          <LockClosedIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3" />

          <input
            type={showPass ? "text" : "password"}
            placeholder="Password"
            value={form.password}
            onChange={(e) => {
              setForm({ ...form, password: e.target.value });
              checkStrength(e.target.value);
            }}
            required
            className="w-full pl-10 pr-12 py-3 border rounded-xl bg-gray-50
                       focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />

          {/* Toggle visibility */}
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3 top-3 text-gray-500"
          >
            {showPass ? (
              <EyeSlashIcon className="w-5 h-5" />
            ) : (
              <EyeIcon className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Strength Meter */}
        {passwordStrength && (
          <p
            className={`text-sm ${
              passwordStrength === "Weak"
                ? "text-red-500"
                : passwordStrength === "Medium"
                ? "text-yellow-600"
                : "text-green-600"
            }`}
          >
            {passwordStrength}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl
                     hover:bg-blue-700 transition shadow-md"
        >
          Create Account
        </button>

        {/* To Login */}
        <p className="text-center text-gray-600 dark:text-gray-300 text-sm">
          Already have an account?{" "}
          <a className="text-blue-600 hover:underline" href="/login">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
