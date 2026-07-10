// File: app/(public)/marketplace/page.tsx

/**
 * Asancha Public Marketplace Page
 *
 * Purpose:
 * Shows safe public marketplace previews for guests and public users.
 *
 * Main responsibilities:
 * - Support public marketplace discovery
 * - Show only public-safe sample listing previews
 * - Explain that higher-trust actions require account/profile/approval states
 * - Render CollectionPage and BreadcrumbList JSON-LD
 *
 * Security note:
 * Public marketplace cards must not show private deal packs, seller private
 * details, investor private data, sensitive documents, internal notes,
 * restricted AI analysis, payment data, or ObjectIds.
 */

import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/src/components/seo/json-ld";
import {
  createBreadcrumbJsonLd,
  createMarketplaceCollectionJsonLd,
} from "@/src/lib/seo/json-ld";

export const metadata: Metadata = {
  title: "Marketplace | Asancha",
  description:
    "Browse safe public property previews on Asancha before continuing into account, profile, verification, reservation, booking, or payment workflows.",
  alternates: {
    canonical: "/marketplace",
  },
};

const listings = [
  {
    slug: "sample-investment-opportunity-manchester",
    title: "Investment Opportunity • Manchester",
    location: "Manchester, UK",
    summary:
      "A public-safe sample listing preview. Full details may require account setup and approval.",
    category: "Investor suitable",
  },
  {
    slug: "family-home-birmingham-preview",
    title: "Family Home • Birmingham",
    location: "Birmingham, UK",
    summary:
      "Preview public listing information before continuing into protected workflows.",
    category: "Residential",
  },
  {
    slug: "service-ready-property-leeds",
    title: "Service-Ready Property • Leeds",
    location: "Leeds, UK",
    summary:
      "A safe public preview for marketplace discovery and role education.",
    category: "Property services",
  },
] as const;

/**
 * Renders the public marketplace page.
 */
export default function MarketplacePage() {
  const jsonLd = [
    createMarketplaceCollectionJsonLd(),
    createBreadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Marketplace", path: "/marketplace" },
    ]),
  ] as const;

  return (
    <>
      <JsonLd data={jsonLd} id="marketplace-json-ld" />

      <main>
        <section className="asancha-page-container py-16 sm:py-24">
          <div className="max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-wide text-blue-700">
              Marketplace
            </p>

            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-gray-950 sm:text-5xl">
              Browse public-safe property previews.
            </h1>

            <p className="mt-6 text-lg leading-8 text-gray-600">
              Marketplace previews help guests and public users understand
              available opportunities without exposing sensitive deal data,
              private documents, or restricted internal information.
            </p>
          </div>

          <div className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <h2 className="text-base font-bold text-amber-950">
              Some actions require setup
            </h2>
            <p className="mt-2 text-sm leading-6 text-amber-900">
              Saving, reserving, booking, requesting private information, or
              accessing deal-sensitive details may require sign in, profile
              completion, verification, payment review, or approval.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => (
              <article
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                key={listing.slug}
              >
                <p className="text-xs font-bold uppercase tracking-wide text-blue-700">
                  {listing.category}
                </p>

                <h2 className="mt-3 text-xl font-bold text-gray-950">
                  {listing.title}
                </h2>

                <p className="mt-2 text-sm font-semibold text-gray-700">
                  {listing.location}
                </p>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  {listing.summary}
                </p>

                <Link
                  className="mt-5 inline-flex text-sm font-bold text-blue-700 hover:text-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-100"
                  href={`/marketplace/${listing.slug}`}
                >
                  View public preview
                </Link>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
