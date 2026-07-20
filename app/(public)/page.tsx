// File: app/(public)/page.tsx

/**
 * Asancha Public Home Page
 *
 * Purpose:
 * Provides the main public homepage for Asancha Web Public.
 */

import type { Metadata } from "next";

import { JsonLd } from "@/src/components/seo/json-ld";
import { createHomePageJsonLdBundle } from "@/src/lib/seo/json-ld";

import { HomePageExperience } from "./_components/home-page-experience";

export const metadata: Metadata = {
  title: "Asancha | UK Property Platform for Public Users and Partners",
  description:
    "Asancha is a UK-focused property platform for investors, property owners, property agents, property sourcers, service providers, and approved API partners.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Asancha | UK Property Platform",
    description:
      "Discover a structured property platform for marketplace discovery, role-based onboarding, trusted workflows, and controlled API partner access.",
    url: "/",
    type: "website",
  },
};

/**
 * Renders the Asancha public homepage.
 */
export default function HomePage() {
  const homepageJsonLd = createHomePageJsonLdBundle();

  return (
    <>
      <JsonLd data={homepageJsonLd} id="homepage-json-ld" />
      <HomePageExperience />
    </>
  );
}
