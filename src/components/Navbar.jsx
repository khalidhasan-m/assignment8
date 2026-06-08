"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import { RiLogoutBoxLine, RiMenuLine, RiCloseLine } from "react-icons/ri";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "My Profile", href: "/profile" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const { data: session } = authClient.useSession();

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const handleLogout = async () => {
    await authClient.signOut();
    toast.success("Logged out successfully!");
    router.push("/");
    setIsMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-orange-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-extrabold tracking-tight bg-linear-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent"
        >
          SunCart
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6 relative">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? "text-orange-600"
                  : "text-gray-600 hover:text-orange-500"
              }`}
            >
              {link.label}

              {/* active underline */}
              {isActive(link.href) && (
                <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-orange-500 rounded-full" />
              )}
            </Link>
          ))}
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <>
              <Link href="/profile">
                <Avatar className="w-9 h-9 cursor-pointer ring-2 ring-orange-100">
                  <AvatarImage
                    src={session.user?.image || ""}
                    alt={session.user?.name || "User"}
                  />
                  <AvatarFallback>
                    {session.user?.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </Link>

              <span className="text-sm text-gray-700 font-medium">
                {session.user?.name}
              </span>

              <Link
                onClick={handleLogout}
                href="/"
                className="flex items-center px-4 py-2 rounded-full bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition"
              >
                <RiLogoutBoxLine />
                Logout
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-gray-600 hover:text-orange-500"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="px-4 py-2 rounded-full bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-2xl text-gray-700"
        >
          {isMenuOpen ? <RiCloseLine /> : <RiMenuLine />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          isMenuOpen ? "max-h-125" : "max-h-0"
        }`}
      >
        <div className="mx-4 my-3 rounded-2xl border border-orange-100 bg-white shadow-sm p-4 space-y-3">
          {/* Links */}
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`px-3 py-2 rounded-lg text-sm transition ${
                  isActive(link.href)
                    ? "bg-orange-100 text-orange-600 font-medium"
                    : "text-gray-700 hover:bg-orange-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth */}
          <div className="border-t pt-3">
            {session ? (
              <div className="space-y-3">
                <Link
                  href="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3"
                >
                  <Avatar className="w-10 h-10">
                    <AvatarImage
                      src={session.user?.image || ""}
                      alt={session.user?.name || "User"}
                    />
                    <AvatarFallback>
                      {session.user?.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>

                  <span className="text-sm font-medium">
                    {session.user?.name}
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition"
                >
                  <RiLogoutBoxLine />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-center py-2.5 rounded-xl border border-orange-200 text-orange-500"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-center py-2.5 rounded-xl bg-orange-500 text-white font-medium"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
