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
          <p className="text-sm font-bold uppercase tracking-wide text-blue-700">
            For investors
          </p>

          <h1 className="mt-4 max-w-4xl text-4xl font-extrabold tracking-tight text-gray-950 sm:text-5xl">
            Discover property opportunities with clearer investor workflows.
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-600">
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
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                key={item}
              >
                <h2 className="text-lg font-bold text-gray-950">{item}</h2>
                <p className="mt-3 text-sm leading-6 text-gray-600">
                  Investor actions may require account setup, completed profile,
                  verification, payment review, or platform approval.
                </p>
              </article>
            ))}
          </div>

          <p className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
            AI recommendations are guidance only. They do not guarantee income,
            capital growth, financing, legal outcome, resale value, or
            completion.
          </p>

          <Link
            className="mt-8 inline-flex min-h-12 items-center justify-center rounded-xl bg-gray-950 px-6 py-3 text-sm font-bold text-white hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-100"
            href="/auth/sign-up"
          >
            Start as an investor
          </Link>
        </section>
      </main>
    </>
  );
}
