// File: app/(public)/solutions/service-providers/page.tsx

import type { Metadata } from "next";

import { JsonLd } from "@/src/components/seo/json-ld";
import { createServiceProviderSolutionsPageJsonLd } from "@/src/lib/seo/json-ld";

import { providerPageContent } from "../_components/solution-page-content";
import { SolutionPageExperience } from "../_components/solution-page-experience";

export const metadata: Metadata = {
  metadataBase: new URL("https://asancha.co.uk"),
  title: {
    absolute: "Property Service Provider Solutions | Join Asancha",
  },
  description:
    "Create an Asancha service-provider profile to present approved property services, provide qualifications, receive relevant enquiries, manage bookings, and support UK property opportunities.",
  keywords: [
    "property service provider solutions",
    "property professionals platform UK",
    "property service provider platform",
    "property services marketplace UK",
    "property professional profile",
    "property surveyor platform",
    "property refurbishment services",
    "property legal services UK",
    "property finance professionals",
    "property management services",
    "property inspection services",
    "property valuation services",
    "property service enquiries",
    "property service bookings",
    "property professional verification",
    "property services for investors",
    "property services for landlords",
    "UK property sourcing platform",
    "AI property intelligence",
    "Asancha service providers",
  ],
  applicationName: "Asancha",
  authors: [{ name: "Asancha", url: "https://asancha.co.uk" }],
  creator: "Asancha",
  publisher: "Asancha",
  category: "Property Technology",
  alternates: {
    canonical: "/solutions/service-providers",
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://asancha.co.uk/solutions/service-providers",
    siteName: "Asancha",
    title: "Property Service Provider Solutions | Join Asancha",
    description:
      "Present approved property services, provide qualifications, receive relevant enquiries, manage bookings, and support UK property opportunities through Asancha.",
    images: [
      {
        url: "/images/og/asancha-service-providers-og.jpg",
        secureUrl:
          "https://asancha.co.uk/images/og/asancha-service-providers-og.jpg",
        width: 1200,
        height: 630,
        alt: "Asancha solutions for property professionals and service providers supporting UK property opportunities",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Property Service Provider Solutions | Join Asancha",
    description:
      "Create a professional profile, present approved property services, manage enquiries and bookings, and support relevant UK property opportunities through Asancha.",
    images: [
      {
        url: "/images/og/asancha-service-providers-og.jpg",
        alt: "Asancha platform solutions for UK property professionals and service providers",
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

export default function ServiceProvidersSolutionPage() {
  const jsonLd = createServiceProviderSolutionsPageJsonLd();

  return (
    <>
      <JsonLd data={jsonLd} id="service-providers-json-ld" />
      <SolutionPageExperience {...providerPageContent} />
    </>
  );
}
