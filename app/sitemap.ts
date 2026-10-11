import type { MetadataRoute } from "next";

const siteUrl = "https://asancha.co.uk";

const publicRoutes = [
  "",
  "/about",
  "/api-partners",
  "/contact",
  "/faqs",
  "/how-it-works",
  "/marketplace",
  "/pricing",
  "/services",
  "/services/property-sourcing",
  "/services/property-investment",
  "/services/property-management",
  "/services/property-refurbishment",
  "/services/interior-design",
  "/solutions/investors",
  "/solutions/property-owners",
  "/solutions/property-agents",
  "/solutions/property-sourcers",
  "/solutions/service-providers",
  "/support",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    changeFrequency:
      route === "" || route === "/marketplace" ? "daily" : "weekly",
    priority: route === "" ? 1 : route === "/marketplace" ? 0.9 : 0.7,
  }));
}
