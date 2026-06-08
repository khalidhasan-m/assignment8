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
          <div className="text-5xl mb-4 animate-spin">⚡</div>
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
        <h1 className="text-4xl font-extrabold text-indigo-600">
          ✨ Update Profile
        </h1>
        <p className="text-gray-500 mt-2 text-sm font-medium">
          Edit your profile details and photo
        </p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-3xl shadow-lg p-8 border border-indigo-100">
        {/* Current Avatar Preview */}
        <div className="flex justify-center mb-6">
          {formData.image ? (
            <Image
              src={formData.image}
              alt="Preview"
              width={80}
              height={80}
              unoptimized
              className="w-20 h-20 rounded-full border-4 border-indigo-300 object-cover shadow"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className="w-20 h-20 rounded-full border-4 border-indigo-300 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center shadow">
              <span className="text-3xl font-extrabold text-indigo-600">
                {session.user.name?.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-300 text-green-700 text-sm px-4 py-3 rounded-lg mb-5 text-center font-medium">
            ✅ Profile updated successfully! Redirecting...
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-300 text-red-700 text-sm px-4 py-3 rounded-lg mb-5 font-medium">
            ❌ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleUpdate} className="flex flex-col gap-5">
          {/* Name */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              👤 Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
            />
          </div>

          {/* Image URL */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              📸 Photo URL
            </label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/photo.jpg"
              className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
            />
            <p className="text-xs text-gray-500 font-medium">
              Paste a direct image URL. Updates appear above.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || success}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {loading ? "⏳ Updating..." : "💾 Save Changes"}
          </button>
        </form>

        {/* Back Link */}
        <div className="text-center mt-5">
          <Link
            href="/profile"
            className="text-sm text-gray-400 hover:text-indigo-600 transition-colors font-medium"
          >
            ↤ Back to Profile
          </Link>
        </div>
      </div>
    </main>
  );
}
