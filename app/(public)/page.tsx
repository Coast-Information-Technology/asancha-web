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
    absolute: "Asancha | UK Property Sourcing & Investment Platform",
  },
  description:
    "Source and discover UK property opportunities from owners, agents and sourcers with investment intelligence, explainable matching and trusted progression through Asancha.",
  keywords: [
    "Asancha",
    "UK property sourcing",
    "property sourcing platform",
    "property sourcing UK",
    "property investment opportunities",
    "investment properties UK",
    "property opportunities UK",
    "property sourcers UK",
    "property sourcing for investors",
    "property marketplace UK",
    "property deal sourcing",
    "property investment platform",
    "property opportunity matching",
    "property investment intelligence",
    "property analysis UK",
    "property owners UK",
    "property agents UK",
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
    title: "Asancha | UK Property Sourcing & Investment Platform",
    description:
      "Source smarter UK property opportunities from owners, agents and sourcers with investment intelligence, explainable matching and trusted progression.",
    images: [
      {
        url: "/images/og/asancha-homepage-og.jpg",
        secureUrl: "https://asancha.co.uk/images/og/asancha-homepage-og.jpg",
        width: 1200,
        height: 630,
        alt: "Asancha UK property sourcing and investment platform",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Asancha | UK Property Sourcing & Investment Platform",
    description:
      "Discover UK property opportunities through structured sourcing, investment intelligence, explainable matching and trusted progression.",
    images: [
      {
        url: "/images/og/asancha-homepage-og.jpg",
        alt: "Asancha UK property sourcing and investment platform",
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
