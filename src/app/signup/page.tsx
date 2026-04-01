"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    leetcodeUsername: "",
    notifyMail: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [debouncedUsername, setDebouncedUsername] = useState("");
  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");

  // Debounce username
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedUsername(formData.leetcodeUsername.trim().toLowerCase());
    }, 500);
    return () => clearTimeout(timer);
  }, [formData.leetcodeUsername]);

  // Check username availability
  useEffect(() => {
    if (!debouncedUsername) {
      setUsernameStatus("idle");
      return;
    }

    const checkUsername = async () => {
      try {
        setUsernameStatus("checking");
        const res = await axios.get("/api/check-username-unique", {
          params: { leetcodeUsername: debouncedUsername },
        });
        if (res.data.success) {
          setUsernameStatus("available");
        } else {
          setUsernameStatus("taken");
        }
      } catch {
        setUsernameStatus("idle");
      }
    };

    checkUsername();
  }, [debouncedUsername]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.email) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Email is invalid";

    if (!formData.password) errors.password = "Password is required";
    else if (formData.password.length < 6) errors.password = "Password must be at least 6 characters";

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (!formData.leetcodeUsername) errors.leetcodeUsername = "LeetCode username is required";
    else if (!/^[a-zA-Z0-9_]+$/.test(formData.leetcodeUsername)) {
      errors.leetcodeUsername = "Only letters, numbers, and underscores allowed";
    }
    else if (usernameStatus !== "available") {
      errors.leetcodeUsername = "Username not available";
    }

    if (formData.notifyMail && !/\S+@\S+\.\S+/.test(formData.notifyMail)) {
      errors.notifyMail = "Invalid email address";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await axios.post("/api/auth/signup", {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        leetcodeUsername: formData.leetcodeUsername,
        notifyMail: formData.notifyMail || formData.email,
      });

      if (response.data.success) {
        router.push("/login?registered=true");
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
        <div className="text-center">
          <div className="text-5xl mb-4">🚀</div>
          <h2 className="text-3xl font-extrabold text-gray-900">Create Account</h2>
          <p className="mt-2 text-gray-600">Start tracking your LeetCode journey</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${fieldErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition`}
                placeholder="you@example.com"
              />
              {fieldErrors.email && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${fieldErrors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition pr-10`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">Minimum 6 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password *
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${fieldErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition`}
                placeholder="••••••••"
              />
              {fieldErrors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.confirmPassword}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                LeetCode Username *
              </label>
              <input
                type="text"
                name="leetcodeUsername"
                value={formData.leetcodeUsername}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${
                  usernameStatus === "available" ? 'border-green-500' : 
                  usernameStatus === "taken" ? 'border-red-500' : 
                  fieldErrors.leetcodeUsername ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition`}
                placeholder="your_leetcode_username"
              />
              {usernameStatus === "checking" && (
                <p className="mt-1 text-xs text-blue-500">Checking availability...</p>
              )}
              {usernameStatus === "available" && (
                <p className="mt-1 text-xs text-green-500">✓ Username available</p>
              )}
              {usernameStatus === "taken" && (
                <p className="mt-1 text-xs text-red-500">✗ Username already taken</p>
              )}
              {fieldErrors.leetcodeUsername && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.leetcodeUsername}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notification Email
              </label>
              <input
                type="email"
                name="notifyMail"
                value={formData.notifyMail}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${fieldErrors.notifyMail ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition`}
                placeholder="notifications@example.com"
              />
              {fieldErrors.notifyMail && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.notifyMail}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">Weekly reports will be sent here (optional)</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-blue-600 transition disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}