"use client";

import { Button } from "@heroui/react/button";
import { Avatar } from "@heroui/react/avatar";
import { Dropdown } from "@heroui/react/dropdown";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "My Profile", href: "/profile" },
];

export default function AppNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = authClient.useSession();

  const handleLogout = async () => {
    await authClient.signOut();
    setIsMenuOpen(false);
  };

  return (
    <nav className="w-full bg-linear-to-r from-orange-400 to-yellow-400 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* LEFT — Logo */}
        <Link href="/" className="flex items-center gap-1">
          <span className="text-2xl">☀️</span>
          <span className="text-xl font-extrabold text-white tracking-wide">
            SunCart
          </span>
        </Link>

        {/* MIDDLE — Desktop Links */}
        <div className="hidden sm:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-semibold transition-all duration-200 px-3 py-1.5 rounded-lg ${
                pathname === link.href
                  ? "text-orange-600 bg-white/40"
                  : "text-white hover:text-orange-600 hover:bg-white/20"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* RIGHT — Auth + Hamburger */}
        <div className="flex items-center gap-3">
          {/* Desktop Auth */}
          <div className="hidden sm:flex items-center gap-2">
            {session ? (
              <div className="flex items-center gap-3">
                <Avatar
                  src={session.user?.image || ""}
                  name={session.user?.name || "User"}
                  size="sm"
                  className="cursor-pointer"
                />
                <button
                  onClick={handleLogout}
                  className="text-sm font-semibold text-white bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-all"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <button className="text-sm font-semibold text-white bg-white/20 hover:bg-white/30 px-4 py-1.5 rounded-lg transition-all">
                    Login
                  </button>
                </Link>
                <Link href="/register">
                  <button className="text-sm font-bold text-orange-500 bg-white hover:bg-orange-50 px-4 py-1.5 rounded-lg transition-all">
                    Register
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Hamburger Button — Mobile Only */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="sm:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-white/20 transition-all"
            aria-label="Toggle menu"
          >
            <span
              className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? "rotate-45 translate-y-2" : ""}`}
            />
            <span
              className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`sm:hidden overflow-hidden transition-all duration-300 ${isMenuOpen ? "max-h-96" : "max-h-0"}`}
      >
        <div className="bg-orange-50 px-4 py-4 flex flex-col gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className={`text-lg font-semibold py-2 px-3 rounded-lg transition-colors ${
                pathname === link.href
                  ? "text-orange-500 bg-orange-100"
                  : "text-gray-700 hover:text-orange-500 hover:bg-orange-100"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Mobile Auth */}
          <div className="mt-2 flex flex-col gap-2 border-t border-orange-200 pt-3">
            {session ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar
                    src={session.user?.image || ""}
                    name={session.user?.name || "User"}
                    size="sm"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {session.user?.name}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-sm font-semibold text-red-500 hover:text-red-600"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-center py-2.5 rounded-lg bg-orange-400 text-white font-bold hover:bg-orange-500 transition-all"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-center py-2.5 rounded-lg border-2 border-orange-400 text-orange-500 font-bold hover:bg-orange-50 transition-all"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
