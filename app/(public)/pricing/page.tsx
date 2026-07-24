// File: app/(public)/pricing/page.tsx

/**
 * Asancha Pricing Page
 *
 * Purpose:
 * Provides public-safe pricing and fee guidance.
 *
 * Main responsibilities:
 * - Explain that pricing shown publicly is guidance until confirmed by the
 *   correct backend-controlled workflow
 * - Clarify marketplace, user workflow, service, payment, and API partner
 *   pricing expectations
 * - Explain that payment proof is not payment approval
 * - Guide users to contact/support routes when exact pricing depends on their
 *   account, role, listing, service, partner, or workflow state
 * - Render safe public WebPage and BreadcrumbList JSON-LD
 *
 * Accessibility note:
 * Uses semantic sections, one H1, descriptive links, clear heading order,
 * and public-safe pricing copy.
 *
 * Security note:
 * This page must not expose private payment provider data, restricted billing
 * configuration, payment provider payloads, API secrets, webhook secrets,
 * backend URLs, admin/staff routes, ObjectIds, private customer/payment
 * records, or internal billing notes.
 */

import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/src/components/seo/json-ld";
import { createPublicPageJsonLdBundle } from "@/src/lib/seo/json-ld";
import { PublicPageHero } from "../_components/public-page-hero";

export const metadata: Metadata = {
  title: "Pricing | Asancha",
  description:
    "View public-safe Asancha pricing and fee guidance. Exact fees and payment actions may depend on approved workflows.",
  alternates: {
    canonical: "/pricing",
  },
  openGraph: {
    title: "Pricing | Asancha",
    description:
      "Understand public-safe Asancha pricing guidance, payment review expectations, and workflow-based fees.",
    url: "/pricing",
    type: "website",
  },
};

const pricingAreas = [
  {
    title: "Marketplace discovery",
    description:
      "Public marketplace previews can be browsed safely. Access to restricted deal details or protected actions may depend on account state, verification, payment, or approval.",
  },
  {
    title: "Role-specific workflows",
    description:
      "Investor, owner, agent, sourcer, and service provider actions may have different requirements depending on the workflow being used.",
  },
  {
    title: "Service provider activity",
    description:
      "Bookings, service actions, documents, and payment-aware workflows may depend on the service type and confirmed status.",
  },
  {
    title: "API partner access",
    description:
      "API partner pricing, billing, usage, scopes, and support terms should be handled through approved partner workflows only.",
  },
] as const;

const paymentRules = [
  "Exact payable amounts should come from the correct platform workflow.",
  "Payment references should be generated or confirmed by Asancha-controlled systems.",
  "Submitting payment proof does not automatically mean payment approval.",
  "Frontend payment messages do not override secure payment, billing, or approval status.",
] as const;

const pricingDependsOn = [
  "Selected user role",
  "Account and profile state",
  "Verification or document status",
  "Selected listing, service, or workflow",
  "Payment reference or review state",
  "API partner approval and usage scope",
] as const;

/**
 * Renders the public pricing page.
 */
