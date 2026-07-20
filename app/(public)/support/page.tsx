// File: app/(public)/support/page.tsx

/**
 * Asancha Public Support Page
 *
 * Purpose:
 * Provides public support guidance for guests and public users.
 *
 * Main responsibilities:
 * - Explain the difference between public support and account-aware support
 * - Guide users toward the right support path
 * - Warn users not to submit sensitive information through public support
 * - Explain support areas such as signup, onboarding, verification, payments,
 *   bookings, listings, service providers, and API partner applications
 * - Render safe public WebPage and BreadcrumbList JSON-LD
 *
 * Accessibility note:
 * Uses semantic sections, one H1, descriptive links, clear heading order,
 * and public-safe support copy.
 *
 * Security note:
 * Public support must not expose internal support queues, staff routes,
 * admin notes, private verification notes, private payment data, API secrets,
 * webhook secrets, backend URLs, ObjectIds, private documents, or internal routes.
 */

import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/src/components/seo/json-ld";
import { createPublicPageJsonLdBundle } from "@/src/lib/seo/json-ld";
import { PublicPageHero } from "../_components/public-page-hero";

export const metadata: Metadata = {
  title: "Support | Asancha",
  description:
    "Get public support guidance for Asancha marketplace browsing, signup, onboarding, verification, payments, bookings, and API partner applications.",
  alternates: {
    canonical: "/support",
  },
  openGraph: {
    title: "Support | Asancha",
    description:
      "Find the right Asancha support path for marketplace browsing, signup, onboarding, verification, payments, bookings, and API partner applications.",
    url: "/support",
    type: "website",
  },
};

const supportAreas = [
  {
    title: "Marketplace browsing",
    description:
      "Get help understanding public listing previews, marketplace discovery, filters, and restricted actions.",
  },
  {
    title: "Signup and onboarding",
    description:
      "Find guidance for creating a public account, choosing the right role, and completing profile setup.",
  },
  {
    title: "Verification and documents",
    description:
      "Understand why a document, profile detail, correction, or verification step may be required.",
  },
  {
    title: "Payments and references",
    description:
      "Learn how payment references, payment proof, and review status should be handled safely.",
  },
  {
    title: "Bookings and conversations",
    description:
      "Get guidance on viewing-related steps, booking actions, reservations, messages, and next-step workflows.",
  },
  {
    title: "API partner applications",
    description:
      "Understand the controlled API partner application route and why partner access is separate from ordinary signup.",
  },
] as const;

const publicSupportRules = [
  "Use public support for general questions only.",
  "Do not submit passwords, API keys, webhook secrets, or full identity documents.",
  "Do not share private payment details through public contact or support forms.",
  "Sign in before asking about account-specific documents, bookings, payments, or partner settings.",
] as const;

const accountSupportExamples = [
  "Private document status",
  "Verification correction request",
  "Payment reference or proof review",
  "Reservation or booking status",
  "Conversation or notification issue",
  "API partner workspace or integration issue",
] as const;

/**
 * Renders the public support page.
 */
