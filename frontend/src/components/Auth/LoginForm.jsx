import { useState, useContext } from "react";
import {
  EyeIcon,
  EyeSlashIcon,
  AtSymbolIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function LoginForm() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);

  const [loading, setLoading] = useState(false);
  const [strength, setStrength] = useState({ label: "", color: "" });

  const [toast, setToast] = useState({ show: false, type: "", msg: "" });

  const notify = (type, msg) => {
    setToast({ show: true, type, msg });
    setTimeout(() => setToast({ show: false }), 1800);
  };


  const checkStrength = (pass) => {
    let score = 0;

    if (pass.length > 5) score++;
    if (pass.length > 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    switch (score) {
      case 0:
      case 1:
        return { label: "Weak", color: "bg-red-500" };
      case 2:
        return { label: "Medium", color: "bg-yellow-500" };
      case 3:
        return { label: "Strong", color: "bg-green-500" };
      case 4:
      case 5:
        return { label: "Very Strong", color: "bg-blue-600" };
      default:
        return { label: "", color: "" };
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await login(email, password, remember);

      if (import.meta.env.DEV) {
        console.log("Logged-in User:", user);
        console.log("LocalStorage:", localStorage.getItem("user"));
      }

      notify("success", "Welcome back!");

      setTimeout(() => {
        navigate("/dashboard");
      }, 500);

    } catch (err) {
      notify("error", err?.message || "Login failed");
      console.error("Login Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`mb-4 px-4 py-3 rounded-lg text-white shadow-lg transition-all ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* Title */}
      <h2 className="text-center text-3xl font-semibold text-gray-900 dark:text-white mb-6">
        Login
      </h2>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* EMAIL FIELD */}
        <div className="relative">
          <AtSymbolIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            className="w-full pl-10 pr-4 py-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none transition"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* PASSWORD FIELD */}
        <div className="relative">
          <LockClosedIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
          <input
            type={showPass ? "text" : "password"}
            placeholder="Password"
            required
            value={password}
            className="w-full pl-10 pr-12 py-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none transition"
            onChange={(e) => {
              setPassword(e.target.value);
              setStrength(checkStrength(e.target.value));
            }}
          />

          {/* TOGGLE PASSWORD VISIBILITY */}
          <button
            type="button"
            className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 transition"
            onClick={() => setShowPass(!showPass)}
          >
            {showPass ? (
              <EyeSlashIcon className="w-5 h-5" />
            ) : (
              <EyeIcon className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* PASSWORD STRENGTH METER */}
        {password && (
          <div className="mt-1">
            <div className="flex justify-between mb-1 text-sm">
              <span className="text-gray-600">{strength.label}</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div className={`h-2 rounded-full transition-all ${strength.color}`} style={{
                width:
                  strength.label === "Weak" ? "25%" :
                  strength.label === "Medium" ? "50%" :
                  strength.label === "Strong" ? "75%" :
                  "100%"
              }}></div>
            </div>
          </div>
        )}

        {/* REMEMBER + FORGOT PASSWORD */}
        <div className="flex justify-between items-center">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={remember}
              onChange={() => setRemember(!remember)}
              className="w-4 h-4 accent-blue-600"
            />
            Remember Me
          </label>

          <Link
            to="/forgot-password"
            className="text-sm text-blue-600 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-xl text-white font-semibold transition
            ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
        >
          {loading ? (
            <span className="flex justify-center items-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Logging in...
            </span>
          ) : (
            "Login"
          )}
        </button>

      </form>
    </div>
  );
}
