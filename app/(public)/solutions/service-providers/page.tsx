// File: app/(public)/solutions/service-providers/page.tsx

import type { Metadata } from "next";

import { JsonLd } from "@/src/components/seo/json-ld";
import { createServiceProviderSolutionsPageJsonLd } from "@/src/lib/seo/json-ld";

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
      <SolutionPageExperience
        benefits={[
          {
            title: "Relevant property enquiries",
            description:
              "Receive service requests connected to appropriate property users and opportunities.",
            icon: "briefcase",
          },
          {
            title: "Professional profile",
            description:
              "Present your services, coverage, qualifications, and approved credentials clearly.",
            icon: "building",
          },
          {
            title: "Structured bookings",
            description:
              "Coordinate consultations, inspections, visits, and professional appointments.",
            icon: "booking",
          },
          {
            title: "Controlled information access",
            description:
              "Protect sensitive client, property, document, payment, and communication information.",
            icon: "document",
          },
        ]}
        benefitsDescription="Asancha helps approved providers connect enquiries, property context, bookings, quotes, payments, conversations, and documents to the relevant service request."
        benefitsHeading="A more structured way to support property users."
        challengeDescription="Property decisions often involve several professionals, but service information can become fragmented across messages, documents, phone calls, and separate systems."
        challengeEyebrow="Why property professionals need better connections"
        challengeHeading="Property services should be connected to the opportunity."
        challenges={[
          {
            title: "Limited access to relevant enquiries",
            description:
              "Professionals may receive enquiries that do not match their services, area, capacity, or expertise.",
          },
          {
            title: "Incomplete client information",
            description:
              "A service request may arrive without enough property context or clear requirements.",
          },
          {
            title: "Sensitive property information",
            description:
              "Property documents, client information, financial details, and legal records must be shared carefully.",
          },
          {
            title: "Unclear service progress",
            description:
              "Providers and clients need to know whether an enquiry is new, accepted, booked, in progress, completed, or cancelled.",
          },
        ]}
        description="Asancha helps property professionals and service businesses present their expertise, complete relevant verification steps, and participate in property-related workflows."
        eyebrow="For property service providers"
        faqs={[
          {
            question: "Who can create a service-provider account?",
            answer:
              "Individuals and companies providing approved property-related services may apply. Approval may depend on category, qualifications, insurance, documents, and business requirements.",
          },
          {
            question: "Does creating an account approve my services?",
            answer:
              "No. Your profile, service categories, qualifications, company, insurance, and supporting documents may require review.",
          },
          {
            question: "Will my private documents appear publicly?",
            answer:
              "No. Identity, insurance, registration, compliance, and other sensitive documents should remain restricted.",
          },
          {
            question: "Does Asancha guarantee client enquiries?",
            answer:
              "No. Asancha may help connect relevant property users and approved providers, but it does not guarantee enquiries, bookings, revenue, or completed work.",
          },
        ]}
        featureSections={[
          {
            eyebrow: "Your professional expertise",
            heading: "Define the property services you offer.",
            description:
              "Service providers should select only categories they are qualified, insured, authorised, and able to deliver.",
            items: [
              "Legal, conveyancing, contract, title, and lease support",
              "Mortgage, bridging, development finance, and funding-readiness support",
              "Survey, inspection, valuation, refurbishment, construction, and planning",
              "Property management, accounting, tax, insurance, photography, and floor plans",
              "Service areas, availability, response process, and delivery method",
            ],
          },
          {
            eyebrow: "Professional verification",
            heading: "Support your profile with relevant evidence.",
            description:
              "Some services require qualifications, professional registration, licensing, insurance, or other supporting evidence before service categories or actions are approved.",
            items: [
              "Identity and proof of address",
              "Company registration documents",
              "Professional qualification, licence, registration, or membership",
              "Professional indemnity, public liability, and employer liability insurance",
              "Pending, in review, approved, rejected, expired, or replacement-required statuses",
            ],
          },
          {
            eyebrow: "Property-linked opportunities",
            heading: "Connect with users who need your expertise.",
            description:
              "Approved providers may receive enquiries from investors, owners, agents, sourcers, or Asancha where service category, location, availability, and qualifications are relevant.",
            items: [
              "Property-specific service requests",
              "Bookings, consultations, inspections, and visits",
              "Quotes, proposals, scopes, terms, and validity periods",
              "Traceable service payments and payment references",
              "Structured conversations and controlled document access",
            ],
          },
        ]}
        finalCtaDescription="Set up your professional profile, define the services you offer, provide the required supporting information, and connect with relevant property users and opportunities through a structured platform."
        finalCtaHeading="Create your service provider account."
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
        primaryAction={{
          label: "Create a service provider account",
          href: "/auth/sign-up",
        }}
        safetyDescription="Service pages should explain provider workflows without exposing private booking details, payment data, or restricted user information."
        safetyHeading="Visible services, protected booking and payment details."
        safetyNotes={[
          "Private booking details should not be exposed on public pages.",
          "Payment proof submission does not automatically mean payment approval.",
          "Provider documents should remain protected behind approved workflows.",
          "Frontend visibility does not override secure verification, booking, or payment checks.",
        ]}
        secondaryAction={{ label: "List your property services", href: "/dashboard/services" }}
        supportingCopy="Create your service-provider profile, define the services you offer, provide supporting information, and connect with investors, owners, agents, sourcers, and approved property opportunities where your expertise may be needed."
        title="Connect your property services with relevant opportunities."
        trustIndicators={[
          "Role-specific professional profile",
          "Qualification and document review",
          "Property-linked service enquiries",
          "Controlled access to sensitive information",
          "Structured bookings and communication",
        ]}
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
