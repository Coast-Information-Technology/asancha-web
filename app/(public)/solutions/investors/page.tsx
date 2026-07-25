// File: app/(public)/solutions/investors/page.tsx

import type { Metadata } from "next";

import { JsonLd } from "@/src/components/seo/json-ld";
import { createInvestorSolutionsPageJsonLd } from "@/src/lib/seo/json-ld";

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
      <SolutionPageExperience
        benefits={[
          {
            title: "More relevant opportunities",
            description:
              "Property matching begins with your goals, preferred locations, budget, strategy, and readiness.",
            icon: "search",
          },
          {
            title: "Clearer property information",
            description:
              "Review opportunities using more consistent property information and visible status cues.",
            icon: "sliders",
          },
          {
            title: "Explainable recommendations",
            description:
              "Understand why a property may or may not suit your requirements before progressing.",
            icon: "investor",
          },
          {
            title: "Controlled deal access",
            description:
              "Sensitive information remains protected until the correct access conditions are met.",
            icon: "shield",
          },
        ]}
        benefitsDescription="Asancha brings preferences, property intelligence, documents, bookings, payments, reservations, communication, and updates into a more connected investor workflow."
        benefitsHeading="A more structured way to source property."
        challengeDescription="Property investors are often shown large numbers of listings without enough context to understand fit, readiness, risk, and the next approved action."
        challengeEyebrow="Why investors need better property information"
        challengeHeading="More listings do not always mean better opportunities."
        challenges={[
          {
            title: "Too many irrelevant opportunities",
            description:
              "Investors may receive properties that do not match their location, budget, strategy, or readiness.",
          },
          {
            title: "Inconsistent information",
            description:
              "Agents, sourcers, owners, and platforms can present property information in different formats.",
          },
          {
            title: "Weak comparisons",
            description:
              "Pricing, occupancy, condition, yield, and strategy details are difficult to compare when they are scattered.",
          },
          {
            title: "Disconnected next steps",
            description:
              "Meetings, documents, payments, reservations, and communication often happen across separate channels.",
          },
        ]}
        description="Asancha helps property investors discover, understand, and progress relevant property opportunities across the UK."
        eyebrow="For property investors"
        faqs={[
          {
            question: "Can I browse properties before creating an account?",
            answer:
              "Yes. Public visitors can browse safe property previews, while some information and actions require an account, investor profile, verification, payment, or approval.",
          },
          {
            question: "Does creating an account unlock every deal pack?",
            answer:
              "No. Deal-pack access may depend on investor profile completion, verification, proof of funds, listing access level, payment, or administrative approval.",
          },
          {
            question: "Does Asancha guarantee investment returns?",
            answer:
              "No. Asancha supports property discovery, comparison, and AI-assisted insight. Investors remain responsible for professional due diligence.",
          },
          {
            question: "Does saving a property reserve it?",
            answer:
              "No. Saving adds the property to your workspace for later review. A reservation is confirmed only when the platform shows confirmed reservation status.",
          },
        ]}
        featureSections={[
          {
            eyebrow: "Start with your criteria",
            heading: "Tell Asancha what you are looking for.",
            description:
              "Relevant property matching begins with a clear investor profile covering your goals, preferences, financial readiness, and target timeline.",
            items: [
              "Individual or company investor",
              "Experience level and goals",
              "Preferred towns, cities, or regions",
              "Minimum and maximum budget",
              "Property types and bedroom needs",
              "Buy-to-let, BMV, refurb, development, HMO, or income-focused strategies",
              "Yield, return, occupancy, and refurbishment preferences",
              "Funding method, proof-of-funds readiness, and target purchase timeline",
            ],
          },
          {
            eyebrow: "Relevant opportunities, explained",
            heading: "Understand why a property may match your goals.",
            description:
              "AI-powered property intelligence helps compare available property information with your investor profile. It supports discovery and comparison, not guaranteed outcomes.",
            items: [
              "Matched and unmatched criteria",
              "Relevant property characteristics",
              "Incomplete or uncertain information",
              "Budget, location, property type, and strategy fit",
              "Yield, ROI, BMV, occupancy, and refurbishment indicators",
              "Recommendation feedback for saved, viewed, progressed, or dismissed opportunities",
            ],
          },
          {
            eyebrow: "Your investor workspace",
            heading: "Keep relevant properties in one place.",
            description:
              "Authenticated investors can organise opportunities and track activity without treating a saved property as a reservation or confirmed action.",
            items: [
              "Saved and viewed properties",
              "Recommended opportunities",
              "Investor preferences",
              "Comparison history",
              "Property alerts",
              "Booking, payment, and reservation history",
              "Verification and document status",
              "Relevant notifications and conversations",
            ],
          },
        ]}
        finalCtaDescription="Browse public opportunities first, then create an investor account when you are ready to save, compare, or continue."
        finalCtaHeading="Create your investor account."
        journey={[
          {
            title: "Create an investor account",
            description:
              "Choose the investor role and create your Asancha account.",
          },
          {
            title: "Verify your email",
            description:
              "Confirm control of your email address before continuing setup.",
          },
          {
            title: "Complete your general profile",
            description:
              "Provide your core identity and contact information.",
          },
          {
            title: "Define your investment criteria",
            description:
              "Add locations, budget, strategies, preferences, and funding readiness.",
          },
          {
            title: "Enter your dashboard",
            description:
              "Access your workspace while review or verification continues.",
          },
          {
            title: "Take the next approved action",
            description:
              "Save, compare, book, communicate, pay, or begin a reservation where permitted.",
          },
        ]}
        journeyDescription="The investor flow connects account setup, profile criteria, recommendations, verification, controlled access, and approved property actions."
        journeyHeading="From investor profile to the next approved action."
        primaryAction={{ label: "Create an investor account", href: "/auth/sign-up" }}
        safetyDescription="Marketplace previews and AI-supported guidance should help decision-making without implying guaranteed returns or approved access."
        safetyHeading="Useful investor guidance without false certainty."
        safetyNotes={[
          "Public previews are not full deal packs.",
          "AI guidance is not financial, legal, or investment advice.",
          "Payment proof submission is not payment approval.",
          "Visible frontend actions do not override approval checks.",
        ]}
        secondaryAction={{ label: "Explore properties", href: "/marketplace" }}
        supportingCopy="Create your investor profile, define what you are looking for, explore structured opportunities, and receive AI-powered insights and recommendations based on your preferences."
        title="Find property opportunities that match your investment goals."
        trustIndicators={[
          "UK-focused property opportunities",
          "Personalised investor preferences",
          "AI-powered property intelligence",
          "Structured property comparisons",
          "Controlled access to sensitive deal information",
        ]}
        workflowDescription="Investor criteria make discovery more useful while keeping restricted deal information and sensitive records protected."
        workflowEyebrow="Investor criteria"
        workflowHeading="Define what matters before moving deeper into the deal flow."
        workflowItems={[
          "Preferred UK locations",
          "Budget range",
          "Property type",
          "Investment strategy",
          "Target timeline",
          "Funding readiness",
          "Yield or return preference",
          "Below-market-value interest",
        ]}
      />
    </>
  );
}
