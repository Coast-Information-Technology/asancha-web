// File: app/(public)/api-partners/page.tsx

/**
 * Asancha API Partners Page
 *
 * Purpose:
 * Explains controlled API partner access for Asancha Web Public.
 *
 * Main responsibilities:
 * - Explain that API partner access is separate from ordinary public signup
 * - Describe the controlled application, review, approval, and access process
 * - Clarify protected partner areas such as scopes, keys, usage, webhooks,
 *   billing, documentation, and support
 * - Guide potential partners to the API partner application route
 * - Render safe public WebPage and BreadcrumbList JSON-LD
 *
 * Accessibility note:
 * Uses semantic sections, one H1, descriptive links, clear heading order,
 * and public-safe API partner copy.
 *
 * Security note:
 * This page must not expose private API documentation, full API keys,
 * API key hashes, webhook secrets, internal partner logs, private usage
 * records, billing records, backend URLs, admin/staff routes, ObjectIds,
 * storage keys, or internal review notes.
 */

import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/src/components/seo/json-ld";
import { createPublicPageJsonLdBundle } from "@/src/lib/seo/json-ld";
import { PublicPageHero } from "../_components/public-page-hero";

export const metadata: Metadata = {
  title: "API Partners | Asancha",
  description:
    "Learn about controlled Asancha API partner access, application review, approved scopes, usage, webhooks, billing, documentation, and support.",
  alternates: {
    canonical: "/api-partners",
  },
  openGraph: {
    title: "API Partners | Asancha",
    description:
      "Apply for controlled Asancha API partner access and connect approved property workflows through partner-safe integration.",
    url: "/api-partners",
    type: "website",
  },
};

const partnerBenefits = [
  {
    title: "Controlled access",
    description:
      "API partners apply through a separate review process instead of ordinary public signup.",
  },
  {
    title: "Approved scopes",
    description:
      "Partner access should be limited to approved use cases, allowed scopes, and backend-enforced permissions.",
  },
  {
    title: "Usage visibility",
    description:
      "Approved partners may view relevant usage information through protected partner workflows where available.",
  },
  {
    title: "Webhook-ready workflows",
    description:
      "Webhook access and event delivery should be configured only through secure approved partner settings.",
  },
] as const;

const applicationSteps = [
  {
    title: "Apply",
    description:
      "Submit API partner interest through the controlled application route with your organisation and intended use case.",
  },
  {
    title: "Review",
    description:
      "Asancha reviews the request, use case, risk level, and whether API access is appropriate.",
  },
  {
    title: "Approval and setup",
    description:
      "Approved partners receive access to partner-safe setup flows, allowed scopes, and relevant configuration areas.",
  },
  {
    title: "Operate with controls",
    description:
      "Partner activity should remain governed by permissions, usage limits, key management, billing status, and support rules.",
  },
] as const;

const protectedPartnerAreas = [
  "API keys and key rotation",
  "Webhook secrets",
  "Approved scopes",
  "Usage records",
  "Billing status",
  "Partner documentation",
  "Support requests",
  "Integration configuration",
] as const;

const partnerSafetyNotes = [
  "API partner access is not available through ordinary public signup.",
  "API keys and webhook secrets must never be displayed on public pages.",
  "Approved access can be limited, suspended, rotated, or revoked by backend rules.",
  "Frontend partner screens do not override backend permission checks.",
] as const;

/**
 * Renders the API partners public page.
 */
