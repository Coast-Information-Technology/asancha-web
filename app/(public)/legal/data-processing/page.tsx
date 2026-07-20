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
import { PublicPageHero } from "../../_components/public-page-hero";

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
        <PublicPageHero
          description="Asancha may process information needed to support account setup, role-specific profiles, marketplace workflows, verification, documents, payments, bookings, conversations, notifications, recommendations, and API partner access."
          eyebrow="Legal"
          secondaryAction={{ label: "Back to legal", href: "/legal" }}
          title="Data Processing"
        />

        <article className="asancha-page-container py-16">
          <section className="space-y-6 text-sm leading-7 text-muted-foreground">
            <h2 className="text-2xl font-bold text-foreground">
              Processing purposes
            </h2>
            <p>
              Data may be processed to provide platform access, support user
              workflows, review required information, communicate status, and
              support controlled partner access.
            </p>

            <h2 className="text-2xl font-bold text-foreground">
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
