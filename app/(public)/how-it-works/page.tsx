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
import { createHowItWorksPageJsonLd } from "@/src/lib/seo/json-ld";

import { HowItWorksPageExperience } from "./_components/how-it-works-page-experience";

export const metadata: Metadata = {
  metadataBase: new URL("https://asancha.co.uk"),
  title: {
    absolute: "How Asancha Works | Property Sourcing and AI Intelligence",
  },
  description:
    "Learn how Asancha helps users create profiles, define property goals, discover opportunities, complete verification, access AI-powered insights, and progress through structured property workflows.",
  keywords: [
    "how Asancha works",
    "property sourcing process UK",
    "AI property intelligence process",
    "property investment platform process",
    "property onboarding UK",
    "property opportunity matching",
    "property investor onboarding",
    "property sourcing workflow",
    "property verification platform",
    "property document review",
    "property reservation process",
    "property deal platform",
    "property marketplace process",
    "AI property matching UK",
    "property sourcing company UK",
    "UK property intelligence platform",
    "property submission process",
    "property sourcer platform",
    "property agent platform UK",
    "API property platform",
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
    title: "How Asancha Works | Property Sourcing and AI Intelligence",
    description:
      "See how Asancha combines profile setup, property sourcing, personalised matching, verification, AI-powered insights, payments, bookings, and reservations in one structured platform.",
    images: [
      {
        url: "/images/og/asancha-how-it-works-og.jpg",
        secureUrl: "https://asancha.co.uk/images/og/asancha-how-it-works-og.jpg",
        width: 1200,
        height: 630,
        alt: "How Asancha combines property sourcing, AI intelligence, verification and structured property workflows",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "How Asancha Works | Property Sourcing and AI Intelligence",
    description:
      "Learn how Asancha helps users discover property opportunities, receive AI-powered insights, complete verification, and progress through structured property workflows.",
    images: [
      {
        url: "/images/og/asancha-how-it-works-og.jpg",
        alt: "How Asancha supports property discovery, AI intelligence, verification and property actions",
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
