// File: app/(public)/solutions/investors/page.tsx

/**
 * Asancha Investor Solution Page
 *
 * Purpose:
 * Explains Asancha for buyers and investors.
 *
 * Security note:
 * This page must not imply guaranteed investment, rental, resale, legal,
 * funding, or financial outcomes.
 */

import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/src/components/seo/json-ld";
import { createPublicPageJsonLdBundle } from "@/src/lib/seo/json-ld";

export const metadata: Metadata = {
  title: "For Investors | Asancha",
  description:
    "Explore how Asancha supports investors with public marketplace discovery, preferences, saved opportunities, and safe AI-assisted guidance.",
  alternates: {
    canonical: "/solutions/investors",
  },
};

/**
 * Renders the investor public solution page.
 */
export default function InvestorsSolutionPage() {
  const jsonLd = createPublicPageJsonLdBundle({
    path: "/solutions/investors",
    name: "Asancha for Investors",
    description:
      "Explore how Asancha supports investors with public marketplace discovery, preferences, saved opportunities, and safe AI-assisted guidance.",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Solutions", path: "/solutions/investors" },
      { name: "Investors", path: "/solutions/investors" },
    ],
  });

  return (
    <>
      <JsonLd data={jsonLd} id="investors-json-ld" />

      <main>
        <section className="asancha-page-container py-16 sm:py-24">
          <p className="text-sm font-bold uppercase tracking-wide text-primary">
            For investors
          </p>

          <h1 className="mt-4 max-w-4xl text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Discover property opportunities with clearer investor workflows.
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
            Asancha helps investors browse public-safe property previews, save
            opportunities, set preferences, and continue into verification-aware
            actions when required.
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              "Browse public-safe opportunities",
              "Set investment preferences",
              "Receive explainable AI guidance",
            ].map((item) => (
              <article
                className="rounded-2xl border border-border bg-card p-6 shadow-sm"
                key={item}
              >
                <h2 className="text-lg font-bold text-foreground">{item}</h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Investor actions may require account setup, completed profile,
                  verification, payment review, or platform approval.
                </p>
              </article>
            ))}
          </div>

          <p className="mt-8 rounded-xl border border-accent bg-accent p-4 text-sm leading-6 text-accent-foreground">
            AI recommendations are guidance only. They do not guarantee income,
            capital growth, financing, legal outcome, resale value, or
            completion.
          </p>

          <Link
            className="mt-8 inline-flex min-h-12 items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary-hover focus:outline-none focus:ring-4 focus:ring-ring/20"
            href="/auth/sign-up"
          >
            Start as an investor
          </Link>
        </section>
      </main>
    </>
  );
}
