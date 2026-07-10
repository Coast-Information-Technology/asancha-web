// File: app/(public)/legal/platform-rules/page.tsx

/**
 * Asancha Platform Rules Page
 *
 * Purpose:
 * Provides public platform rule guidance for Asancha users.
 *
 * Security note:
 * This page must not expose internal enforcement tooling, staff operations,
 * private moderation notes, or admin-only workflows.
 */

import type { Metadata } from "next";

import { JsonLd } from "@/src/components/seo/json-ld";
import { createPublicPageJsonLdBundle } from "@/src/lib/seo/json-ld";

export const metadata: Metadata = {
  title: "Platform Rules | Asancha",
  description:
    "Review public Asancha platform rules for safe marketplace use, account setup, documents, payments, recommendations, and API partner access.",
  alternates: {
    canonical: "/legal/platform-rules",
  },
};

const rules = [
  "Provide accurate account and profile information.",
  "Do not upload misleading property, document, payment, or API partner information.",
  "Do not treat public previews as full deal-pack access.",
  "Do not treat AI guidance as guaranteed financial, legal, or investment advice.",
  "Do not attempt to access restricted routes, private documents, or API keys without approval.",
  "Respect platform workflows for verification, payment review, bookings, and conversations.",
] as const;

/**
 * Renders the platform rules page.
 */
export default function PlatformRulesPage() {
  const jsonLd = createPublicPageJsonLdBundle({
    path: "/legal/platform-rules",
    name: "Asancha Platform Rules",
    description:
      "Review public Asancha platform rules for safe marketplace use, account setup, documents, payments, recommendations, and API partner access.",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Legal", path: "/legal" },
      { name: "Platform Rules", path: "/legal/platform-rules" },
    ],
  });

  return (
    <>
      <JsonLd data={jsonLd} id="platform-rules-json-ld" />

      <main>
        <article className="asancha-page-container py-16 sm:py-24">
          <p className="text-sm font-bold uppercase tracking-wide text-primary">
            Legal
          </p>

          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Platform Rules
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
            Asancha is designed to keep property workflows clear, safe,
            role-aware, and verification-aware.
          </p>

          <section className="mt-10 grid gap-5 md:grid-cols-2">
            {rules.map((rule) => (
              <article
                className="rounded-2xl border border-border bg-card p-6 shadow-sm"
                key={rule}
              >
                <h2 className="text-base font-bold text-foreground">{rule}</h2>
              </article>
            ))}
          </section>
        </article>
      </main>
    </>
  );
}
