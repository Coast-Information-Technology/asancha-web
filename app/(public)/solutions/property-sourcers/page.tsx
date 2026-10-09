// File: app/(public)/solutions/property-sourcers/page.tsx

import type { Metadata } from "next";

import { JsonLd } from "@/src/components/seo/json-ld";
import { createPropertySourcerSolutionsPageJsonLd } from "@/src/lib/seo/json-ld";

import { sourcerPageContent } from "../_components/solution-page-content";
import { SolutionPageExperience } from "../_components/solution-page-experience";

export const metadata: Metadata = {
  metadataBase: new URL("https://asancha.co.uk"),
  title: {
    absolute: "Property Sourcer Solutions | Present Investment Deals | Asancha",
  },
  description:
    "Create an Asancha property-sourcer account to submit UK investment opportunities, disclose sourcing fees, provide supporting deal information, and connect approved deals with relevant investors.",
  keywords: [
    "property sourcer solutions",
    "property sourcing platform UK",
    "property sourcer platform",
    "submit property deals UK",
    "investment property sourcing",
    "property deal submission",
    "property sourcing company UK",
    "property sourcing compliance",
    "property sourcing fees",
    "property deal packaging",
    "investment opportunity platform",
    "property investor matching",
    "AI property intelligence",
    "AI property deal matching",
    "below market value properties",
    "buy to let property sourcing",
    "property sourcing dashboard",
    "off market property opportunities",
    "UK investment property deals",
    "Asancha property sourcers",
  ],
  applicationName: "Asancha",
  authors: [{ name: "Asancha", url: "https://asancha.co.uk" }],
  creator: "Asancha",
  publisher: "Asancha",
  category: "Property Technology",
  alternates: {
    canonical: "/solutions/property-sourcers",
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://asancha.co.uk/solutions/property-sourcers",
    siteName: "Asancha",
    title: "Property Sourcer Solutions | Present Investment Deals | Asancha",
    description:
      "Submit UK investment-focused property opportunities, disclose sourcing fees, provide supporting deal information, and connect approved deals with relevant investors through Asancha.",
    images: [
      {
        url: "/images/og/asancha-property-sourcers-og.jpg",
        secureUrl:
          "https://asancha.co.uk/images/og/asancha-property-sourcers-og.jpg",
        width: 1200,
        height: 630,
        alt: "Asancha property sourcer solutions for submitting and presenting UK investment property opportunities",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Property Sourcer Solutions | Present Investment Deals | Asancha",
    description:
      "Create a sourcer profile, submit structured UK property opportunities, disclose fees, and connect approved deals with relevant investors through Asancha.",
    images: [
      {
        url: "/images/og/asancha-property-sourcers-og.jpg",
        alt: "Asancha property sourcing and investment-deal solutions for UK property sourcers",
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

export default function PropertySourcersSolutionPage() {
  const jsonLd = createPropertySourcerSolutionsPageJsonLd();

  return (
    <>
      <JsonLd data={jsonLd} id="property-sourcers-json-ld" />
      <SolutionPageExperience {...sourcerPageContent} />
    </>
  );
}
