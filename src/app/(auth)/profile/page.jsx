"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import UserAvatar from "@/components/UserAvatar";

function formatMemberSince(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric" }).format(date);
}

export default function MyProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) router.replace("/login?redirect=%2Fprofile");
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]" aria-live="polite">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-spin" aria-hidden="true">☀️</div>
          <p className="text-gray-500 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <div className="flex items-center justify-center min-h-[60vh] text-gray-500" aria-live="polite">Redirecting to login...</div>;
  }

  const user = session.user;

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-orange-500">👤 My Profile</h1>
        <p className="text-gray-400 mt-2 text-sm">Your SunCart account details</p>
      </div>

      <article className="bg-white rounded-3xl shadow-lg overflow-hidden">
        <div className="bg-linear-to-r from-orange-400 to-yellow-400 h-32 relative">
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
            <UserAvatar name={user.name} image={user.image} className="w-24 h-24 border-4 border-white shadow-lg text-4xl" />
          </div>
        </div>

        <div className="pt-16 pb-8 px-8 flex flex-col items-center gap-6">
          <div className="text-center">
            <h2 className="text-2xl font-extrabold text-gray-800">{user.name || "SunCart Member"}</h2>
            <p className="text-gray-400 text-sm mt-1">SunCart Member ☀️</p>
          </div>

          <div className="w-full flex flex-col gap-3">
            <div className="flex items-center gap-4 bg-orange-50 rounded-xl px-5 py-4">
              <span className="text-2xl" aria-hidden="true">📧</span>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Email</p>
                <p className="text-gray-700 font-semibold break-all">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-orange-50 rounded-xl px-5 py-4">
              <span className="text-2xl" aria-hidden="true">👤</span>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Full Name</p>
                <p className="text-gray-700 font-semibold">{user.name || "—"}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-orange-50 rounded-xl px-5 py-4">
              <span className="text-2xl" aria-hidden="true">📅</span>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Member Since</p>
                <p className="text-gray-700 font-semibold">{formatMemberSince(user.createdAt)}</p>
              </div>
            </div>
          </div>

          <Link href="/profile/update" className="w-full text-center bg-linear-to-r from-orange-400 to-yellow-400 text-white font-bold py-3 rounded-xl hover:from-orange-500 hover:to-yellow-500 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2">
            📝 Update Information
          </Link>
          <Link href="/" className="text-sm text-gray-400 hover:text-orange-400 transition-colors">← Back to Home</Link>
        </div>
      </article>
    </main>
  );
}
