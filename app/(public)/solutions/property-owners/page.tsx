// File: app/(public)/solutions/property-owners/page.tsx

import type { Metadata } from "next";

import { JsonLd } from "@/src/components/seo/json-ld";
import { createPropertyOwnerSolutionsPageJsonLd } from "@/src/lib/seo/json-ld";

import { PropertyOwnersPageExperience } from "./_components/property-owners-page-experience";

export const metadata: Metadata = {
  metadataBase: new URL("https://asancha.co.uk"),
  title: {
    absolute: "List Your Property | Reach UK Buyers & Investors | Asancha",
  },
  description:
    "List your UK property with Asancha and present an approved opportunity to relevant investors and property professionals through a secure, controlled process.",
  keywords: [
    "list property UK",
    "list investment property UK",
    "sell property to investors UK",
    "property owner platform",
    "property opportunity submission",
    "property investor matching",
    "property ownership verification",
    "property listing management UK",
    "Asancha property owners",
  ],
  applicationName: "Asancha",
  authors: [{ name: "Asancha", url: "https://asancha.co.uk" }],
  creator: "Asancha",
  publisher: "Asancha",
  category: "Property Technology",
  alternates: {
    canonical: "/solutions/property-owners",
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://asancha.co.uk/solutions/property-owners",
    siteName: "Asancha",
    title: "List Your Property and Reach Relevant Buyers & Investors",
    description:
      "Submit your property to Asancha and connect with relevant investors and property professionals through a structured, secure process.",
    images: [
      {
        url: "/images/og/asancha-homepage-og.jpg",
        secureUrl: "https://asancha.co.uk/images/og/asancha-homepage-og.jpg",
        width: 1200,
        height: 630,
        alt: "List a UK property with Asancha and reach relevant buyers and investors",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "List Your Property and Reach Relevant Buyers & Investors",
    description:
      "List your UK property through Asancha’s structured, secure property submission process.",
    images: [
      {
        url: "/images/og/asancha-homepage-og.jpg",
        alt: "List a UK property with Asancha and reach relevant buyers and investors",
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

export default function PropertyOwnersSolutionPage() {
  const jsonLd = createPropertyOwnerSolutionsPageJsonLd();

  return (
    <>
      <JsonLd data={jsonLd} id="property-owners-json-ld" />
      <PropertyOwnersPageExperience />
    </>
  );
}
