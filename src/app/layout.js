import { Montserrat, Poppins } from "next/font/google";
import { ToastContainer } from "react-toastify";
import { CartProvider } from "@/components/CartProvider";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "SunCart | Summer Essentials",
    template: "%s | SunCart",
  },
  description: "Discover sunglasses, skincare, beach accessories, and summer essentials at SunCart.",
  applicationName: "SunCart",
  category: "shopping",
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.className} min-h-screen flex flex-col`}>
        <CartProvider>{children}</CartProvider>
        <ToastContainer position="top-right" autoClose={3000} theme="light" />
      </body>
    </html>
  );
}
