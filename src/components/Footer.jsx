"use client";

import Link from "next/link";
import { FaFacebookF, FaInstagram, FaXTwitter } from "react-icons/fa6";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "My Profile", href: "/profile" },
];

const socialLinks = [
  {
    label: "Facebook",
    href: "https://facebook.com/suncart",
    icon: <FaFacebookF />,
  },
  {
    label: "Instagram",
    href: "https://instagram.com/suncart",
    icon: <FaInstagram />,
  },
  {
    label: "Twitter",
    href: "https://twitter.com/suncart",
    icon: <FaXTwitter />,
  },
];

export default function Footer() {
  return (
    <footer className="backdrop-blur-xl bg-white/30 border-t border-white/20 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="flex flex-col gap-3">
          <Link href="/" className="flex items-center gap-1">
            <span className="text-3xl">☀️</span>
            <span className="text-2xl font-extrabold tracking-wide text-orange-500">
              SunCart
            </span>
          </Link>

          <p className="text-gray-600 text-sm leading-relaxed">
            Your one-stop summer essentials store. Stay cool, look hot, and
            enjoy the sun! 🌊
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-3">
          <h3 className="text-lg font-bold text-gray-800">Quick Links</h3>

          <ul className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-gray-600 hover:text-orange-500 text-sm transition"
                >
                  {link.label}
                </Link>
              </li>
            ))}

            <li>
              <Link
                href="/privacy-policy"
                className="text-gray-600 hover:text-orange-500 text-sm transition"
              >
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-3">
          <h3 className="text-lg font-bold text-gray-800">Contact Us</h3>

          <ul className="flex flex-col gap-2 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <span className="text-orange-500">📧</span>
              support@suncart.com
            </li>

            <li className="flex items-center gap-2">
              <span className="text-orange-500">📞</span>
              +1 (800) SUN-CART
            </li>

            <li className="flex items-center gap-2">
              <span className="text-orange-500">📍</span>
              Summer City, CA 90210
            </li>

            <li className="flex items-center gap-2">
              <span className="text-orange-500">🕐</span>
              Mon–Fri, 9am – 6pm
            </li>
          </ul>
        </div>

        {/* Social Links */}
        <div className="flex flex-col gap-3">
          <h3 className="text-lg font-bold text-gray-800">Follow Us</h3>

          <div className="flex gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="w-9 h-9 flex items-center justify-center rounded-full
                           bg-white/40 border border-white/30
                           text-orange-500
                           hover:bg-orange-500 hover:text-white
                           transition-all duration-200 backdrop-blur-md"
              >
                {social.icon}
              </a>
            ))}
          </div>

          <p className="text-gray-600 text-sm mt-2">
            Stay updated with our latest summer deals and collections!
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/20 bg-white/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-600">
          <p>
            © 2026{" "}
            <span className="font-semibold text-orange-500">SunCart</span>. All
            rights reserved.
          </p>

          <div className="flex gap-4">
            <Link
              href="/privacy-policy"
              className="hover:text-orange-500 transition"
            >
              Privacy Policy
            </Link>

            <span className="text-gray-300">|</span>

            <Link href="/terms" className="hover:text-orange-500 transition">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
