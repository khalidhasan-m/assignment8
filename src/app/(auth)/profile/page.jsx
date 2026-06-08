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
          <div className="text-5xl mb-4 animate-spin">☀️</div>
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
        <h1 className="text-4xl font-extrabold text-orange-500">
          👤 My Profile
        </h1>
        <p className="text-gray-400 mt-2 text-sm">
          Your SunCart account details
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden">

        {/* Top Banner */}
        <div className="bg-linear-to-r from-orange-400 to-yellow-400 h-32 relative">
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
              <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-orange-200 flex items-center justify-center">
                <span className="text-4xl font-extrabold text-orange-500">
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
            <h2 className="text-2xl font-extrabold text-gray-800">
              {user.name}
            </h2>
            <p className="text-gray-400 text-sm mt-1">SunCart Member ☀️</p>
          </div>

          {/* Info Cards */}
          <div className="w-full flex flex-col gap-3">

            {/* Email */}
            <div className="flex items-center gap-4 bg-orange-50 rounded-xl px-5 py-4">
              <span className="text-2xl">📧</span>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                  Email
                </p>
                <p className="text-gray-700 font-semibold">{user.email}</p>
              </div>
            </div>

            {/* Name */}
            <div className="flex items-center gap-4 bg-orange-50 rounded-xl px-5 py-4">
              <span className="text-2xl">👤</span>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                  Full Name
                </p>
                <p className="text-gray-700 font-semibold">{user.name}</p>
              </div>
            </div>

            {/* Account Created */}
            <div className="flex items-center gap-4 bg-orange-50 rounded-xl px-5 py-4">
              <span className="text-2xl">📅</span>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                  Member Since
                </p>
                <p className="text-gray-700 font-semibold">
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
            <button className="w-full bg-linear-to-r from-orange-400 to-yellow-400 text-white font-bold py-3 rounded-xl hover:from-orange-500 hover:to-yellow-500 transition-all">
              ✏️ Update Information
            </button>
          </Link>

          {/* Back to Home */}
          <Link href="/" className="text-sm text-gray-400 hover:text-orange-400 transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}