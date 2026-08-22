export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/products", "/privacy-policy", "/terms-of-service"],
      disallow: ["/api/", "/login", "/register", "/profile", "/products/*"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
