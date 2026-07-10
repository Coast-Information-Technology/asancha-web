// File: app/(public)/solutions/property-sourcers/page.tsx

/**
 * Asancha Property Sourcer Solution Page
 *
 * Purpose:
 * Explains Asancha for property sourcers.
 *
 * Security note:
 * This page must not expose restricted investor data, private deal packs,
 * internal compliance notes, or guaranteed investment claims.
 */

import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/src/components/seo/json-ld";
import { createPublicPageJsonLdBundle } from "@/src/lib/seo/json-ld";

export const metadata: Metadata = {
  title: "For Property Sourcers | Asancha",
  description:
    "Learn how property sourcers can submit opportunities, prepare deal packs, manage compliance, and track performance on Asancha.",
  alternates: {
    canonical: "/solutions/property-sourcers",
  },
};

/**
 * Renders the property sourcer solution page.
 */
export default function PropertySourcersSolutionPage() {
  const jsonLd = createPublicPageJsonLdBundle({
    path: "/solutions/property-sourcers",
    name: "Asancha for Property Sourcers",
    description:
      "Learn how property sourcers can submit opportunities, prepare deal packs, manage compliance, and track performance on Asancha.",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Solutions", path: "/solutions/property-sourcers" },
      { name: "Property Sourcers", path: "/solutions/property-sourcers" },
    ],
  });

  return (
    <>
      <JsonLd data={jsonLd} id="property-sourcers-json-ld" />

      <main>
        <section className="asancha-page-container py-16 sm:py-24">
          <p className="text-sm font-bold uppercase tracking-wide text-blue-700">
            For property sourcers
          </p>

          <h1 className="mt-4 max-w-4xl text-4xl font-extrabold tracking-tight text-gray-950 sm:text-5xl">
            Submit sourced opportunities through a structured, compliance-aware
            workflow.
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-600">
            Asancha helps property sourcers manage sourced deals, prepare deal
            packs, follow compliance requirements, and communicate through safer
            platform workflows.
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              "Submit sourced opportunities",
              "Prepare deal packs",
              "Track compliance and performance",
            ].map((item) => (
              <article
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                key={item}
              >
                <h2 className="text-lg font-bold text-gray-950">{item}</h2>
                <p className="mt-3 text-sm leading-6 text-gray-600">
                  Deal-sensitive information should remain gated until the user
                  has the correct profile, verification, approval, or access.
                </p>
              </article>
            ))}
          </div>

          <Link
            className="mt-8 inline-flex min-h-12 items-center justify-center rounded-xl bg-gray-950 px-6 py-3 text-sm font-bold text-white hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-100"
            href="/auth/sign-up"
          >
            Start as a property sourcer
          </Link>
        </section>
      </main>
    </>
  );
}
