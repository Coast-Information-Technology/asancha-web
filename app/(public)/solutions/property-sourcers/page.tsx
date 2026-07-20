// File: app/(public)/solutions/property-sourcers/page.tsx

import type { Metadata } from "next";

import { JsonLd } from "@/src/components/seo/json-ld";
import { createPublicPageJsonLdBundle } from "@/src/lib/seo/json-ld";

import { SolutionPageExperience } from "../_components/solution-page-experience";

export const metadata: Metadata = {
  title: "For Property Sourcers | Asancha",
  description:
    "Learn how property sourcers can submit opportunities, prepare deal information, manage compliance-aware workflows, and track performance on Asancha.",
  alternates: {
    canonical: "/solutions/property-sourcers",
  },
  openGraph: {
    title: "For Property Sourcers | Asancha",
    description:
      "See how Asancha helps property sourcers submit opportunities, prepare structured deal information, and follow compliance-aware workflows.",
    url: "/solutions/property-sourcers",
    type: "website",
  },
};

export default function PropertySourcersSolutionPage() {
  const jsonLd = createPublicPageJsonLdBundle({
    path: "/solutions/property-sourcers",
    name: "Asancha for Property Sourcers",
    description:
      "Learn how property sourcers can submit opportunities, prepare deal information, manage compliance-aware workflows, and track performance on Asancha.",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Solutions", path: "/solutions/property-sourcers" },
      { name: "Property Sourcers", path: "/solutions/property-sourcers" },
    ],
  });

  return (
    <>
      <JsonLd data={jsonLd} id="property-sourcers-json-ld" />
      <SolutionPageExperience
        benefits={[
          {
            title: "Submit sourced opportunities",
            description:
              "Prepare opportunities so they can move through review and visibility workflows.",
            icon: "search",
          },
          {
            title: "Organize deal information",
            description:
              "Keep opportunity details, supporting context, and documents connected.",
            icon: "document",
          },
          {
            title: "Follow compliance-aware steps",
            description:
              "Respond when additional information, correction, verification, or review is needed.",
            icon: "shield",
          },
          {
            title: "Track workflow progress",
            description:
              "Understand draft, review, correction, approval, restricted, and unavailable states.",
            icon: "investor",
          },
        ]}
        benefitsDescription="Asancha supports opportunity preparation, structured submission, document-aware workflows, review states, and safer investor-facing access where approved."
        benefitsHeading="Bring sourced opportunities into a clearer platform process."
        description="Asancha helps property sourcers prepare opportunity information, organize supporting details, follow review requirements, and move through safer platform workflows."
        eyebrow="For property sourcers"
        finalCtaDescription="Create a public account, choose property sourcer as your role, and continue into a structured opportunity submission workflow."
        finalCtaHeading="Ready to submit opportunities with better structure?"
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
        primaryAction={{ label: "Start as a property sourcer", href: "/auth/sign-up" }}
        safetyDescription="Sourced opportunity pages need strong boundaries around private deal packs, investor data, and claims about outcomes."
        safetyHeading="Compliance-aware submission without guaranteed outcomes."
        safetyNotes={[
          "Sourced opportunities should not expose private deal packs publicly.",
          "Investor private data should not be visible unless released through approved workflows.",
          "Submission does not automatically mean approval or publication.",
          "Asancha does not guarantee investor interest, funding, resale, rental, or completion outcomes.",
        ]}
        secondaryAction={{ label: "See how it works", href: "/how-it-works" }}
        supportingCopy="The sourcer journey makes submitted opportunities clearer and easier to review while protecting private deal information, investor data, and internal compliance notes."
        title="Submit sourced opportunities through a structured, compliance-aware workflow."
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
