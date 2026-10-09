// File: app/(public)/solutions/investors/page.tsx

import type { Metadata } from "next";

import { JsonLd } from "@/src/components/seo/json-ld";
import { createInvestorSolutionsPageJsonLd } from "@/src/lib/seo/json-ld";

import { investorPageContent } from "../_components/solution-page-content";
import { SolutionPageExperience } from "../_components/solution-page-experience";

export const metadata: Metadata = {
  metadataBase: new URL("https://asancha.co.uk"),
  title: {
    absolute: "Property Investment Solutions | AI Property Sourcing | Asancha",
  },
  description:
    "Create an Asancha investor profile to discover UK property opportunities, receive AI-powered recommendations, compare properties, complete verification, and access eligible deal information.",
  keywords: [
    "property investment solutions",
    "UK property investors",
    "property investor platform",
    "AI property sourcing",
    "AI property intelligence",
    "investment properties UK",
    "property investment opportunities",
    "property sourcing for investors",
    "property opportunity matching",
    "AI property recommendations",
    "below market value properties",
    "buy to let opportunities UK",
    "property deal sourcing",
    "property investor onboarding",
    "property investment marketplace",
    "UK property sourcing company",
    "property investment analysis",
    "property deal comparison",
    "investor verification platform",
    "property reservation platform",
    "Asancha investors",
  ],
  applicationName: "Asancha",
  authors: [{ name: "Asancha", url: "https://asancha.co.uk" }],
  creator: "Asancha",
  publisher: "Asancha",
  category: "Property Technology",
  alternates: {
    canonical: "/solutions/investors",
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://asancha.co.uk/solutions/investors",
    siteName: "Asancha",
    title: "Property Investment Solutions | AI Property Sourcing | Asancha",
    description:
      "Discover UK property opportunities, receive AI-powered recommendations, compare structured property information, and progress through verified investor workflows with Asancha.",
    images: [
      {
        url: "/images/og/asancha-investors-og.jpg",
        secureUrl: "https://asancha.co.uk/images/og/asancha-investors-og.jpg",
        width: 1200,
        height: 630,
        alt: "Asancha property investment solutions with AI-powered property sourcing and intelligence",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Property Investment Solutions | AI Property Sourcing | Asancha",
    description:
      "Create an investor profile, define your goals, discover relevant UK property opportunities, and receive AI-powered property insights with Asancha.",
    images: [
      {
        url: "/images/og/asancha-investors-og.jpg",
        alt: "Asancha AI-powered property investment sourcing for UK investors",
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

export default function InvestorsSolutionPage() {
  const jsonLd = createInvestorSolutionsPageJsonLd();

  return (
    <>
      <JsonLd data={jsonLd} id="investors-json-ld" />
      <SolutionPageExperience {...investorPageContent} />
    </>
  );
}
