"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { getSafeRedirect } from "@/lib/validation";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = getSafeRedirect(searchParams.get("redirect"));
  const googleAuthEnabled = process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === "true";

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function checkAuth() {
      try {
        const session = await authClient.getSession();
        if (mounted && session.data?.user) router.replace(redirect);
      } catch {
        // A failed session check should not prevent a user from signing in.
      } finally {
        if (mounted) setChecking(false);
      }
    }

    checkAuth();
    return () => {
      mounted = false;
    };
  }, [router, redirect]);

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
    setError("");
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    if (loading || googleLoading) return;

    setLoading(true);
    setError("");

    try {
      const { error: signInError } = await authClient.signIn.email({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      if (signInError) {
        setError(signInError.message || "Invalid email or password. Please try again.");
        return;
      }

      toast.success("Login successful! Welcome back.");
      router.replace(redirect);
    } catch {
      setError("We could not reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (loading || googleLoading) return;

    setGoogleLoading(true);
    setError("");
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: redirect,
      });
    } catch {
      setError("Google sign-in is unavailable right now. Please try again.");
      setGoogleLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="flex-1 flex items-center justify-center" aria-live="polite">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-spin" aria-hidden="true">☀️</div>
          <p className="text-gray-500 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <span className="text-4xl" aria-hidden="true">☀️</span>
          <h1 className="text-3xl font-extrabold text-gray-800 mt-2">Welcome Back!</h1>
          <p className="text-gray-500 mt-1 text-sm">Login to your SunCart account</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-5" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="login-email" className="text-sm font-semibold text-gray-700">Email</label>
            <input
              id="login-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
              required
              className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="login-password" className="text-sm font-semibold text-gray-700">Password</label>
            <input
              id="login-password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              autoComplete="current-password"
              required
              className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full bg-linear-to-r from-orange-400 to-yellow-400 text-white font-bold py-3 rounded-lg hover:from-orange-500 hover:to-yellow-500 transition-all mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {googleAuthEnabled && (
          <>
            <div className="flex items-center gap-3 my-5" aria-hidden="true">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-gray-400 text-sm">or</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading || googleLoading}
              className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-3 hover:bg-gray-50 transition-all font-semibold text-gray-700 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <FcGoogle aria-hidden="true" />
              {googleLoading ? "Connecting..." : "Continue with Google"}
            </button>
          </>
        )}

        <p className="text-center text-sm text-gray-500 mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-orange-500 font-semibold hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
}
