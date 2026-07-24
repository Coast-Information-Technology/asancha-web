// File: app/(public)/solutions/service-providers/page.tsx

import type { Metadata } from "next";

import { JsonLd } from "@/src/components/seo/json-ld";
import { createPublicPageJsonLdBundle } from "@/src/lib/seo/json-ld";

import { SolutionPageExperience } from "../_components/solution-page-experience";

export const metadata: Metadata = {
  title: "For Service Providers | Asancha",
  description:
    "Learn how service providers can present property-related services, manage service areas, availability, bookings, documents, verification, and payments on Asancha.",
  alternates: {
    canonical: "/solutions/service-providers",
  },
  openGraph: {
    title: "For Service Providers | Asancha",
    description:
      "See how Asancha helps property-related service providers manage service profiles, availability, bookings, documents, verification, and payment-aware workflows.",
    url: "/solutions/service-providers",
    type: "website",
  },
};

export default function ServiceProvidersSolutionPage() {
  const jsonLd = createPublicPageJsonLdBundle({
    path: "/solutions/service-providers",
    name: "Asancha for Service Providers",
    description:
      "Learn how service providers can present property-related services, manage service areas, availability, bookings, documents, verification, and payments on Asancha.",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Solutions", path: "/solutions/service-providers" },
      { name: "Service Providers", path: "/solutions/service-providers" },
    ],
  });

  return (
    <>
      <JsonLd data={jsonLd} id="service-providers-json-ld" />
      <SolutionPageExperience
        benefits={[
          {
            title: "Present your service profile",
            description:
              "Explain what you offer, where you operate, and how users can engage.",
            icon: "briefcase",
          },
          {
            title: "Manage service areas",
            description:
              "Define the locations or coverage areas where your services may be available.",
            icon: "building",
          },
          {
            title: "Organize availability and bookings",
            description:
              "Support booking workflows with clearer availability, status, and next steps.",
            icon: "booking",
          },
          {
            title: "Handle documents and verification",
            description:
              "Provide required documents or verification information through protected workflows.",
            icon: "document",
          },
        ]}
        benefitsDescription="Asancha helps property-related service providers organize their profile, service information, coverage areas, availability, bookings, documents, and payment-aware activity."
        benefitsHeading="Present your services with clearer structure and safer workflows."
        description="Asancha supports service providers with profile setup, service listings, service areas, availability, bookings, conversations, documents, verification, and payment-aware workflows."
        eyebrow="For service providers"
        finalCtaDescription="Create a public account, choose service provider as your role, and continue into service setup, availability, and booking workflows."
        finalCtaHeading="Ready to present your property-related services?"
        journey={[
          {
            title: "Create a service provider account",
            description:
              "Start through ordinary public signup and choose service provider as your first role.",
          },
          {
            title: "Complete provider profile setup",
            description:
              "Add business, contact, service, and operating information.",
          },
          {
            title: "Create service listings",
            description:
              "Prepare service information, pricing guidance where allowed, areas, and availability.",
          },
          {
            title: "Submit documents when required",
            description:
              "Upload required documents through protected workflows when review is needed.",
          },
          {
            title: "Manage bookings and conversations",
            description:
              "Respond to booking activity, user enquiries, and service conversations.",
          },
          {
            title: "Track payment-aware actions",
            description:
              "Follow references, proof review states, and confirmed payment statuses.",
          },
        ]}
        journeyDescription="Service provider workflows connect profile setup, listings, availability, bookings, documents, conversations, and payments."
        journeyHeading="From service profile to booking-aware workflows."
        primaryAction={{ label: "Start as a service provider", href: "/auth/sign-up" }}
        safetyDescription="Service pages should explain provider workflows without exposing private booking details, payment data, or restricted user information."
        safetyHeading="Visible services, protected booking and payment details."
        safetyNotes={[
          "Private booking details should not be exposed on public pages.",
          "Payment proof submission does not automatically mean payment approval.",
          "Provider documents should remain protected behind approved workflows.",
          "Frontend visibility does not override secure verification, booking, or payment checks.",
        ]}
        secondaryAction={{ label: "See how it works", href: "/how-it-works" }}
        supportingCopy="The service provider journey helps users understand what you offer while keeping private booking details, documents, payment information, and restricted data protected."
        title="Offer property-related services through a clearer platform workflow."
        workflowDescription="Service workflow data helps users understand coverage and availability while protected booking and payment details stay private."
        workflowEyebrow="Service workflow"
        workflowHeading="Organize service details, availability, documents, and booking status."
        workflowItems={[
          "Service category",
          "Service description",
          "Coverage areas",
          "Availability context",
          "Booking status",
          "Verification status",
          "Document requirements",
          "Payment-aware workflow status",
        ]}
      />
    </>
  );
}
