// File: app/(public)/how-it-works/page.tsx

/**
 * Asancha How It Works Page
 *
 * Purpose:
 * Explains the public user journey across discovery, signup, onboarding, and
 * role-specific workflows.
 */

import type { Metadata } from "next";

import { JsonLd } from "@/src/components/seo/json-ld";
import { createPublicPageJsonLdBundle } from "@/src/lib/seo/json-ld";

import { HowItWorksPageExperience } from "./_components/how-it-works-page-experience";

export const metadata: Metadata = {
  title: "How Asancha Works",
  description:
    "Understand how Asancha supports public marketplace browsing, signup, onboarding, verification-aware workflows, payments, AI guidance, and API partner applications.",
  alternates: {
    canonical: "/how-it-works",
  },
  openGraph: {
    title: "How Asancha Works",
    description:
      "See how Asancha guides users from public marketplace discovery into role-specific property workflows, verification-aware actions, and approved API partner access.",
    url: "/how-it-works",
    type: "website",
  },
};

export default function HowItWorksPage() {
  const jsonLd = createPublicPageJsonLdBundle({
    path: "/how-it-works",
    name: "How Asancha Works",
    description:
      "Understand how Asancha supports public marketplace browsing, signup, onboarding, verification-aware workflows, payments, AI guidance, and API partner applications.",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "How It Works", path: "/how-it-works" },
    ],
  });

  return (
    <>
      <JsonLd data={jsonLd} id="how-it-works-json-ld" />
      <HowItWorksPageExperience />
    </>
  );
}
