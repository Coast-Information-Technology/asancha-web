// File: app/(public)/pricing/page.tsx

/**
 * Asancha Pricing Page
 *
 * Purpose:
 * Provides public-safe pricing and fee guidance.
 *
 * Security note:
 * This page must not expose private payment provider data, restricted billing
 * configuration, API secrets, or private customer/payment records.
 */

import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/src/components/seo/json-ld";
import { createPublicPageJsonLdBundle } from "@/src/lib/seo/json-ld";

export const metadata: Metadata = {
  title: "Pricing | Asancha",
  description:
    "View public-safe Asancha pricing and fee guidance. Exact fees and payment actions may depend on backend-approved workflows.",
  alternates: {
    canonical: "/pricing",
  },
};

/**
 * Renders the public pricing page.
 */
export default function PricingPage() {
  const jsonLd = createPublicPageJsonLdBundle({
    path: "/pricing",
    name: "Asancha Pricing",
    description:
      "View public-safe Asancha pricing and fee guidance. Exact fees and payment actions may depend on backend-approved workflows.",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Pricing", path: "/pricing" },
    ],
  });

  return (
    <>
      <JsonLd data={jsonLd} id="pricing-json-ld" />

      <main>
        <section className="asancha-page-container py-16 sm:py-24">
          <p className="text-sm font-bold uppercase tracking-wide text-primary">
            Pricing
          </p>

          <h1 className="mt-4 max-w-4xl text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Transparent guidance before payment-sensitive actions.
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
            Asancha pricing and payment actions should be clear, traceable, and
            tied to backend-generated references where required. Public pricing
            information is guidance only until the correct workflow confirms the
            exact amount and status.
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              "Marketplace discovery",
              "Role-specific workflows",
              "API partner access",
            ].map((item) => (
              <article
                className="rounded-2xl border border-border bg-card p-6 shadow-sm"
                key={item}
              >
                <h2 className="text-lg font-bold text-foreground">{item}</h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Fees, payment references, proof review, and approvals should
                  be confirmed through the relevant backend-controlled workflow.
                </p>
              </article>
            ))}
          </div>

          <p className="mt-8 rounded-xl border border-accent bg-accent p-4 text-sm leading-6 text-accent-foreground">
            Submitting payment proof does not mean payment approval. Payment
            status must be reviewed and confirmed through Asancha-controlled
            workflows.
          </p>

          <Link
            className="mt-8 inline-flex min-h-12 items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary-hover focus:outline-none focus:ring-4 focus:ring-ring/20"
            href="/contact"
          >
            Contact Asancha
          </Link>
        </section>
      </main>
    </>
  );
}
