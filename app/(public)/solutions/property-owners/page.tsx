// File: app/(public)/solutions/property-owners/page.tsx

/**
 * Asancha Property Owner Solution Page
 *
 * Purpose:
 * Explains Asancha for property owners.
 *
 * Security note:
 * This page must not expose private property documents, internal review
 * decisions, private payment data, or admin notes.
 */

import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/src/components/seo/json-ld";
import { createPublicPageJsonLdBundle } from "@/src/lib/seo/json-ld";

export const metadata: Metadata = {
  title: "For Property Owners | Asancha",
  description:
    "Learn how property owners can use Asancha to prepare property information, manage listings, upload documents, and follow verification-aware workflows.",
  alternates: {
    canonical: "/solutions/property-owners",
  },
};

/**
 * Renders the property owner solution page.
 */
export default function PropertyOwnersSolutionPage() {
  const jsonLd = createPublicPageJsonLdBundle({
    path: "/solutions/property-owners",
    name: "Asancha for Property Owners",
    description:
      "Learn how property owners can use Asancha to prepare property information, manage listings, upload documents, and follow verification-aware workflows.",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Solutions", path: "/solutions/property-owners" },
      { name: "Property Owners", path: "/solutions/property-owners" },
    ],
  });

  return (
    <>
      <JsonLd data={jsonLd} id="property-owners-json-ld" />

      <main>
        <section className="asancha-page-container py-16 sm:py-24">
          <p className="text-sm font-bold uppercase tracking-wide text-primary">
            For property owners
          </p>

          <h1 className="mt-4 max-w-4xl text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Present your property through a clearer, safer listing workflow.
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
            Asancha helps property owners prepare property information, manage
            listings, upload required documents, and follow review or
            verification steps where needed.
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              "Create property records",
              "Manage listing workflow",
              "Respond to document or verification requests",
            ].map((item) => (
              <article
                className="rounded-2xl border border-border bg-card p-6 shadow-sm"
                key={item}
              >
                <h2 className="text-lg font-bold text-foreground">{item}</h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Sensitive information remains gated and should only be shown
                  through backend-approved user-facing responses.
                </p>
              </article>
            ))}
          </div>

          <Link
            className="mt-8 inline-flex min-h-12 items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary-hover focus:outline-none focus:ring-4 focus:ring-ring/20"
            href="/auth/sign-up"
          >
            Start as a property owner
          </Link>
        </section>
      </main>
    </>
  );
}
