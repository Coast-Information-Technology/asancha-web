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
  metadataBase: new URL("https://asancha.co.uk"),
  title: {
    absolute: "Asancha | AI-Powered Property Intelligence and Property Sourcing",
  },
  description:
    "Create an Asancha account to discover UK property opportunities supported by structured property sourcing, personalised matching, verification workflows, and AI-powered property intelligence.",
  keywords: [
    "Asancha",
    "AI-powered property intelligence",
    "property sourcing company",
    "UK property sourcing",
    "UK property opportunities",
    "property investment opportunities",
    "investment properties UK",
    "property marketplace UK",
    "property deal sourcing",
    "property sourcing platform",
    "below market value properties",
    "property investor platform",
    "AI property matching",
    "AI property analysis",
    "property opportunity matching",
    "property sourcers UK",
    "property agents UK",
    "property owners UK",
    "property service providers UK",
    "UK PropTech",
    "property technology platform",
  ],
  applicationName: "Asancha",
  authors: [
    {
      name: "Asancha",
      url: "https://asancha.co.uk",
    },
  ],
  creator: "Asancha",
  publisher: "Asancha",
  category: "Property Technology",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://asancha.co.uk/",
    siteName: "Asancha",
    title: "Asancha | AI-Powered Property Intelligence and Property Sourcing",
    description:
      "Create an account to discover UK property opportunities supported by structured property sourcing, personalised matching, verification workflows, and AI-powered property intelligence.",
    images: [
      {
        url: "/images/og/asancha-homepage-og.jpg",
        secureUrl: "https://asancha.co.uk/images/og/asancha-homepage-og.jpg",
        width: 1200,
        height: 630,
        alt: "Asancha AI-powered property intelligence and property sourcing",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Asancha | AI-Powered Property Intelligence and Property Sourcing",
    description:
      "Discover UK property opportunities with structured sourcing, personalised matching, trusted workflows, and AI-powered property intelligence.",
    images: [
      {
        url: "/images/og/asancha-homepage-og.jpg",
        alt: "Asancha AI-powered property intelligence and property sourcing",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  other: {
    "content-language": "en-GB",
    "geo.region": "GB",
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
