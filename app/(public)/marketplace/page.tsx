// File: app/(public)/marketplace/page.tsx

/**
 * Asancha Public Marketplace Page
 *
 * Purpose:
 * Provides the server-rendered entry point for public marketplace discovery.
 *
 * Main responsibilities:
 * - Define marketplace metadata and canonical URL
 * - Render CollectionPage and BreadcrumbList JSON-LD
 * - Explain public marketplace visibility and restricted actions
 * - Set clear expectations around public previews and protected deal actions
 * - Mount the interactive marketplace browser
 *
 * Accessibility note:
 * Uses one H1, semantic sections, clear explanatory notes, and descriptive
 * public-safe marketplace copy.
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

import { JsonLd } from "@/src/components/seo/json-ld";
import {
  createBreadcrumbJsonLd,
  createMarketplaceCollectionJsonLd,
} from "@/src/lib/seo/json-ld";

import { MarketplacePageExperience } from "./_components/marketplace-page-experience";

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
      "Discover public property and investment opportunity previews across the UK with Asancha.",
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
      <MarketplacePageExperience />
    </>
  );
}
