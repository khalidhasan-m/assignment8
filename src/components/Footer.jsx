import Link from "next/link";
import { FaFacebookF, FaInstagram, FaXTwitter } from "react-icons/fa6";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "My Profile", href: "/profile" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-of-service" },
];

const socialLinks = [
  { label: "Facebook", href: process.env.NEXT_PUBLIC_FACEBOOK_URL, icon: <FaFacebookF /> },
  { label: "Instagram", href: process.env.NEXT_PUBLIC_INSTAGRAM_URL, icon: <FaInstagram /> },
  { label: "X", href: process.env.NEXT_PUBLIC_X_URL, icon: <FaXTwitter /> },
].filter((social) => social.href);

const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@suncart.com";
const supportPhone = process.env.NEXT_PUBLIC_SUPPORT_PHONE || "+1 (800) SUN-CART";

export default function Footer() {
  return (
    <footer className="backdrop-blur-xl bg-white/30 border-t border-white/20 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div className="flex flex-col gap-3">
          <Link href="/" className="flex items-center gap-1">
            <span className="text-3xl" aria-hidden="true">☀️</span>
            <span className="text-2xl font-extrabold tracking-wide text-orange-500">SunCart</span>
          </Link>
          <p className="text-gray-600 text-sm leading-relaxed">Your one-stop summer essentials store. Stay cool, look hot, and enjoy the sun!</p>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-bold text-gray-800">Quick Links</h2>
          <nav aria-label="Footer navigation">
            <ul className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-600 hover:text-orange-500 text-sm transition">{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-bold text-gray-800">Contact Us</h2>
          <ul className="flex flex-col gap-2 text-sm text-gray-600">
            <li className="flex items-center gap-2"><span className="text-orange-500" aria-hidden="true">📧</span><a href={`mailto:${supportEmail}`} className="hover:text-orange-500">{supportEmail}</a></li>
            <li className="flex items-center gap-2"><span className="text-orange-500" aria-hidden="true">📞</span><a href={`tel:${supportPhone.replace(/[^\d+]/g, "")}`} className="hover:text-orange-500">{supportPhone}</a></li>
            <li className="flex items-center gap-2"><span className="text-orange-500" aria-hidden="true">🕐</span>Mon–Fri, 9am–6pm</li>
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-bold text-gray-800">Follow Us</h2>
          {socialLinks.length > 0 ? (
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label} className="w-9 h-9 flex items-center justify-center rounded-full bg-white/40 border border-white/30 text-orange-500 hover:bg-orange-500 hover:text-white transition-all duration-200 backdrop-blur-md">
                  {social.icon}
                </a>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-sm">Our social channels are coming soon.</p>
          )}
          <p className="text-gray-600 text-sm mt-2">Stay updated with our latest summer deals and collections.</p>
        </div>
      </div>

      <div className="border-t border-white/20 bg-white/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-600">
          <p>© {new Date().getFullYear()} <span className="font-semibold text-orange-500">SunCart</span>. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy-policy" className="hover:text-orange-500 transition">Privacy Policy</Link>
            <span className="text-gray-300" aria-hidden="true">|</span>
            <Link href="/terms-of-service" className="hover:text-orange-500 transition">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
