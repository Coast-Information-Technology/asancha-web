// File: app/(public)/solutions/investors/page.tsx

import type { Metadata } from "next";

import { JsonLd } from "@/src/components/seo/json-ld";
import { createPublicPageJsonLdBundle } from "@/src/lib/seo/json-ld";

import { SolutionPageExperience } from "../_components/solution-page-experience";

export const metadata: Metadata = {
  title: "For Investors | Asancha",
  description:
    "Explore how Asancha supports investors with public marketplace discovery, investor preferences, saved opportunities, verification-aware workflows, and safe AI-assisted guidance.",
  alternates: {
    canonical: "/solutions/investors",
  },
  openGraph: {
    title: "For Investors | Asancha",
    description:
      "Discover how Asancha helps investors explore property opportunities, set preferences, save listings, and continue through verification-aware workflows.",
    url: "/solutions/investors",
    type: "website",
  },
};

export default function InvestorsSolutionPage() {
  const jsonLd = createPublicPageJsonLdBundle({
    path: "/solutions/investors",
    name: "Asancha for Investors",
    description:
      "Explore how Asancha supports investors with public marketplace discovery, investor preferences, saved opportunities, verification-aware workflows, and safe AI-assisted guidance.",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Solutions", path: "/solutions/investors" },
      { name: "Investors", path: "/solutions/investors" },
    ],
  });

  return (
    <>
      <JsonLd data={jsonLd} id="investors-json-ld" />
      <SolutionPageExperience
        benefits={[
          {
            title: "Browse public-safe opportunities",
            description:
              "Explore property previews before accessing restricted or deal-sensitive information.",
            icon: "search",
          },
          {
            title: "Set investor preferences",
            description:
              "Capture location, budget, strategy, timeline, and opportunity preferences.",
            icon: "sliders",
          },
          {
            title: "Save and compare listings",
            description:
              "Keep opportunities organized and return when you are ready to act.",
            icon: "investor",
          },
          {
            title: "Move through verified actions",
            description:
              "Higher-trust actions can depend on setup, verification, review, or approval.",
            icon: "shield",
          },
        ]}
        benefitsDescription="Asancha supports the investor journey from public discovery to preferences, saved listings, verification-aware actions, and explainable guidance."
        benefitsHeading="A clearer way to explore and manage property opportunities."
        description="Asancha helps investors browse public-safe property previews, set investment preferences, save opportunities, and continue into verification-aware workflows when required."
        eyebrow="For investors"
        finalCtaDescription="Browse public opportunities first, then create an investor account when you are ready to save, compare, or continue."
        finalCtaHeading="Ready to explore opportunities with better structure?"
        journey={[
          {
            title: "Start with marketplace discovery",
            description:
              "Browse public previews and understand available opportunity types.",
          },
          {
            title: "Create an investor profile",
            description:
              "Complete setup so the platform can understand your criteria and readiness.",
          },
          {
            title: "Review matched opportunities",
            description:
              "Use preferences, saved listings, and guidance to compare options more clearly.",
          },
          {
            title: "Continue into protected workflows",
            description:
              "Complete verification, payment review, reservation, messaging, or document steps when needed.",
          },
        ]}
        journeyDescription="Investor workflows connect discovery, preferences, saved listings, verification, and guided next actions."
        journeyHeading="From public previews to more confident next steps."
        primaryAction={{ label: "Browse marketplace", href: "/marketplace" }}
        safetyDescription="Marketplace previews and AI-supported guidance should help decision-making without implying guaranteed returns or approved access."
        safetyHeading="Useful investor guidance without false certainty."
        safetyNotes={[
          "Public previews are not full deal packs.",
          "AI guidance is not financial, legal, or investment advice.",
          "Payment proof submission is not payment approval.",
          "Visible frontend actions do not override backend approval checks.",
        ]}
        secondaryAction={{ label: "Start as an investor", href: "/auth/sign-up" }}
        supportingCopy="The investor journey is shaped around goals, readiness, preferences, and the level of access required for each action."
        title="Discover property opportunities with clearer investor workflows."
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
