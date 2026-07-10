// File: app/(public)/api-partners/page.tsx

/**
 * Asancha API Partners Page
 *
 * Purpose:
 * Explains controlled API partner access for Asancha Web Public.
 *
 * Security note:
 * This page must not expose private API documentation, full API keys,
 * API key hashes, webhook secrets, internal partner logs, or backend URLs.
 */

import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/src/components/seo/json-ld";
import { createPublicPageJsonLdBundle } from "@/src/lib/seo/json-ld";

export const metadata: Metadata = {
  title: "API Partners | Asancha",
  description:
    "Learn about controlled Asancha API partner access, application review, approved scopes, usage, webhooks, billing, and support.",
  alternates: {
    canonical: "/api-partners",
  },
};

/**
 * Renders the API partners public page.
 */
export default function ApiPartnersPage() {
  const jsonLd = createPublicPageJsonLdBundle({
    path: "/api-partners",
    name: "Asancha API Partners",
    description:
      "Learn about controlled Asancha API partner access, application review, approved scopes, usage, webhooks, billing, and support.",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "API Partners", path: "/api-partners" },
    ],
  });

  return (
    <>
      <JsonLd data={jsonLd} id="api-partners-json-ld" />

      <main>
        <section className="asancha-page-container py-16 sm:py-24">
          <p className="text-sm font-bold uppercase tracking-wide text-primary">
            API partners
          </p>

          <h1 className="mt-4 max-w-4xl text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Controlled API access for approved property partners.
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
            API partner access is separate from ordinary public signup. Partners
            apply through a controlled flow, receive review, and access
            partner-safe tools only after approval.
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              "Apply for API access",
              "Wait for review and approval",
              "Use approved scopes, keys, usage, and webhooks safely",
            ].map((item) => (
              <article
                className="rounded-2xl border border-border bg-card p-6 shadow-sm"
                key={item}
              >
                <h2 className="text-lg font-bold text-foreground">{item}</h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  API keys, webhook secrets, usage, billing, and partner
                  documentation are controlled by backend approval and partner
                  permission checks.
                </p>
              </article>
            ))}
          </div>

          <Link
            className="mt-8 inline-flex min-h-12 items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary-hover focus:outline-none focus:ring-4 focus:ring-ring/20"
            href="/api-partner/apply"
          >
            Apply for API access
          </Link>
        </section>
      </main>
    </>
  );
}
