// File: app/(public)/solutions/property-agents/page.tsx

import type { Metadata } from "next";

import { JsonLd } from "@/src/components/seo/json-ld";
import { createPublicPageJsonLdBundle } from "@/src/lib/seo/json-ld";

import { SolutionPageExperience } from "../_components/solution-page-experience";

export const metadata: Metadata = {
  title: "For Property Agents | Asancha",
  description:
    "Learn how property agents can manage represented properties, listings, authority documents, bookings, and conversations on Asancha.",
  alternates: {
    canonical: "/solutions/property-agents",
  },
  openGraph: {
    title: "For Property Agents | Asancha",
    description:
      "See how Asancha helps property agents manage represented properties, listing workflows, authority documents, bookings, and conversations.",
    url: "/solutions/property-agents",
    type: "website",
  },
};

export default function PropertyAgentsSolutionPage() {
  const jsonLd = createPublicPageJsonLdBundle({
    path: "/solutions/property-agents",
    name: "Asancha for Property Agents",
    description:
      "Learn how property agents can manage represented properties, listings, authority documents, bookings, and conversations on Asancha.",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Solutions", path: "/solutions/property-agents" },
      { name: "Property Agents", path: "/solutions/property-agents" },
    ],
  });

  return (
    <>
      <JsonLd data={jsonLd} id="property-agents-json-ld" />
      <SolutionPageExperience
        benefits={[
          {
            title: "Manage represented properties",
            description:
              "Keep represented stock connected to the right company or agency context.",
            icon: "building",
          },
          {
            title: "Prepare listing workflows",
            description:
              "Create public-safe property listing information through structured workflows.",
            icon: "clipboard",
          },
          {
            title: "Handle authority evidence",
            description:
              "Provide authority context or documents through protected workflows when requested.",
            icon: "agent",
          },
          {
            title: "Support bookings and conversations",
            description:
              "Continue into viewing, enquiry, booking, and conversation flows when allowed.",
            icon: "booking",
          },
        ]}
        benefitsDescription="Asancha helps property agents organize representation, authority information, listing activity, and user interactions without exposing sensitive information publicly."
        benefitsHeading="Manage represented properties with clearer platform structure."
        description="Asancha supports property agents with company context, represented properties, listing workflows, authority documents, bookings, and conversations."
        eyebrow="For property agents"
        finalCtaDescription="Create a public account, choose property agent as your role, and continue into representation-aware setup."
        finalCtaHeading="Ready to manage represented properties with more clarity?"
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
        primaryAction={{ label: "Start as a property agent", href: "/auth/sign-up" }}
        safetyDescription="Authority and owner data should stay protected while public previews remain useful for discovery."
        safetyHeading="Authority-aware workflows without public leakage."
        safetyNotes={[
          "Authority documents should stay protected and should not appear on public listing previews.",
          "Owner or seller private contact details should not be exposed publicly.",
          "Document submission does not automatically mean authority approval.",
          "Frontend access does not override secure verification, review, or permission checks.",
        ]}
        secondaryAction={{ label: "See how it works", href: "/how-it-works" }}
        supportingCopy="The agent journey makes representation clearer while keeping authority documents, owner details, and review decisions protected."
        title="Represent properties with clearer authority and listing context."
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
