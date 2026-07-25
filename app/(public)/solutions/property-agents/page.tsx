// File: app/(public)/solutions/property-agents/page.tsx

import type { Metadata } from "next";

import { JsonLd } from "@/src/components/seo/json-ld";
import { createPropertyAgentSolutionsPageJsonLd } from "@/src/lib/seo/json-ld";

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
        secureUrl: "https://asancha.co.uk/images/og/asancha-property-agents-og.jpg",
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
      <SolutionPageExperience
        benefits={[
          {
            title: "Clear client authority",
            description:
              "Keep owner instructions and representation evidence linked to each property.",
            icon: "building",
          },
          {
            title: "Organised property information",
            description:
              "Present client property using consistent and understandable details.",
            icon: "clipboard",
          },
          {
            title: "Multi-property management",
            description:
              "Track several client properties from one agent workspace.",
            icon: "agent",
          },
          {
            title: "Controlled information sharing",
            description:
              "Protect owner, tenant, document, payment, and reservation information.",
            icon: "booking",
          },
        ]}
        benefitsDescription="Asancha connects authority, property information, enquiries, bookings, documents, payments, reservations, and communication to the correct client property."
        benefitsHeading="A more structured way to represent property."
        challengeDescription="Property agents often manage information from owners, landlords, vendors, developers, tenants, buyers, solicitors, surveyors, and other professionals across disconnected tools."
        challengeEyebrow="Why agents need better property workflows"
        challengeHeading="Property representation should not depend on scattered information."
        challenges={[
          {
            title: "Managing several client properties",
            description:
              "Agents may need to handle multiple properties, owners, instructions, documents, and deadlines at the same time.",
          },
          {
            title: "Proving authority to act",
            description:
              "A property submission should be connected to clear owner or client authority.",
          },
          {
            title: "Sensitive information exposure",
            description:
              "Private owner details, tenancy records, legal documents, and instructions should not be publicly visible.",
          },
          {
            title: "Disconnected enquiries and updates",
            description:
              "Buyer questions, viewings, document requests, and property-status changes can otherwise happen across different channels.",
          },
        ]}
        description="Asancha helps property agents submit, organise, review, and manage property opportunities on behalf of owners, landlords, vendors, and developers."
        eyebrow="For property agents"
        faqs={[
          {
            question: "Can an agent submit a property without owner authority?",
            answer:
              "No. The agent must have lawful authority to represent the owner, landlord, vendor, developer, or other authorised client.",
          },
          {
            question: "Does creating an agent account approve my company?",
            answer:
              "No. The agent or company profile may require information, documents, and review before sensitive actions are approved.",
          },
          {
            question: "Can agents manage properties for several clients?",
            answer:
              "Yes, where supported. Each property should remain linked to the correct client, authority record, company, and listing.",
          },
          {
            question: "Does submitting a property guarantee publication?",
            answer:
              "No. The property may require review, documents, corrections, verification, policy acceptance, or payment.",
          },
        ]}
        featureSections={[
          {
            eyebrow: "Client representation",
            heading: "Keep every property connected to clear authority.",
            description:
              "A property-agent profile does not create authority to act for a particular property. Authority should be reviewed and linked to the relevant record.",
            items: [
              "Client name and type",
              "Agency agreement or instruction to market",
              "Authority start and expiry dates",
              "Sole or multiple agency status",
              "Owner, company, submission, and listing links",
              "Protected agency agreements and private client instructions",
            ],
          },
          {
            eyebrow: "Listing quality",
            heading: "Track every submission through review.",
            description:
              "Submitted properties may require review before publication or restricted access is granted.",
            items: [
              "Draft, submitted, under review, correction required, and approved states",
              "Authority, client identity, and supporting documents",
              "Public and private data separation",
              "Listing standards, media, pricing, occupancy, and compliance checks",
              "Affected section, reason, missing information, and next action",
            ],
          },
          {
            eyebrow: "Property opportunity matching",
            heading: "Present approved properties to suitable buyers.",
            description:
              "Approved properties may be shown to public visitors, authenticated users, verified investors, selected buyers, or payment-approved users depending on visibility rules.",
            items: [
              "Public preview, authenticated access, and verified-investor access",
              "Investor budget, location, strategy, and readiness signals",
              "AI-assisted matching explanations",
              "Protected owner, tenant, payment, reservation, and restricted AI information",
            ],
          },
        ]}
        finalCtaDescription="Set up your agent profile, confirm your authority, submit client properties, and track opportunities through review, publication, enquiry, viewing, reservation, and eligible transaction stages."
        finalCtaHeading="Create your property agent account."
        journey={[
          {
            title: "Create a property agent account",
            description:
              "Start through ordinary public signup and choose property agent as your first role.",
          },
          {
            title: "Complete agent profile setup",
            description:
              "Add relevant company, agency, and business profile information.",
          },
          {
            title: "Add represented properties",
            description:
              "Prepare property records and connect them to representation context.",
          },
          {
            title: "Submit authority information",
            description:
              "Upload or update authority-related information through protected document workflows.",
          },
          {
            title: "Manage listing visibility",
            description:
              "Move listings through draft, review, correction, approval, or marketplace visibility.",
          },
          {
            title: "Continue with enquiries",
            description:
              "Use supported workflows for conversations, bookings, viewing requests, and listing updates.",
          },
        ]}
        journeyDescription="Agent workflows connect company setup, represented stock, authority evidence, listing visibility, and enquiries."
        journeyHeading="From representation setup to listing activity."
        primaryAction={{ label: "Create a property agent account", href: "/auth/sign-up" }}
        safetyDescription="Authority and owner data should stay protected while public previews remain useful for discovery."
        safetyHeading="Authority-aware workflows without public leakage."
        safetyNotes={[
          "Authority documents should stay protected and should not appear on public listing previews.",
          "Owner or seller private contact details should not be exposed publicly.",
          "Document submission does not automatically mean authority approval.",
          "Frontend access does not override secure verification, review, or permission checks.",
        ]}
        secondaryAction={{ label: "Submit a property", href: "/dashboard/properties/new" }}
        supportingCopy="Create your agent profile, confirm your authority to represent clients, provide structured property information, and track opportunities through review, publication, enquiry, reservation, and completion stages."
        title="Manage property opportunities with greater structure."
        trustIndicators={[
          "Client authority and representation records",
          "Structured property submissions",
          "Role-based property management",
          "Controlled access to private information",
          "Relevant investor opportunity matching",
        ]}
        workflowDescription="Agent workflows keep company context, represented properties, authority evidence, and user interactions organized."
        workflowEyebrow="Agent workflow"
        workflowHeading="Keep representation, listing, and authority details in one structured path."
        workflowItems={[
          "Company or agency context",
          "Represented property records",
          "Authority or instruction evidence",
          "Listing title and public description",
          "Viewing or booking context",
          "Enquiry and conversation flow",
          "Document status updates",
          "Listing review or correction state",
        ]}
      />
    </>
  );
}
