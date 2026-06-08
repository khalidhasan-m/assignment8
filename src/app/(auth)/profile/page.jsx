"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function MyProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  // ── Protect Route ──
  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  // ── Loading ──
  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-spin">⚡</div>
          <p className="text-gray-500 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  const user = session.user;

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">

      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-indigo-600">
          🎯 My Profile
        </h1>
        <p className="text-gray-500 mt-2 text-sm font-medium">
          Manage your account information
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-indigo-100">

        {/* Top Banner */}
        <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 h-32 relative">
          {/* Avatar */}
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name}
                width={96}
                height={96}
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-indigo-200 to-purple-200 flex items-center justify-center">
                <span className="text-4xl font-extrabold text-indigo-600">
                  {user.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* User Info */}
        <div className="pt-16 pb-8 px-8 flex flex-col items-center gap-6">

          {/* Name */}
          <div className="text-center">
            <h2 className="text-2xl font-extrabold text-gray-900">
              {user.name}
            </h2>
            <p className="text-gray-500 text-sm mt-1">Premium Member ⭐</p>
          </div>

          {/* Info Cards */}
          <div className="w-full flex flex-col gap-3">

            {/* Email */}
            <div className="flex items-center gap-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl px-5 py-4 border border-indigo-100">
              <span className="text-2xl">✉️</span>
              <div className="flex-1">
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                  Email Address
                </p>
                <p className="text-gray-800 font-semibold mt-1">{user.email}</p>
              </div>
            </div>

            {/* Name */}
            <div className="flex items-center gap-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl px-5 py-4 border border-purple-100">
              <span className="text-2xl">👤</span>
              <div className="flex-1">
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                  Full Name
                </p>
                <p className="text-gray-800 font-semibold mt-1">{user.name}</p>
              </div>
            </div>

            {/* Account Created */}
            <div className="flex items-center gap-4 bg-gradient-to-r from-pink-50 to-indigo-50 rounded-xl px-5 py-4 border border-pink-100">
              <span className="text-2xl">📆</span>
              <div className="flex-1">
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                  Joined On
                </p>
                <p className="text-gray-800 font-semibold mt-1">
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Update Button */}
          <Link href="/profile/update" className="w-full">
            <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg">
              ✏️ Edit Profile
            </button>
          </Link>

          {/* Back to Home */}
          <Link href="/" className="text-sm text-gray-400 hover:text-indigo-600 transition-colors font-medium">
            ↤ Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