export default function PricingPage() {
  const jsonLd = createPublicPageJsonLdBundle({
    path: "/pricing",
    name: "Asancha Pricing",
    description:
      "View public-safe Asancha pricing and fee guidance. Exact fees and payment actions may depend on approved workflows.",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Pricing", path: "/pricing" },
    ],
  });

  return (
    <>
      <JsonLd data={jsonLd} id="pricing-json-ld" />

      <main>
        <PublicPageHero
          description="Asancha pricing and payment actions should be clear, traceable, and tied to the correct workflow."
          eyebrow="Pricing"
          primaryAction={{ label: "Contact Asancha", href: "/contact" }}
          secondaryAction={{ label: "Visit support", href: "/support" }}
          secondaryDescription="Public pricing information is guidance only until the relevant workflow confirms the exact amount, reference, and status."
          title="Transparent guidance before payment-sensitive actions."
        />

        <section
          aria-labelledby="pricing-areas-heading"
          className="border-y border-border bg-muted"
        >
          <div className="asancha-page-container py-16">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-wide text-primary">
                Pricing areas
              </p>

              <h2
                className="mt-3 text-3xl font-extrabold tracking-tight text-foreground"
                id="pricing-areas-heading"
              >
                Fees may apply differently across platform workflows.
              </h2>

              <p className="mt-4 text-base leading-7 text-muted-foreground">
                Asancha should explain public pricing clearly without exposing
                private billing configuration, payment provider data, internal
                review notes, or customer-specific payment records.
              </p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {pricingAreas.map((area) => (
                <article
                  className="rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:border-primary/50"
                  key={area.title}
                >
                  <h3 className="text-lg font-bold text-card-foreground">
                    {area.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {area.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          aria-labelledby="pricing-depends-heading"
          className="bg-background"
        >
          <div className="asancha-page-container py-16">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-primary">
                  What affects pricing
                </p>

                <h2
                  className="mt-3 text-3xl font-extrabold tracking-tight text-foreground"
                  id="pricing-depends-heading"
                >
                  The exact amount should come from the active workflow.
                </h2>

                <p className="mt-4 text-base leading-7 text-muted-foreground">
                  Public pages can explain how pricing works at a high level,
                  but exact payment amounts and required references should be
                  confirmed only inside the relevant protected workflow.
                </p>

                <p className="mt-4 text-base leading-7 text-muted-foreground">
                  This helps prevent confusion when different users, listings,
                  services, approvals, or partner agreements require different
                  payment rules.
                </p>
              </div>

              <ul className="grid gap-3 sm:grid-cols-2">
                {pricingDependsOn.map((item) => (
                  <li
                    className="rounded-xl border border-border bg-muted p-4 text-sm font-bold text-foreground"
                    key={item}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="payment-rules-heading"
          className="bg-card"
        >
          <div className="asancha-page-container py-16">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-primary">
                  Payment-sensitive actions
                </p>

                <h2
                  className="mt-3 text-3xl font-extrabold tracking-tight text-foreground"
                  id="payment-rules-heading"
                >
                  Payment proof is not the same thing as payment approval.
                </h2>

                <p className="mt-4 text-base leading-7 text-muted-foreground">
                  Where payment proof is required, submitting proof only means
                  the proof has been submitted for review. Payment status must
                  be reviewed and confirmed through Asancha-controlled
                  workflows.
                </p>

                <p className="mt-4 text-base leading-7 text-muted-foreground">
                  Users should rely on confirmed platform status, not screenshots
                  alone, frontend assumptions, or manually interpreted payment
                  messages.
                </p>
              </div>

              <div className="rounded-3xl border border-border bg-muted p-6">
                <h3 className="text-lg font-bold text-foreground">
                  Payment safety reminders
                </h3>

                <ul className="mt-5 grid gap-3">
                  {paymentRules.map((rule) => (
                    <li
                      className="rounded-xl border border-border bg-card p-4 text-sm font-bold text-card-foreground"
                      key={rule}
                    >
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="pricing-public-note-heading"
          className="bg-background"
        >
          <div className="asancha-page-container py-16">
            <div className="rounded-3xl border border-accent bg-accent p-6 shadow-sm lg:p-8">
              <div className="max-w-3xl">
                <p className="text-sm font-bold uppercase tracking-wide text-primary">
                  Public guidance only
                </p>

                <h2
                  className="mt-3 text-3xl font-extrabold tracking-tight text-accent-foreground"
                  id="pricing-public-note-heading"
                >
                  Public pricing content should not expose private billing
                  systems.
                </h2>

                <p className="mt-4 text-base leading-7 text-accent-foreground">
                  Payment provider payloads, private customer records, billing
                  configuration, API secrets, webhook secrets, and internal
                  payment notes must remain protected by approved
                  workflows.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="pricing-final-cta-heading"
          className="bg-primary"
        >
          <div className="asancha-page-container py-16 text-primary-foreground">
            <h2
              className="max-w-3xl text-3xl font-extrabold tracking-tight"
              id="pricing-final-cta-heading"
            >
              Need help understanding which pricing flow applies to you?
            </h2>

            <p className="mt-4 max-w-2xl text-base leading-7 text-primary-foreground/80">
              Contact Asancha or continue through the right platform workflow so
              the exact amount, reference, and payment status can be confirmed
              safely.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-foreground px-6 py-3 text-sm font-bold text-background hover:bg-foreground/80 focus:outline-none focus:ring-4 focus:ring-primary-foreground/40"
                href="/contact"
              >
                Contact Asancha
              </Link>

              <Link
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-primary-foreground/35 px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary-foreground/10 focus:outline-none focus:ring-4 focus:ring-primary-foreground/40"
                href="/marketplace"
              >
                Browse Marketplace
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
