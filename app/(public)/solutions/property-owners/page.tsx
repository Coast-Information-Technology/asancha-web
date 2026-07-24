// File: app/(public)/solutions/property-owners/page.tsx

import type { Metadata } from "next";

import { JsonLd } from "@/src/components/seo/json-ld";
import { createPublicPageJsonLdBundle } from "@/src/lib/seo/json-ld";

import { SolutionPageExperience } from "../_components/solution-page-experience";

export const metadata: Metadata = {
  title: "For Property Owners | Asancha",
  description:
    "Learn how property owners can use Asancha to prepare property information, manage listings, upload documents, and follow verification-aware workflows.",
  alternates: {
    canonical: "/solutions/property-owners",
  },
  openGraph: {
    title: "For Property Owners | Asancha",
    description:
      "See how Asancha helps property owners prepare property information, manage listings, upload documents, and follow verification-aware workflows.",
    url: "/solutions/property-owners",
    type: "website",
  },
};

export default function PropertyOwnersSolutionPage() {
  const jsonLd = createPublicPageJsonLdBundle({
    path: "/solutions/property-owners",
    name: "Asancha for Property Owners",
    description:
      "Learn how property owners can use Asancha to prepare property information, manage listings, upload documents, and follow verification-aware workflows.",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Solutions", path: "/solutions/property-owners" },
      { name: "Property Owners", path: "/solutions/property-owners" },
    ],
  });

  return (
    <>
      <JsonLd data={jsonLd} id="property-owners-json-ld" />
      <SolutionPageExperience
        benefits={[
          {
            title: "Prepare property information",
            description:
              "Organize key details before a listing moves into review or publication.",
            icon: "building",
          },
          {
            title: "Manage listing progress",
            description:
              "Track draft, review, correction, approval, and public-safe visibility states.",
            icon: "clipboard",
          },
          {
            title: "Respond to document needs",
            description:
              "Upload or update required documents through protected workflows.",
            icon: "document",
          },
          {
            title: "Connect through safer workflows",
            description:
              "Use guided actions for enquiries, viewing steps, reservations, and conversations.",
            icon: "message",
          },
        ]}
        benefitsDescription="Asancha gives property owners a clearer way to prepare property information, understand requirements, and continue through safe listing workflows."
        benefitsHeading="Manage property readiness with more structure."
        description="Asancha helps property owners prepare property information, manage listing progress, upload required documents, and follow review or verification steps where needed."
        eyebrow="For property owners"
        finalCtaDescription="Create a public account, choose property owner as your role, and continue into the right property setup workflow."
        finalCtaHeading="Ready to prepare your property on Asancha?"
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
            title: "Prepare property details",
            description:
              "Provide location context, property type, summary, and listing-ready details.",
          },
          {
            title: "Submit documents when required",
            description:
              "Provide documents through protected upload flows for review or verification.",
          },
          {
            title: "Follow review steps",
            description:
              "Respond to correction, approval, or additional information requests.",
          },
          {
            title: "Manage next-step activity",
            description:
              "Continue with enquiries, bookings, conversations, updates, and status changes.",
          },
        ]}
        journeyDescription="Property owner workflows may include profile setup, property records, documents, review states, publication, and ongoing listing management."
        journeyHeading="From account setup to listing progress."
        primaryAction={{ label: "Start as a property owner", href: "/auth/sign-up" }}
        safetyDescription="Public listing previews should be useful without exposing sensitive owner or property information."
        safetyHeading="Useful public previews, protected owner records."
        safetyNotes={[
          "Public marketplace previews should not reveal sensitive property documents.",
          "Owner private contact details should remain protected unless released through approved workflows.",
          "Document submission does not automatically mean approval.",
          "Frontend visibility does not override secure review, verification, or publication rules.",
        ]}
        secondaryAction={{ label: "See how it works", href: "/how-it-works" }}
        supportingCopy="The owner journey makes listing preparation more organized while keeping sensitive documents, owner details, and review notes protected."
        title="Present your property through a clearer, safer listing workflow."
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
