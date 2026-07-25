// File: app/(public)/solutions/property-owners/page.tsx

import type { Metadata } from "next";

import { JsonLd } from "@/src/components/seo/json-ld";
import { createPropertyOwnerSolutionsPageJsonLd } from "@/src/lib/seo/json-ld";

import { SolutionPageExperience } from "../_components/solution-page-experience";

export const metadata: Metadata = {
  metadataBase: new URL("https://asancha.co.uk"),
  title: {
    absolute: "Property Owner Solutions | Submit and Manage Property | Asancha",
  },
  description:
    "Create an Asancha property-owner account to submit property, provide ownership documents, track review, manage listings, and present approved opportunities to relevant UK buyers.",
  keywords: [
    "property owner solutions",
    "submit property UK",
    "sell property through Asancha",
    "property submission platform",
    "property listing management UK",
    "property owner platform",
    "list investment property UK",
    "property marketplace for owners",
    "property ownership verification",
    "property document review",
    "property listing approval",
    "property seller platform UK",
    "property opportunity submission",
    "property owner dashboard",
    "AI property intelligence",
    "property investor matching",
    "property listing verification",
    "manage property listings",
    "UK property sourcing platform",
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
    title: "Property Owner Solutions | Submit and Manage Property | Asancha",
    description:
      "Submit property, provide ownership information, track review, manage approved listings, and connect opportunities with relevant UK buyers through Asancha.",
    images: [
      {
        url: "/images/og/asancha-property-owners-og.jpg",
        secureUrl:
          "https://asancha.co.uk/images/og/asancha-property-owners-og.jpg",
        width: 1200,
        height: 630,
        alt: "Asancha property owner solutions for submitting, reviewing and managing UK property opportunities",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Property Owner Solutions | Submit and Manage Property | Asancha",
    description:
      "Create a property-owner account, submit your property, track review, and present approved opportunities to relevant UK buyers through Asancha.",
    images: [
      {
        url: "/images/og/asancha-property-owners-og.jpg",
        alt: "Asancha property submission and listing-management solutions for UK property owners",
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
      <SolutionPageExperience
        benefits={[
          {
            title: "Clearer property information",
            description:
              "Present the property using consistent, organised details that are easier to review.",
            icon: "building",
          },
          {
            title: "Controlled information sharing",
            description:
              "Separate safe public information from sensitive documents and private seller details.",
            icon: "lock",
          },
          {
            title: "Visible review progress",
            description:
              "Understand whether a property is pending, under review, approved, published, or awaiting action.",
            icon: "document",
          },
          {
            title: "Connected property actions",
            description:
              "Keep documents, enquiries, bookings, payments, reservations, and messages linked to the property.",
            icon: "message",
          },
        ]}
        benefitsDescription="Asancha helps owners organise submissions, protect sensitive information, track review, and present approved opportunities to relevant buyers."
        benefitsHeading="A more structured way to present property."
        challengeDescription="A property listing may begin with a title, price, photographs, and description, but serious buyers often need more information before deciding whether to progress."
        challengeEyebrow="Why property owners need better structure"
        challengeHeading="Selling or presenting a property involves more than posting an advert."
        challenges={[
          {
            title: "Incomplete property information",
            description:
              "Important details may be missing, inconsistent, or difficult for buyers to understand.",
          },
          {
            title: "Sensitive information shared too early",
            description:
              "Ownership records, tenant information, private documents, and seller details should not be publicly visible by default.",
          },
          {
            title: "Unclear review progress",
            description:
              "Owners need to know whether a property is pending, under review, approved, published, or awaiting correction.",
          },
          {
            title: "Disconnected communication",
            description:
              "Questions from agents, sourcers, buyers, service providers, and reviewers can otherwise happen across different channels.",
          },
        ]}
        description="Asancha helps property owners submit, organise, review, and present property opportunities to relevant buyers and property professionals."
        eyebrow="For property owners"
        faqs={[
          {
            question: "Can I submit a property before creating an account?",
            answer:
              "No. Property submission requires a property-owner, property-agent, or property-sourcer profile, depending on who is submitting and their authority.",
          },
          {
            question: "Does submitting a property mean it will be published?",
            answer:
              "No. A property may require review, supporting documents, corrections, policy acceptance, verification, or payment before publication.",
          },
          {
            question: "Can I submit a property I do not own?",
            answer:
              "Only where you have lawful authority to represent the owner. You may need to provide evidence of authority.",
          },
          {
            question: "Will my full address appear publicly?",
            answer:
              "Not necessarily. Address visibility should depend on listing settings, privacy requirements, property status, and administrative approval.",
          },
          {
            question: "Can Asancha guarantee a buyer?",
            answer:
              "No. Asancha supports property presentation, matching, communication, and structured workflows but does not guarantee buyer interest, an offer, exchange, or completion.",
          },
          {
            question: "Can I update or withdraw my property?",
            answer:
              "Where permitted, you can request updates or withdrawal. Some changes may require another review and withdrawal can depend on property status or active obligations.",
          },
        ]}
        featureSections={[
          {
            eyebrow: "Property submission",
            heading: "Provide the information buyers need to understand the opportunity.",
            description:
              "Property owners can submit property information through a structured form that separates public information from restricted information.",
            items: [
              "Property title, type, town or city, and postcode",
              "Bedrooms, bathrooms, tenure, and occupancy status",
              "Asking price, listing category, and description",
              "Key features and public media",
              "Current rent, expected rent, yield, and return indicators where relevant",
              "Refurbishment requirements, tenancy status, and investment strategy",
            ],
          },
          {
            eyebrow: "Property authority",
            heading: "Confirm your right to submit the property.",
            description:
              "Asancha may require evidence showing that the person or company submitting a property has the right to do so.",
            items: [
              "Proof of ownership",
              "Land Registry information",
              "Company ownership records",
              "Joint-owner authority",
              "Authority to represent",
              "Executor or trustee evidence",
              "Agent instruction or property-management authority",
              "Replacement or clarification requests where needed",
            ],
          },
          {
            eyebrow: "Controlled visibility",
            heading: "Decide what can be shown and what must remain protected.",
            description:
              "Property submissions may contain both public and sensitive information, and Asancha should separate these categories clearly.",
            items: [
              "Public previews with general location and safe high-level indicators",
              "Authenticated listings with additional approved information",
              "Verified-investor access for restricted details",
              "Payment-gated access where applicable",
              "Private opportunities shown only to selected or approved users",
              "Protected ownership documents, tenant details, records, and private deal packs",
            ],
          },
        ]}
        finalCtaDescription="Create a public account, choose property owner as your role, and continue into the right property setup workflow."
        finalCtaHeading="Create your property owner account."
        journey={[
          {
            title: "Create a property owner account",
            description:
              "Start with ordinary public signup and select property owner as your first role.",
          },
          {
            title: "Complete owner profile setup",
            description:
              "Add the profile information needed to support owner workflows.",
          },
          {
            title: "Complete property owner onboarding",
            description:
              "Provide information about your ownership role and intended property activity.",
          },
          {
            title: "Submit your property",
            description:
              "Enter property details, media, financial information, occupancy, and supporting information.",
          },
          {
            title: "Provide authority evidence",
            description:
              "Upload required documents showing your right to submit the property.",
          },
          {
            title: "Track review and progress",
            description:
              "Respond to correction requests, publication status, enquiries, bookings, and reservations.",
          },
        ]}
        journeyDescription="The owner route connects account setup, authority, property details, review, publication, enquiries, bookings, and progress tracking."
        journeyHeading="From property owner profile to property progress."
        primaryAction={{
          label: "Create a property owner account",
          href: "/auth/sign-up",
        }}
        safetyDescription="Public listing previews should be useful without exposing sensitive owner or property information."
        safetyHeading="Useful public previews, protected owner records."
        safetyNotes={[
          "Public marketplace previews should not reveal sensitive property documents.",
          "Owner private contact details should remain protected unless released through approved workflows.",
          "Document submission does not automatically mean approval.",
          "Frontend visibility does not override secure review, verification, or publication rules.",
        ]}
        secondaryAction={{
          label: "Submit your property",
          href: "/dashboard/properties/new",
        }}
        supportingCopy="Create your property-owner account, provide clear property information, upload required documents, and track your property from submission through review, publication, enquiry, reservation, and completion stages."
        title="Present your property through a more structured process."
        trustIndicators={[
          "Structured property submissions",
          "Controlled access to sensitive information",
          "Ownership and authority review",
          "Visible property status",
          "Relevant buyer and investor exposure",
        ]}
        workflowDescription="A well-prepared property record helps the platform understand what can be shown publicly, what needs review, and what should remain protected."
        workflowEyebrow="Property information"
        workflowHeading="Prepare the details that help a property move through the right workflow."
        workflowItems={[
          "Property type",
          "Location summary",
          "Listing title and description",
          "Ownership or authority context",
          "Availability or viewing context",
          "Supporting documents where required",
          "Public-safe listing information",
          "Status and correction updates",
        ]}
      />
    </>
  );
}
