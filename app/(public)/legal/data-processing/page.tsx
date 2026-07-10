// File: app/(public)/legal/data-processing/page.tsx

/**
 * Asancha Data Processing Page
 *
 * Purpose:
 * Provides public data-processing guidance for Asancha Web Public.
 *
 * Security note:
 * This page must not expose internal processing architecture, secrets,
 * admin notes, private records, or provider payloads.
 */

import type { Metadata } from "next";

import { JsonLd } from "@/src/components/seo/json-ld";
import { createPublicPageJsonLdBundle } from "@/src/lib/seo/json-ld";

export const metadata: Metadata = {
  title: "Data Processing | Asancha",
  description:
    "Read public data processing guidance for Asancha account, profile, marketplace, verification, payment, recommendation, and API partner workflows.",
  alternates: {
    canonical: "/legal/data-processing",
  },
};

/**
 * Renders the public data processing page.
 */
export default function DataProcessingPage() {
  const jsonLd = createPublicPageJsonLdBundle({
    path: "/legal/data-processing",
    name: "Asancha Data Processing",
    description:
      "Read public data processing guidance for Asancha account, profile, marketplace, verification, payment, recommendation, and API partner workflows.",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Legal", path: "/legal" },
      { name: "Data Processing", path: "/legal/data-processing" },
    ],
  });

  return (
    <>
      <JsonLd data={jsonLd} id="data-processing-json-ld" />

      <main>
        <article className="asancha-page-container py-16 sm:py-24">
          <p className="text-sm font-bold uppercase tracking-wide text-blue-700">
            Legal
          </p>

          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-gray-950 sm:text-5xl">
            Data Processing
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-600">
            Asancha may process information needed to support account setup,
            role-specific profiles, marketplace workflows, verification,
            documents, payments, bookings, conversations, notifications,
            recommendations, and API partner access.
          </p>

          <section className="mt-10 space-y-6 text-sm leading-7 text-gray-700">
            <h2 className="text-2xl font-bold text-gray-950">
              Processing purposes
            </h2>
            <p>
              Data may be processed to provide platform access, support user
              workflows, review required information, communicate status, and
              support controlled partner access.
            </p>

            <h2 className="text-2xl font-bold text-gray-950">
              Public-safe presentation
            </h2>
            <p>
              Public pages should never expose restricted records, private
              documents, internal review notes, payment secrets, API keys, or
              backend internals.
            </p>
          </section>
        </article>
      </main>
    </>
  );
}