export default function ApiPartnersPage() {
  const jsonLd = createPublicPageJsonLdBundle({
    path: "/api-partners",
    name: "Asancha API Partners",
    description:
      "Learn about controlled Asancha API partner access, application review, approved scopes, usage, webhooks, billing, documentation, and support.",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "API Partners", path: "/api-partners" },
    ],
  });

  return (
    <>
      <JsonLd data={jsonLd} id="api-partners-json-ld" />

      <main>
        <PublicPageHero
          description="API partner access is separate from ordinary public signup. Partners apply through a controlled process, receive review, and access partner-safe tools only after approval."
          eyebrow="API partners"
          primaryAction={{
            label: "Apply for API access",
            href: "/api-partner/apply",
          }}
          secondaryAction={{ label: "Ask a partner question", href: "/support" }}
          secondaryDescription="Asancha API access is designed for approved partners who need to connect property workflows, marketplace-related processes, or platform-approved integrations without exposing private system internals."
          title="Controlled API access for approved property partners."
        />

        <section
          aria-labelledby="partner-benefits-heading"
          className="border-y border-border bg-muted"
        >
          <div className="asancha-page-container py-16">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-wide text-primary">
                Partner access
              </p>

              <h2
                className="mt-3 text-3xl font-extrabold tracking-tight text-foreground"
                id="partner-benefits-heading"
              >
                Built for approved integrations, not open public registration.
              </h2>

              <p className="mt-4 text-base leading-7 text-muted-foreground">
                API partner workflows should be reviewed, permissioned, and
                monitored. This keeps partner access useful while protecting
                users, listings, documents, payments, and platform operations.
              </p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {partnerBenefits.map((benefit) => (
                <article
                  className="rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:border-primary/50"
                  key={benefit.title}
                >
                  <h3 className="text-lg font-bold text-card-foreground">
                    {benefit.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {benefit.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          aria-labelledby="partner-application-heading"
          className="bg-background"
        >
          <div className="asancha-page-container py-16">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-wide text-primary">
                Application process
              </p>

              <h2
                className="mt-3 text-3xl font-extrabold tracking-tight text-foreground"
                id="partner-application-heading"
              >
                Partner access follows a controlled review path.
              </h2>

              <p className="mt-4 text-base leading-7 text-muted-foreground">
                API access should only be granted when the partner use case,
                permissions, operational controls, billing status, and support
                expectations are clear.
              </p>
            </div>

            <ol className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {applicationSteps.map((step, index) => (
                <li
                  className="rounded-2xl border border-border bg-card p-6 shadow-sm"
                  key={step.title}
                >
                  <p className="text-sm font-bold text-primary">
                    Step {index + 1}
                  </p>

                  <h3 className="mt-3 text-lg font-bold text-card-foreground">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {step.description}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section
          aria-labelledby="partner-protected-areas-heading"
          className="bg-card"
        >
          <div className="asancha-page-container py-16">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-primary">
                  Protected partner areas
                </p>

                <h2
                  className="mt-3 text-3xl font-extrabold tracking-tight text-foreground"
                  id="partner-protected-areas-heading"
                >
                  Sensitive partner access must stay behind approved workflows.
                </h2>

                <p className="mt-4 text-base leading-7 text-muted-foreground">
                  Public API partner pages should explain the programme without
                  exposing private documentation, keys, secrets, usage records,
                  billing details, internal logs, or backend URLs.
                </p>

                <p className="mt-4 text-base leading-7 text-muted-foreground">
                  After approval, partner tools should still depend on backend
                  authentication, authorization, scope checks, account status,
                  usage controls, and audit logging.
                </p>
              </div>

              <ul className="grid gap-3 sm:grid-cols-2">
                {protectedPartnerAreas.map((item) => (
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
          aria-labelledby="partner-safety-heading"
          className="border-y border-border bg-muted"
        >
          <div className="asancha-page-container py-16">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-primary">
                  Partner safety
                </p>

                <h2
                  className="mt-3 text-3xl font-extrabold tracking-tight text-foreground"
                  id="partner-safety-heading"
                >
                  API access should be controlled throughout the partner
                  lifecycle.
                </h2>

                <p className="mt-4 text-base leading-7 text-muted-foreground">
                  Partner access is not only about issuing a key. It also
                  involves scope approval, safe key handling, webhook security,
                  usage visibility, billing awareness, support, audit trails,
                  and revocation controls.
                </p>
              </div>

              <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                <h3 className="text-lg font-bold text-card-foreground">
                  Safety reminders
                </h3>

                <ul className="mt-5 grid gap-3">
                  {partnerSafetyNotes.map((note) => (
                    <li
                      className="rounded-xl border border-border bg-muted p-4 text-sm font-bold text-foreground"
                      key={note}
                    >
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="partner-public-preview-heading"
          className="bg-background"
        >
          <div className="asancha-page-container py-16">
            <div className="rounded-3xl border border-accent bg-accent p-6 shadow-sm lg:p-8">
              <div className="max-w-3xl">
                <p className="text-sm font-bold uppercase tracking-wide text-primary">
                  Public information only
                </p>

                <h2
                  className="mt-3 text-3xl font-extrabold tracking-tight text-accent-foreground"
                  id="partner-public-preview-heading"
                >
                  This page explains the partner programme without exposing
                  partner-only technical details.
                </h2>

                <p className="mt-4 text-base leading-7 text-accent-foreground">
                  API documentation, keys, secrets, usage, billing records,
                  webhook settings, and integration support should be available
                  only through protected partner workflows after approval.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="partner-final-cta-heading"
          className="bg-primary"
        >
          <div className="asancha-page-container py-16 text-primary-foreground">
            <h2
              className="max-w-3xl text-3xl font-extrabold tracking-tight"
              id="partner-final-cta-heading"
            >
              Ready to apply for controlled API partner access?
            </h2>

            <p className="mt-4 max-w-2xl text-base leading-7 text-primary-foreground/80">
              Submit your partner interest through the approved application
              route. Ordinary public signup is for public user roles, not API
              partner access.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-foreground px-6 py-3 text-sm font-bold text-background hover:bg-foreground/80 focus:outline-none focus:ring-4 focus:ring-primary-foreground/40"
                href="/api-partner/apply"
              >
                Apply for API Access
              </Link>

              <Link
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-primary-foreground/35 px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary-foreground/10 focus:outline-none focus:ring-4 focus:ring-primary-foreground/40"
                href="/support"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
