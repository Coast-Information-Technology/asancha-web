// File: app/(public)/how-it-works/page.tsx

/**
 * Asancha How It Works Page
 *
 * Purpose:
 * Explains how users discover, evaluate, and progress property opportunities.
 */

import type { Metadata } from "next";

import { JsonLd } from "@/src/components/seo/json-ld";
import { createHowItWorksPageJsonLd } from "@/src/lib/seo/json-ld";

import { HowItWorksPageExperience } from "./_components/how-it-works-page-experience";

export const metadata: Metadata = {
  metadataBase: new URL("https://asancha.co.uk"),
  title: {
    absolute: "How Asancha Works | Find and Progress Property Opportunities",
  },
  description:
    "See how Asancha connects investors with property opportunities from owners, agents and sourcers, helping them discover, evaluate and progress suitable opportunities.",
  keywords: [
    "how Asancha works",
    "property sourcing process UK",
    "find property opportunities UK",
    "evaluate property opportunities",
    "property investment opportunities",
    "property owners agents sourcers",
    "UK property sourcing platform",
    "list a property UK",
  ],
  applicationName: "Asancha",
  authors: [{ name: "Asancha", url: "https://asancha.co.uk" }],
  creator: "Asancha",
  publisher: "Asancha",
  category: "Property Technology",
  alternates: {
    canonical: "/how-it-works",
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://asancha.co.uk/how-it-works",
    siteName: "Asancha",
    title: "A Simpler Way to Source and Progress Property Opportunities",
    description:
      "Discover, evaluate and progress property opportunities from owners, agents and sourcers through Asancha.",
    images: [
      {
        url: "/images/og/asancha-homepage-og.jpg",
        secureUrl: "https://asancha.co.uk/images/og/asancha-homepage-og.jpg",
        width: 1200,
        height: 630,
        alt: "UK residential property opportunities available through Asancha",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "A Simpler Way to Source and Progress Property Opportunities",
    description:
      "Discover, evaluate and progress property opportunities from owners, agents and sourcers through Asancha.",
    images: [
      {
        url: "/images/og/asancha-homepage-og.jpg",
        alt: "UK residential property opportunities available through Asancha",
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

export default function HowItWorksPage() {
  const jsonLd = createHowItWorksPageJsonLd();

  return (
    <>
      <JsonLd data={jsonLd} id="how-it-works-json-ld" />
      <HowItWorksPageExperience />
    </>
  );
}
