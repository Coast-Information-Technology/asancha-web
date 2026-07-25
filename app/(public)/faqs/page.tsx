// File: app/(public)/faqs/page.tsx

import type { Metadata } from "next";

import { JsonLd } from "@/src/components/seo/json-ld";
import {
  getVisiblePublicFaqs,
  publicFaqCategories,
} from "@/src/content/public-faqs";
import { createFaqsPageJsonLd } from "@/src/lib/seo/json-ld";

import { FaqsPageExperience } from "./_components/faqs-page-experience";

export const metadata: Metadata = {
  metadataBase: new URL("https://asancha.co.uk"),
  title: {
    absolute: "Frequently Asked Questions | Asancha",
  },
  description:
    "Find answers about Asancha property browsing, accounts, onboarding, verification, property submissions, payments, reservations, professional services, and API Partner access.",
  keywords: [
    "Asancha FAQs",
    "Asancha help",
    "property marketplace FAQs",
    "UK property platform help",
    "property account questions",
    "property verification questions",
    "property listing FAQs",
    "property sourcing questions",
    "property investor FAQs",
    "property owner FAQs",
    "property agent FAQs",
    "property sourcer FAQs",
    "service provider FAQs",
    "property payment questions",
    "property reservation FAQs",
    "property deal pack questions",
    "API Partner FAQs",
    "property API questions",
    "Asancha support",
    "Asancha account help",
  ],
  applicationName: "Asancha",
  authors: [{ name: "Asancha", url: "https://asancha.co.uk" }],
  creator: "Asancha",
  publisher: "Asancha",
  category: "Property Technology",
  alternates: {
    canonical: "/faqs",
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://asancha.co.uk/faqs",
    siteName: "Asancha",
    title: "Frequently Asked Questions | Asancha",
    description:
      "Find answers about property browsing, accounts, onboarding, verification, property submissions, payments, reservations, professional services, API Apps, privacy, and support.",
    images: [
      {
        url: "/images/og/asancha-faqs-og.jpg",
        secureUrl: "https://asancha.co.uk/images/og/asancha-faqs-og.jpg",
        width: 1200,
        height: 630,
        alt: "Asancha frequently asked questions about property, accounts, payments and API Partner access",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Frequently Asked Questions | Asancha",
    description:
      "Find answers about Asancha property browsing, accounts, verification, payments, reservations, professionals, API Apps, privacy, and support.",
    images: [
      {
        url: "/images/og/asancha-faqs-og.jpg",
        alt: "Asancha help and frequently asked questions",
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

export default function FaqsPage() {
  const faqs = getVisiblePublicFaqs();
  const jsonLd = createFaqsPageJsonLd(
    faqs.map((faq) => ({
      question: faq.question,
      answer: faq.answer,
    })),
  );

  return (
    <>
      <JsonLd data={jsonLd} id="faqs-json-ld" />
      <FaqsPageExperience categories={publicFaqCategories} faqs={faqs} />
    </>
  );
}
