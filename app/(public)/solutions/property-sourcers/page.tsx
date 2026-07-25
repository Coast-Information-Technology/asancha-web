// File: app/(public)/solutions/property-sourcers/page.tsx

import type { Metadata } from "next";

import { JsonLd } from "@/src/components/seo/json-ld";
import { createPropertySourcerSolutionsPageJsonLd } from "@/src/lib/seo/json-ld";

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
      <SolutionPageExperience
        benefits={[
          {
            title: "Consistent deal presentation",
            description:
              "Organise property, investment, fee, risk, and supporting information using a clear structure.",
            icon: "search",
          },
          {
            title: "Relevant investor matching",
            description:
              "Present approved opportunities to investors whose goals may align with the deal.",
            icon: "document",
          },
          {
            title: "Transparent sourcing fees",
            description:
              "Connect sourcing-fee information to clear terms, stages, and payment records.",
            icon: "shield",
          },
          {
            title: "Visible progress",
            description:
              "See what is in draft, under review, approved, published, reserved, completed, or requiring action.",
            icon: "investor",
          },
        ]}
        benefitsDescription="Asancha helps sourcers organise deal context, supporting records, investor access, payment stages, reservations, and communications around the correct opportunity."
        benefitsHeading="A more structured way to present investment opportunities."
        challengeDescription="Property sourcers often work with opportunities that require more explanation than a standard listing, and scattered deal information makes assessment harder."
        challengeEyebrow="Why sourcers need better deal workflows"
        challengeHeading="A good opportunity can be lost in poorly structured information."
        challenges={[
          {
            title: "Inconsistent deal presentation",
            description:
              "Different opportunities may be presented using different formats, assumptions, and calculations.",
          },
          {
            title: "Weak investor relevance",
            description:
              "Sourcers may share opportunities broadly instead of targeting investors whose preferences align.",
          },
          {
            title: "Unclear authority",
            description:
              "A sourcer must be able to demonstrate the right or permission to present an opportunity.",
          },
          {
            title: "Sensitive information exposure",
            description:
              "Seller details, sourcing relationships, private documents, and restricted deal information should not be public by default.",
          },
        ]}
        description="Asancha helps property sourcers organise, submit, review, and present investment-focused property opportunities to relevant investors."
        eyebrow="For property sourcers"
        faqs={[
          {
            question: "Can I submit an opportunity without authority?",
            answer:
              "No. You must have lawful permission or authority to present the property opportunity.",
          },
          {
            question: "Does creating a sourcer account approve my business?",
            answer:
              "No. Your identity, company, compliance information, documents, and sourcing activity may require review.",
          },
          {
            question: "Can I charge a sourcing fee?",
            answer:
              "A sourcing fee may be supported where it follows Asancha’s approved business, disclosure, legal, and payment rules.",
          },
          {
            question: "Does AI matching guarantee investor interest?",
            answer:
              "No. AI-powered matching supports relevance and discovery but does not guarantee an enquiry, booking, reservation, or transaction.",
          },
        ]}
        featureSections={[
          {
            eyebrow: "Responsible property sourcing",
            heading: "Confirm the standards that apply to your sourcing activity.",
            description:
              "Property sourcing involves investment information, sensitive data, buyers, sellers, agents, and service providers, so declarations and evidence may be required.",
            items: [
              "Company registration and identity verification",
              "Insurance, complaints, data protection, and AML information where applicable",
              "Authority to present opportunities",
              "Sourcing-compliance declarations",
              "Listing standards and platform rules",
              "Supporting evidence where required",
            ],
          },
          {
            eyebrow: "Structured deal presentation",
            heading: "Help investors understand the opportunity without guesswork.",
            description:
              "A property-sourcing opportunity should present the important facts, assumptions, calculations, risks, and missing information clearly.",
            items: [
              "Property overview, location, tenure, bedrooms, bathrooms, and occupancy",
              "Asking price, purchase costs, sourcing fee, and other known costs",
              "Refurbishment budget, known works, assumptions, and contingencies",
              "Rental evidence, yield indicators, return indicators, and comparable information",
              "Risks, missing documents, unverified figures, and opportunity expiry",
            ],
          },
          {
            eyebrow: "Controlled deal access",
            heading: "Share enough to create interest without exposing private information.",
            description:
              "Property opportunities may contain public, authenticated, verified, payment-gated, and private information, and these levels should stay separate.",
            items: [
              "Safe public previews and approved sourcer attribution",
              "Authenticated opportunity summaries",
              "Verified-investor restricted analysis",
              "Payment-gated deal packs where approved",
              "Protected seller details, authority agreements, notes, payment records, and reservations",
            ],
          },
        ]}
        finalCtaDescription="Set up your sourcer profile, define your sourcing focus, confirm your authority, and submit investment-focused property opportunities through a structured property intelligence platform."
        finalCtaHeading="Create your property sourcer account."
        journey={[
          {
            title: "Create a property sourcer account",
            description:
              "Start through ordinary public signup and choose property sourcer as your first role.",
          },
          {
            title: "Complete sourcer profile setup",
            description:
              "Provide business profile information needed for sourced-opportunity workflows.",
          },
          {
            title: "Prepare opportunity details",
            description:
              "Add public-safe property information, opportunity context, and supporting details.",
          },
          {
            title: "Submit documents when required",
            description:
              "Upload or update documents through protected workflows when requested.",
          },
          {
            title: "Follow review and correction",
            description:
              "Respond to review, correction, verification, approval, or additional information needs.",
          },
          {
            title: "Continue through approved flows",
            description:
              "Move into visibility, conversations, performance tracking, or related actions where allowed.",
          },
        ]}
        journeyDescription="Sourcer workflows connect profile setup, opportunity preparation, documents, compliance, review, and approved visibility."
        journeyHeading="From sourced opportunity to reviewed platform workflow."
        primaryAction={{ label: "Create a property sourcer account", href: "/auth/sign-up" }}
        safetyDescription="Sourced opportunity pages need strong boundaries around private deal packs, investor data, and claims about outcomes."
        safetyHeading="Compliance-aware submission without guaranteed outcomes."
        safetyNotes={[
          "Sourced opportunities should not expose private deal packs publicly.",
          "Investor private data should not be visible unless released through approved workflows.",
          "Submission does not automatically mean approval or publication.",
          "Asancha does not guarantee investor interest, funding, resale, rental, or completion outcomes.",
        ]}
        secondaryAction={{
          label: "Submit a property opportunity",
          href: "/dashboard/properties/new",
        }}
        supportingCopy="Create your sourcer profile, define the markets and strategies you cover, provide clear property and deal information, upload supporting documents, and track opportunities through review, publication, enquiry, reservation, and completion stages."
        title="Present investment-focused property opportunities with greater structure."
        trustIndicators={[
          "Investment-focused opportunity submission",
          "Structured deal information",
          "Sourcer compliance and authority review",
          "Relevant investor matching",
          "Controlled access to private deal information",
        ]}
        workflowDescription="Structured opportunity details make review clearer while helping public previews stay safe."
        workflowEyebrow="Sourcer workflow"
        workflowHeading="Prepare opportunity details without exposing restricted deal information."
        workflowItems={[
          "Opportunity title and summary",
          "Property location context",
          "Property type and condition",
          "Strategy or opportunity category",
          "Supporting deal information",
          "Document requirements",
          "Review or correction status",
          "Performance and visibility context",
        ]}
      />
    </>
  );
}
