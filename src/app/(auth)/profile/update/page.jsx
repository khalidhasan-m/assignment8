"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import UserAvatar from "@/components/UserAvatar";
import { isValidHttpUrl } from "@/lib/validation";

export default function UpdateProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [draft, setDraft] = useState({ name: null, image: null });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const formData = {
    name: draft.name ?? session?.user?.name ?? "",
    image: draft.image ?? session?.user?.image ?? "",
  };

  useEffect(() => {
    if (!isPending && !session) router.replace("/login?redirect=%2Fprofile%2Fupdate");
  }, [session, isPending, router]);

  useEffect(() => {
    if (!success) return undefined;
    const timer = window.setTimeout(() => router.replace("/profile"), 1200);
    return () => window.clearTimeout(timer);
  }, [success, router]);

  const handleChange = (event) => {
    setDraft((current) => ({ ...current, [event.target.name]: event.target.value }));
    setError("");
    setSuccess(false);
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    if (loading || success) return;

    const name = formData.name.trim();
    const image = formData.image.trim();

    if (name.length < 2) {
      setError("Please enter your full name.");
      return;
    }
    if (image && !isValidHttpUrl(image)) {
      setError("Photo URL must start with http:// or https://.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const { error: updateError } = await authClient.updateUser({
        name,
        image: image || null,
      });

      if (updateError) {
        setError(updateError.message || "Something went wrong. Please try again.");
        return;
      }

      setSuccess(true);
    } catch {
      setError("We could not reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]" aria-live="polite">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-spin" aria-hidden="true">☀️</div>
          <p className="text-gray-500 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <div className="flex items-center justify-center min-h-[60vh] text-gray-500" aria-live="polite">Redirecting to login...</div>;
  }

  return (
    <main className="max-w-lg mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-orange-500">📝 Update Profile</h1>
        <p className="text-gray-400 mt-2 text-sm">Update your name and profile photo</p>
      </div>

      <div className="bg-white rounded-3xl shadow-lg p-8">
        <div className="flex justify-center mb-6">
          <UserAvatar name={formData.name || session.user.name} image={formData.image} className="w-20 h-20 border-4 border-orange-300 shadow text-3xl" />
        </div>

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-3 rounded-lg mb-5 text-center" role="status">Profile updated. Redirecting...</div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-5" role="alert">{error}</div>
        )}

        <form onSubmit={handleUpdate} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <label htmlFor="profile-name" className="text-sm font-semibold text-gray-700">Full Name</label>
            <input
              id="profile-name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              autoComplete="name"
              minLength={2}
              maxLength={100}
              required
              className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="profile-image" className="text-sm font-semibold text-gray-700">Photo URL</label>
            <input
              id="profile-image"
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/photo.jpg"
              autoComplete="url"
              className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
            />
            <p className="text-xs text-gray-400">Paste a direct image URL to update your photo.</p>
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="w-full bg-linear-to-r from-orange-400 to-yellow-400 text-white font-bold py-3 rounded-xl hover:from-orange-500 hover:to-yellow-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer mt-2"
          >
            {loading ? "Updating..." : "Update Information"}
          </button>
        </form>

        <div className="text-center mt-5">
          <Link href="/profile" className="text-sm text-gray-400 hover:text-orange-400 transition-colors">← Back to Profile</Link>
        </div>
      </div>
    </main>
  );
}