export default function SupportPage() {
  const jsonLd = createPublicPageJsonLdBundle({
    path: "/support",
    name: "Asancha Support",
    description:
      "Get public support guidance for Asancha marketplace browsing, signup, onboarding, verification, payments, bookings, and API partner applications.",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Support", path: "/support" },
    ],
  });

  return (
    <>
      <JsonLd data={jsonLd} id="support-json-ld" />

      <main>
        <PublicPageHero
          description="Public support can guide you toward the right next step. For account-specific issues, sign in so Asancha can show safer, account-aware support options."
          eyebrow="Support"
          primaryAction={{
            label: "Sign in for account support",
            href: "/auth/sign-in?next=/account/support",
          }}
          secondaryAction={{ label: "Contact Asancha", href: "/contact" }}
          secondaryDescription="Use this page for general support guidance around marketplace discovery, signup, onboarding, public user roles, service provider workflows, payment-sensitive actions, and API partner applications."
          title="Get help without exposing sensitive information."
        />

        <section
          aria-labelledby="support-paths-heading"
          className="border-y border-border bg-muted"
        >
          <div className="asancha-page-container py-16">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-wide text-primary">
                Support paths
              </p>

              <h2
                className="mt-3 text-3xl font-extrabold tracking-tight text-foreground"
                id="support-paths-heading"
              >
                Choose the right support route for your issue.
              </h2>

              <p className="mt-4 text-base leading-7 text-muted-foreground">
                Public support is for general guidance. Account-aware support is
                for private records, protected workflows, and user-specific
                activity.
              </p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2">
              <article className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="text-lg font-bold text-card-foreground">
                  Public support
                </h3>

                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Use public support for general questions about marketplace
                  browsing, public pages, signup, role selection, or API partner
                  application entry.
                </p>

                <Link
                  className="mt-5 inline-flex text-sm font-bold text-primary hover:text-primary-hover focus:outline-none focus:ring-4 focus:ring-ring/20"
                  href="/contact"
                >
                  Send a general enquiry
                </Link>
              </article>

              <article className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="text-lg font-bold text-card-foreground">
                  Account-aware support
                </h3>

                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Sign in for support related to documents, verification,
                  payment references, reservations, bookings, conversations,
                  notifications, or API partner workspace actions.
                </p>

                <Link
                  className="mt-5 inline-flex text-sm font-bold text-primary hover:text-primary-hover focus:outline-none focus:ring-4 focus:ring-ring/20"
                  href="/auth/sign-in?next=/account/support"
                >
                  Sign in for protected support
                </Link>
              </article>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="support-areas-heading"
          className="bg-background"
        >
          <div className="asancha-page-container py-16">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-wide text-primary">
                What we can help with
              </p>

              <h2
                className="mt-3 text-3xl font-extrabold tracking-tight text-foreground"
                id="support-areas-heading"
              >
                Support guidance across public and protected workflows.
              </h2>

              <p className="mt-4 text-base leading-7 text-muted-foreground">
                Asancha support should help users understand what they can do
                publicly, what requires sign-in, and what depends on backend
                verification, payment, approval, or access checks.
              </p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {supportAreas.map((area) => (
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
          aria-labelledby="support-public-safety-heading"
          className="bg-card"
        >
          <div className="asancha-page-container py-16">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-primary">
                  Public support safety
                </p>

                <h2
                  className="mt-3 text-3xl font-extrabold tracking-tight text-foreground"
                  id="support-public-safety-heading"
                >
                  Keep private information out of public support messages.
                </h2>

                <p className="mt-4 text-base leading-7 text-muted-foreground">
                  Public support should not collect sensitive records. When a
                  support request depends on private account data, the safer
                  route is to sign in and use account-aware support.
                </p>

                <p className="mt-4 text-base leading-7 text-muted-foreground">
                  This protects users, properties, payment-related records,
                  documents, API partner access, and platform operations.
                </p>
              </div>

              <ul className="grid gap-3">
                {publicSupportRules.map((rule) => (
                  <li
                    className="rounded-xl border border-border bg-muted p-4 text-sm font-bold text-foreground"
                    key={rule}
                  >
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="account-support-heading"
          className="border-y border-border bg-muted"
        >
          <div className="asancha-page-container py-16">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-primary">
                  Account-specific issues
                </p>

                <h2
                  className="mt-3 text-3xl font-extrabold tracking-tight text-foreground"
                  id="account-support-heading"
                >
                  Some support requests should only happen after sign-in.
                </h2>

                <p className="mt-4 text-base leading-7 text-muted-foreground">
                  If your question depends on private documents, verification,
                  bookings, payments, API partner configuration, or personal
                  account activity, sign in before requesting support.
                </p>
              </div>

              <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                <h3 className="text-lg font-bold text-card-foreground">
                  Examples of account-aware support
                </h3>

                <ul className="mt-5 grid gap-3">
                  {accountSupportExamples.map((item) => (
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
          </div>
        </section>

        <section
          aria-labelledby="support-final-cta-heading"
          className="bg-primary"
        >
          <div className="asancha-page-container py-16 text-primary-foreground">
            <h2
              className="max-w-3xl text-3xl font-extrabold tracking-tight"
              id="support-final-cta-heading"
            >
              Need help with a private account issue?
            </h2>

            <p className="mt-4 max-w-2xl text-base leading-7 text-primary-foreground/80">
              Sign in first so Asancha can guide you through the safer
              account-aware support path. For general enquiries, use the public
              contact page.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-foreground px-6 py-3 text-sm font-bold text-background hover:bg-foreground/80 focus:outline-none focus:ring-4 focus:ring-primary-foreground/40"
                href="/auth/sign-in?next=/account/support"
              >
                Sign in for Account Support
              </Link>

              <Link
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-primary-foreground/35 px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary-foreground/10 focus:outline-none focus:ring-4 focus:ring-primary-foreground/40"
                href="/contact"
              >
                Contact Asancha
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
