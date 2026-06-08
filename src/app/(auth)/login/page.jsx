"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const session = await authClient.getSession();
      if (session.data?.user) {
        router.push(redirect);
      }
      setChecking(false);
    };
    checkAuth();
  }, [router, redirect]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error } = await authClient.signIn.email({
      email: formData.email,
      password: formData.password,
    });

    setLoading(false);

    if (error) {
      setError(error.message || "Invalid email or password. Please try again.");
      return;
    }

    toast.success("Login successful! Welcome back 🌞");
    router.push(redirect);
  };

  const handleGoogleLogin = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: redirect,
    });
  };

  if (checking) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-spin">☀️</div>
          <p className="text-gray-500 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        {/* Title */}
        <div className="text-center mb-8">
          <span className="text-4xl">☀️</span>
          <h1 className="text-3xl font-extrabold text-gray-800 mt-2">
            Welcome Back!
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Login to your SunCart account
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-5">
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-linear-to-r from-orange-400 to-yellow-400 text-white font-bold py-3 rounded-lg hover:from-orange-500 hover:to-yellow-500 transition-all mt-2 disabled:opacity-60 cursor-pointer"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-gray-400 text-sm">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-3 hover:bg-gray-50 transition-all font-semibold text-gray-700 text-sm"
        >
          <FcGoogle />
          Continue with Google
        </button>

        {/* Register Link */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-orange-500 font-semibold hover:underline"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}