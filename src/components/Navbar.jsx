"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import UserAvatar from "@/components/UserAvatar";
import { toast } from "react-toastify";
import { RiLogoutBoxLine, RiMenuLine, RiCloseLine } from "react-icons/ri";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "My Profile", href: "/profile", requiresAuth: true },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const visibleNavLinks = navLinks.filter((link) => !link.requiresAuth || session);
  const isActive = (href) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      const { error } = await authClient.signOut();
      if (error) {
        toast.error(error.message || "We could not log you out. Please try again.");
        return;
      }
      toast.success("Logged out successfully.");
      setIsMenuOpen(false);
      router.replace("/");
    } catch {
      toast.error("We could not reach the server. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const renderNavLinks = (mobile = false) => (
    <>
      {visibleNavLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={mobile ? () => setIsMenuOpen(false) : undefined}
          className={mobile
            ? `px-3 py-2 rounded-lg text-sm transition ${isActive(link.href) ? "bg-orange-100 text-orange-600 font-medium" : "text-gray-700 hover:bg-orange-50"}`
            : `relative text-sm font-medium transition-colors ${isActive(link.href) ? "text-orange-600" : "text-gray-600 hover:text-orange-500"}`}
        >
          {link.label}
          {!mobile && isActive(link.href) && (
            <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-orange-500 rounded-full" />
          )}
        </Link>
      ))}
    </>
  );

  const renderAuthControls = (mobile = false) => {
    if (isPending) {
      return <span className="text-sm text-gray-400" aria-live="polite">Loading...</span>;
    }

    if (session) {
      return (
        <>
          <Link href="/profile" onClick={mobile ? () => setIsMenuOpen(false) : undefined} className={mobile ? "flex items-center gap-3" : ""}>
            <UserAvatar
              name={session.user?.name}
              image={session.user?.image}
              className={mobile ? "w-10 h-10" : "w-9 h-9 cursor-pointer ring-2 ring-orange-100"}
            />
            {mobile && <span className="text-sm font-medium">{session.user?.name || "Account"}</span>}
          </Link>
          {!mobile && <span className="text-sm text-gray-700 font-medium">{session.user?.name || "Account"}</span>}
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={mobile
              ? "w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition disabled:opacity-60 disabled:cursor-not-allowed"
              : "flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition disabled:opacity-60 disabled:cursor-not-allowed"}
          >
            <RiLogoutBoxLine aria-hidden="true" />
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </>
      );
    }

    return (
      <>
        <Link href="/login" onClick={mobile ? () => setIsMenuOpen(false) : undefined} className={mobile ? "text-center py-2.5 rounded-xl border border-orange-200 text-orange-500" : "text-sm text-gray-600 hover:text-orange-500"}>
          Login
        </Link>
        <Link href="/register" onClick={mobile ? () => setIsMenuOpen(false) : undefined} className={mobile ? "text-center py-2.5 rounded-xl bg-orange-500 text-white font-medium" : "px-4 py-2 rounded-full bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition"}>
          Register
        </Link>
      </>
    );
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-orange-100" aria-label="Primary navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-extrabold tracking-tight bg-linear-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
          SunCart
        </Link>

        <div className="hidden md:flex items-center gap-6">{renderNavLinks()}</div>
        <div className="hidden md:flex items-center gap-3">{renderAuthControls()}</div>

        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          className="md:hidden text-2xl text-gray-700"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
        >
          {isMenuOpen ? <RiCloseLine aria-hidden="true" /> : <RiMenuLine aria-hidden="true" />}
        </button>
      </div>

      <div id="mobile-navigation" className={`md:hidden overflow-hidden transition-all duration-300 ${isMenuOpen ? "max-h-125" : "max-h-0"}`}>
        <div className="mx-4 my-3 rounded-2xl border border-orange-100 bg-white shadow-sm p-4 space-y-3">
          <div className="flex flex-col gap-2">{renderNavLinks(true)}</div>
          <div className="border-t pt-3 flex flex-col gap-3">{renderAuthControls(true)}</div>
        </div>
      </div>
    </nav>
  );
}
