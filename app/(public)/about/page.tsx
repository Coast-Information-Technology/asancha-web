// File: app/(public)/about/page.tsx

/**
 * Asancha About Page
 *
 * Purpose:
 * Explains what Asancha is and who the public platform serves.
 */

import type { Metadata } from "next";

import { JsonLd } from "@/src/components/seo/json-ld";
import { createAboutPageJsonLd } from "@/src/lib/seo/json-ld";

import { AboutPageExperience } from "./_components/about-page-experience";

export const metadata: Metadata = {
  metadataBase: new URL("https://asancha.co.uk"),
  title: {
    absolute: "About Asancha | AI Property Intelligence and Property Sourcing",
  },
  description:
    "Learn how Asancha combines AI-powered property intelligence, structured property sourcing, verification workflows, and personalised opportunity matching across the UK property market.",
  keywords: [
    "about Asancha",
    "Asancha property sourcing",
    "AI property intelligence company",
    "property sourcing company UK",
    "UK property intelligence",
    "UK property sourcing platform",
    "property investment platform UK",
    "AI-powered property sourcing",
    "property opportunity matching",
    "property technology company UK",
    "UK PropTech company",
    "property sourcing technology",
    "property analysis platform",
    "property investor matching",
    "structured property sourcing",
    "property marketplace UK",
    "property verification platform",
    "property professionals platform",
  ],
  applicationName: "Asancha",
  authors: [{ name: "Asancha", url: "https://asancha.co.uk" }],
  creator: "Asancha",
  publisher: "Asancha",
  category: "Property Technology",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://asancha.co.uk/about",
    siteName: "Asancha",
    title: "About Asancha | AI Property Intelligence and Property Sourcing",
    description:
      "Learn how Asancha combines structured property sourcing, AI-powered intelligence, personalised matching, verification workflows, and controlled property access across the UK.",
    images: [
      {
        url: "/images/og/asancha-about-og.jpg",
        secureUrl: "https://asancha.co.uk/images/og/asancha-about-og.jpg",
        width: 1200,
        height: 630,
        alt: "About Asancha, an AI-powered property intelligence and property sourcing company",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Asancha | AI Property Intelligence and Property Sourcing",
    description:
      "Discover how Asancha is building a more structured, intelligent, and trusted way to source and understand UK property opportunities.",
    images: [
      {
        url: "/images/og/asancha-about-og.jpg",
        alt: "About Asancha, an AI-powered UK property intelligence and sourcing company",
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

export default function AboutPage() {
  const jsonLd = createAboutPageJsonLd();

  return (
    <>
      <JsonLd data={jsonLd} id="about-json-ld" />
      <AboutPageExperience />
    </>
  );
}
