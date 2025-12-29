import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function FormInput({
  id,
  label,
  type = "text",
  icon: Icon,
  value,
  onChange,
  required = false,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div className="relative w-full">
      {/* Icon */}
      {Icon && (
        <Icon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
      )}

      {/* Input */}
      <input
        id={id}
        type={inputType}
        value={value}
        onChange={onChange}
        placeholder=" "
        required={required}
        className={`peer w-full px-10 py-3 border border-gray-300 rounded-xl 
          focus:border-blue-500 focus:ring-2 focus:ring-blue-400 outline-none
          transition-all`}
      />

      {/* Toggle password */}
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
        >
          {showPassword ? (
            <EyeSlashIcon className="w-5 h-5" />
          ) : (
            <EyeIcon className="w-5 h-5" />
          )}
        </button>
      )}

      {/* Floating label */}
      <label
        htmlFor={id}
        className="absolute left-10 top-3 text-gray-500 transition-all 
          peer-placeholder-shown:top-3 peer-placeholder-shown:text-base
          peer-focus:-top-3 peer-focus:text-sm peer-focus:text-blue-600
          bg-white px-1 pointer-events-none"
      >
        {label}
      </label>
    </div>
  );
}
