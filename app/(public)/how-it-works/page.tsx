// File: app/(public)/how-it-works/page.tsx

/**
 * Asancha How It Works Page
 *
 * Purpose:
 * Explains the public user journey across discovery, signup, onboarding,
 * verification-aware workflows, payments, AI guidance, and API partner access.
 *
 * Main responsibilities:
 * - Explain Asancha public flow clearly
 * - Reduce confusion around locked actions
 * - Reinforce backend-controlled verification/payment/approval rules
 * - Render safe public WebPage and BreadcrumbList JSON-LD
 *
 * Security note:
 * This page must not expose internal backend logic, admin review notes,
 * private documents, payment internals, API keys, or private system details.
 */

import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/src/components/seo/json-ld";
import { createPublicPageJsonLdBundle } from "@/src/lib/seo/json-ld";

export const metadata: Metadata = {
  title: "How Asancha Works",
  description:
    "Understand how Asancha supports public marketplace browsing, signup, onboarding, verification-aware workflows, payments, AI guidance, and API partner applications.",
  alternates: {
    canonical: "/how-it-works",
  },
};

const steps = [
  {
    title: "Browse public-safe marketplace previews",
    description:
      "Guests can explore public listing previews and role education without accessing restricted deal data.",
  },
  {
    title: "Choose the right public role",
    description:
      "Investors, owners, agents, sourcers, and service providers continue through role-specific setup.",
  },
  {
    title: "Complete account and profile setup",
    description:
      "Account identity, policy acceptance, general profile, and role-specific onboarding are kept clear.",
  },
  {
    title: "Respond to verification and document needs",
    description:
      "Where verification is required, users see safe status messages and clear correction guidance.",
  },
  {
    title: "Use payment references where needed",
    description:
      "Payment proof submission is not final approval. The platform shows review status and next actions.",
  },
  {
    title: "Receive guidance, not guarantees",
    description:
      "AI recommendations can explain matches and warnings, but do not guarantee financial, legal, or investment outcomes.",
  },
] as const;

/**
 * Renders the How It Works page.
 */
export default function HowItWorksPage() {
  const jsonLd = createPublicPageJsonLdBundle({
    path: "/how-it-works",
    name: "How Asancha Works",
    description:
      "Understand how Asancha supports public marketplace browsing, signup, onboarding, verification-aware workflows, payments, AI guidance, and API partner applications.",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "How It Works", path: "/how-it-works" },
    ],
  });

  return (
    <>
      <JsonLd data={jsonLd} id="how-it-works-json-ld" />

      <main>
        <section className="asancha-page-container py-16 sm:py-24">
          <div className="max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-wide text-blue-700">
              How it works
            </p>

            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-gray-950 sm:text-5xl">
              Start with public discovery. Continue with the right verified
              flow.
            </h1>

            <p className="mt-6 text-lg leading-8 text-gray-600">
              Asancha guides users from public browsing into the correct
              account, onboarding, verification, payment, booking, conversation,
              recommendation, or API partner workflow when needed.
            </p>
          </div>

          <ol className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {steps.map((step, index) => (
              <li
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                key={step.title}
              >
                <p className="text-sm font-bold text-blue-700">
                  Step {index + 1}
                </p>

                <h2 className="mt-3 text-lg font-bold text-gray-950">
                  {step.title}
                </h2>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section
          aria-labelledby="trust-verification-heading"
          className="border-y border-gray-200 bg-gray-50"
          id="trust-verification"
        >
          <div className="asancha-page-container py-16">
            <h2
              className="text-3xl font-extrabold tracking-tight text-gray-950"
              id="trust-verification-heading"
            >
              Trust and verification are built into the journey.
            </h2>

            <p className="mt-4 max-w-3xl text-base leading-7 text-gray-600">
              Dashboard access does not automatically mean full action approval.
              Some actions may remain locked until the correct profile,
              verification, document, payment, or approval state is complete.
            </p>
          </div>
        </section>

        <section
          aria-labelledby="ai-property-intelligence-heading"
          className="bg-white"
          id="ai-property-intelligence"
        >
          <div className="asancha-page-container py-16">
            <h2
              className="text-3xl font-extrabold tracking-tight text-gray-950"
              id="ai-property-intelligence-heading"
            >
              AI guidance should be explainable, not magical.
            </h2>

            <p className="mt-4 max-w-3xl text-base leading-7 text-gray-600">
              Asancha may use AI-assisted recommendations to explain matches,
              confidence levels, and mismatch warnings. These recommendations
              are guidance only and should not be treated as guaranteed
              financial, legal, rental, resale, or investment outcomes.
            </p>

            <Link
              className="mt-8 inline-flex min-h-12 items-center justify-center rounded-xl bg-gray-950 px-6 py-3 text-sm font-bold text-white hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-100"
              href="/auth/sign-up"
            >
              Start your setup
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
