"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { isValidHttpUrl } from "@/lib/validation";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    photoUrl: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const googleAuthEnabled = process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === "true";

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
    setError("");
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    if (loading || googleLoading) return;

    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    const photoUrl = formData.photoUrl.trim();

    if (name.length < 2) {
      setError("Please enter your full name.");
      return;
    }
    if (photoUrl && !isValidHttpUrl(photoUrl)) {
      setError("Photo URL must start with http:// or https://.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { error: signUpError } = await authClient.signUp.email({
        name,
        email,
        password: formData.password,
        ...(photoUrl ? { image: photoUrl } : {}),
      });

      if (signUpError) {
        setError(signUpError.message || "Something went wrong. Please try again.");
        return;
      }

      await authClient.signOut();
      toast.success("Registration successful. Please log in.");
      router.replace("/login");
    } catch {
      setError("We could not reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    if (loading || googleLoading) return;

    setGoogleLoading(true);
    setError("");
    try {
      await authClient.signIn.social({ provider: "google", callbackURL: "/" });
    } catch {
      setError("Google sign-up is unavailable right now. Please try again.");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <span className="text-4xl" aria-hidden="true">🌴</span>
          <h1 className="text-3xl font-extrabold text-gray-800 mt-2">Create Account</h1>
          <p className="text-gray-500 mt-1 text-sm">Join SunCart and enjoy summer deals!</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-5" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="register-name" className="text-sm font-semibold text-gray-700">Full Name</label>
            <input
              id="register-name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              autoComplete="name"
              minLength={2}
              maxLength={100}
              required
              className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="register-email" className="text-sm font-semibold text-gray-700">Email</label>
            <input
              id="register-email"
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
            <label htmlFor="register-photo" className="text-sm font-semibold text-gray-700">
              Photo URL <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              id="register-photo"
              type="url"
              name="photoUrl"
              value={formData.photoUrl}
              onChange={handleChange}
              placeholder="https://example.com/photo.jpg"
              autoComplete="url"
              className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="register-password" className="text-sm font-semibold text-gray-700">Password</label>
            <input
              id="register-password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              autoComplete="new-password"
              minLength={8}
              maxLength={128}
              required
              className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
            />
            <p className="text-xs text-gray-400 mt-0.5">Minimum 8 characters</p>
          </div>

          <button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full bg-linear-to-r from-orange-400 to-yellow-400 text-white font-bold py-3 rounded-lg hover:from-orange-500 hover:to-yellow-500 transition-all mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Register"}
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
              onClick={handleGoogleSignup}
              disabled={loading || googleLoading}
              className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-3 hover:bg-gray-50 transition-all font-semibold text-gray-700 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <FcGoogle aria-hidden="true" />
              {googleLoading ? "Connecting..." : "Continue with Google"}
            </button>
          </>
        )}

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-orange-500 font-semibold hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
}
