"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";

export default function UpdateProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [formData, setFormData] = useState({ name: "", image: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // ── Protect Route ──
  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
    if (session) {
      setFormData({
        name: session.user.name ?? "",
        image: session.user.image ?? "",
      });
    }
  }, [session, isPending, router]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess(false);
  };

  // ── Update Handler ──
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const { error } = await authClient.updateUser({
      name: formData.name,
      image: formData.image,
    });

    setLoading(false);

    if (error) {
      setError(error.message || "Something went wrong. Please try again.");
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push("/profile"), 1500);
  };

  // ── Loading ──
  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-spin">☀️</div>
          <p className="text-gray-500 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <main className="max-w-lg mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-orange-500">
          ✏️ Update Profile
        </h1>
        <p className="text-gray-400 mt-2 text-sm">
          Update your name and profile photo
        </p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-3xl shadow-lg p-8">
        {/* Current Avatar Preview */}
        <div className="flex justify-center mb-6">
          {formData.image ? (
            <Image
              src={formData.image}
              alt="Preview"
              width={80}
              height={80}
              unoptimized
              className="w-20 h-20 rounded-full border-4 border-orange-300 object-cover shadow"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className="w-20 h-20 rounded-full border-4 border-orange-300 bg-orange-100 flex items-center justify-center shadow">
              <span className="text-3xl font-extrabold text-orange-400">
                {session.user.name?.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-3 rounded-lg mb-5 text-center">
            ✅ Profile updated! Redirecting...
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-5">
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleUpdate} className="flex flex-col gap-5">
          {/* Name */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              required
              className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
            />
          </div>

          {/* Image URL */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">
              Photo URL
            </label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/photo.jpg"
              className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
            />
            <p className="text-xs text-gray-400">
              Paste a direct image URL to update your photo
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || success}
            className="w-full bg-linear-to-r from-orange-400 to-yellow-400 text-white font-bold py-3 rounded-xl hover:from-orange-500 hover:to-yellow-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {loading ? "Updating..." : "Update Information"}
          </button>
        </form>

        {/* Back Link */}
        <div className="text-center mt-5">
          <Link
            href="/profile"
            className="text-sm text-gray-400 hover:text-orange-400 transition-colors"
          >
            ← Back to Profile
          </Link>
        </div>
      </div>
    </main>
  );
}
