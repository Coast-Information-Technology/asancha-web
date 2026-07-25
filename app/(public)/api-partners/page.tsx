// File: app/(public)/api-partners/page.tsx

import type { Metadata } from "next";

import { JsonLd } from "@/src/components/seo/json-ld";
import { createApiPartnersPageJsonLd } from "@/src/lib/seo/json-ld";

import { ApiPartnersPageExperience } from "./_components/api-partners-page-experience";

export const metadata: Metadata = {
  metadataBase: new URL("https://asancha.co.uk"),
  title: {
    absolute: "Property Intelligence API Partnerships | Asancha",
  },
  description:
    "Apply to become an Asancha API Partner and connect approved Apps to selected UK property sourcing, property intelligence, usage, and webhook capabilities.",
  keywords: [
    "Asancha API Partners",
    "property intelligence API",
    "property data API UK",
    "property sourcing API",
    "UK property API",
    "PropTech API",
    "property API Apps",
    "property listing API",
    "property matching API",
    "AI property intelligence API",
    "property analysis API",
    "property recommendation API",
    "property webhook API",
    "property platform integration",
    "property data integration",
    "property technology integration",
    "API Partner programme",
    "property API access",
    "property investment API",
    "Asancha developer API",
  ],
  applicationName: "Asancha",
  authors: [{ name: "Asancha", url: "https://asancha.co.uk" }],
  creator: "Asancha",
  publisher: "Asancha",
  category: "Property Technology",
  alternates: {
    canonical: "/api-partners",
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://asancha.co.uk/api-partners",
    siteName: "Asancha",
    title: "Property Intelligence API Partnerships | Asancha",
    description:
      "Apply to connect approved Apps to selected Asancha property sourcing and property intelligence services using scoped keys, usage monitoring, webhooks, documentation, and partner support.",
    images: [
      {
        url: "/images/og/asancha-api-partners-og.jpg",
        secureUrl: "https://asancha.co.uk/images/og/asancha-api-partners-og.jpg",
        width: 1200,
        height: 630,
        alt: "Asancha API Partnerships for Apps integrating approved property sourcing and property intelligence capabilities",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Property Intelligence API Partnerships | Asancha",
    description:
      "Apply to connect approved Apps to selected Asancha property sourcing, property intelligence, usage, and webhook capabilities.",
    images: [
      {
        url: "/images/og/asancha-api-partners-og.jpg",
        alt: "Asancha API Partner Programme for approved property technology Apps",
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

export default function ApiPartnersPage() {
  return (
    <>
      <JsonLd data={createApiPartnersPageJsonLd()} id="api-partners-json-ld" />
      <ApiPartnersPageExperience />
    </>
  );
}
