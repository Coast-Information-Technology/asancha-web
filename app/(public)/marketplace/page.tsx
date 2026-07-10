// File: app/(public)/marketplace/page.tsx

/**
 * Asancha Public Marketplace Page
 *
 * Purpose:
 * Provides the server-rendered entry point for public marketplace discovery.
 *
 * Responsibilities:
 * - Define marketplace metadata and canonical URL.
 * - Render CollectionPage and BreadcrumbList JSON-LD.
 * - Explain public marketplace visibility and restricted actions.
 * - Mount the interactive marketplace browser.
 *
 * Security notes:
 * - Public marketplace responses must contain public-safe listing data only.
 * - Private deal packs, seller contact details, sensitive documents,
 *   restricted AI analysis, payment information, internal notes, storage
 *   keys, and MongoDB ObjectIds must never be rendered.
 * - Frontend visibility controls are UX guidance only.
 * - Backend publication and access-control rules remain final.
 */

import type { Metadata } from "next";

import { MarketplaceBrowser } from "@/src/components/marketplace/marketplace-browser";
import { JsonLd } from "@/src/components/seo/json-ld";
import {
  createBreadcrumbJsonLd,
  createMarketplaceCollectionJsonLd,
} from "@/src/lib/seo/json-ld";

export const metadata: Metadata = {
  title: "Property Marketplace | Asancha",
  description:
    "Browse public property and investment opportunity previews across the UK on Asancha.",
  alternates: {
    canonical: "/marketplace",
  },
  openGraph: {
    title: "Property Marketplace | Asancha",
    description:
      "Discover public property and investment opportunity previews across the UK.",
    url: "/marketplace",
    type: "website",
  },
};

/**
 * Renders the public marketplace discovery page.
 */
export default function MarketplacePage() {
  const jsonLd = [
    createMarketplaceCollectionJsonLd(),
    createBreadcrumbJsonLd([
      {
        name: "Home",
        path: "/",
      },
      {
        name: "Marketplace",
        path: "/marketplace",
      },
    ]),
  ] as const;

  return (
    <>
      <JsonLd data={jsonLd} id="marketplace-json-ld" />

      <main>
        <section
          aria-labelledby="marketplace-heading"
          className="asancha-page-container py-12 sm:py-16 lg:py-20"
        >
          <div className="max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-wide text-primary">
              Property Marketplace
            </p>

            <h1
              className="mt-4 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl"
              id="marketplace-heading"
            >
              Find property opportunities that fit your strategy.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
              Search public property previews by location, property type,
              budget, investment strategy, yield, and below-market-value
              preferences.
            </p>
          </div>

          <div
            className="mt-8 rounded-2xl border border-accent bg-accent p-5"
            role="note"
          >
            <h2 className="text-base font-bold text-accent-foreground">
              Some deal information requires a verified account
            </h2>

            <p className="mt-2 text-sm leading-6 text-accent-foreground">
              Public previews do not include private deal packs, sensitive
              documents, seller contact details, or restricted analysis. Saving,
              reserving, messaging, and accessing protected deal information may
              require sign-in, profile completion, verification, payment, or
              approval.
            </p>
          </div>

          <MarketplaceBrowser />
        </section>
      </main>
    </>
  );
}
