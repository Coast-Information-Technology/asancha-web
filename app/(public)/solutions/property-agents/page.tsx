// File: app/(public)/solutions/property-agents/page.tsx

import type { Metadata } from "next";

import { JsonLd } from "@/src/components/seo/json-ld";
import { createPropertyAgentSolutionsPageJsonLd } from "@/src/lib/seo/json-ld";

import { agentPageContent } from "../_components/solution-page-content";
import { SolutionPageExperience } from "../_components/solution-page-experience";

export const metadata: Metadata = {
  metadataBase: new URL("https://asancha.co.uk"),
  title: {
    absolute: "Property Agent Solutions | Manage Client Properties | Asancha",
  },
  description:
    "Create an Asancha property-agent account to manage client authority, submit UK properties, track listing reviews, coordinate enquiries, and present approved opportunities to relevant investors.",
  keywords: [
    "property agent solutions",
    "property agent platform UK",
    "manage client properties",
    "submit property for clients",
    "property agency platform",
    "UK property listing management",
    "estate agent property platform",
    "property representation platform",
    "property agent dashboard",
    "property agent onboarding",
    "property authority verification",
    "property listing approval",
    "manage property enquiries",
    "property viewing management",
    "property investor matching",
    "AI property intelligence",
    "property opportunity platform",
    "property agency software UK",
    "UK property sourcing platform",
    "Asancha property agents",
  ],
  applicationName: "Asancha",
  authors: [{ name: "Asancha", url: "https://asancha.co.uk" }],
  creator: "Asancha",
  publisher: "Asancha",
  category: "Property Technology",
  alternates: {
    canonical: "/solutions/property-agents",
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://asancha.co.uk/solutions/property-agents",
    siteName: "Asancha",
    title: "Property Agent Solutions | Manage Client Properties | Asancha",
    description:
      "Manage client authority, submit UK properties, track listing reviews, coordinate enquiries, and present approved opportunities to relevant investors with Asancha.",
    images: [
      {
        url: "/images/og/asancha-property-agents-og.jpg",
        secureUrl:
          "https://asancha.co.uk/images/og/asancha-property-agents-og.jpg",
        width: 1200,
        height: 630,
        alt: "Asancha property agent solutions for managing client properties and UK property opportunities",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Property Agent Solutions | Manage Client Properties | Asancha",
    description:
      "Create an agent profile, confirm client authority, submit properties, manage enquiries, and present approved UK opportunities to relevant investors.",
    images: [
      {
        url: "/images/og/asancha-property-agents-og.jpg",
        alt: "Asancha property management and listing solutions for UK property agents",
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

export default function PropertyAgentsSolutionPage() {
  const jsonLd = createPropertyAgentSolutionsPageJsonLd();

  return (
    <>
      <JsonLd data={jsonLd} id="property-agents-json-ld" />
      <SolutionPageExperience {...agentPageContent} />
    </>
  );
}
