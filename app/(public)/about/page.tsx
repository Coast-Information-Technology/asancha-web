// File: app/(public)/about/page.tsx

/**
 * Asancha About Page
 *
 * Purpose:
 * Explains what Asancha is and who the public platform serves.
 */

import type { Metadata } from "next";

import { JsonLd } from "@/src/components/seo/json-ld";
import { createPublicPageJsonLdBundle } from "@/src/lib/seo/json-ld";

import { AboutPageExperience } from "./_components/about-page-experience";

export const metadata: Metadata = {
  title: "About Asancha",
  description:
    "Learn about Asancha, a UK-focused property technology platform for marketplace discovery, role-based workflows, verification-aware journeys, and approved API partner access.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Asancha",
    description:
      "A UK-focused property technology platform for investors, owners, agents, sourcers, service providers, and approved API partners.",
    url: "/about",
    type: "website",
  },
};

export default function AboutPage() {
  const jsonLd = createPublicPageJsonLdBundle({
    path: "/about",
    name: "About Asancha",
    description:
      "Learn about Asancha, a UK-focused property technology platform for marketplace discovery, role-based workflows, verification-aware journeys, and approved API partner access.",
    pageType: "AboutPage",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "About", path: "/about" },
    ],
  });

  return (
    <>
      <JsonLd data={jsonLd} id="about-json-ld" />
      <AboutPageExperience />
    </>
  );
}
