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
 * - Prioritise property search, filters, and opportunity results
 * - Progressively disclose protected-access guidance
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

import { MARKETPLACE_STRATEGY_OPTIONS } from "@/src/features/marketplace/constants/marketplace.constants";
import type {
  MarketplaceFilters,
  MarketplaceInvestmentStrategy,
} from "@/src/features/marketplace/types/marketplace.types";

interface MarketplacePageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function firstSearchParam(
  value: string | string[] | undefined,
): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function parseMaximumPrice(value: string | undefined): number | null {
  if (!value) {
    return null;
  }

  const parsedValue = Number(value);

  return Number.isFinite(parsedValue) && parsedValue >= 0 ? parsedValue : null;
}

function parseStrategy(
  value: string | undefined,
): MarketplaceInvestmentStrategy[] {
  const isSupported = MARKETPLACE_STRATEGY_OPTIONS.some(
    (option) => option.value === value,
  );

  return isSupported ? [value as MarketplaceInvestmentStrategy] : [];
}

export const metadata: Metadata = {
  title: "Find Properties | Asancha",
  description:
    "Browse public property and investment opportunity previews across the UK on Asancha.",
  alternates: {
    canonical: "/marketplace",
  },
  openGraph: {
    title: "Find Properties | Asancha",
    description:
      "Discover public property and investment opportunity previews across the UK with Asancha.",
    url: "/marketplace",
    type: "website",
  },
};

/**
 * Renders the public marketplace discovery page.
 */
export default async function MarketplacePage({
  searchParams,
}: MarketplacePageProps) {
  const resolvedSearchParams = await searchParams;
  const initialFilters: Partial<MarketplaceFilters> = {
    search: firstSearchParam(resolvedSearchParams.search)?.trim() ?? "",
    maximumPrice: parseMaximumPrice(
      firstSearchParam(resolvedSearchParams.maximumPrice),
    ),
    strategies: parseStrategy(firstSearchParam(resolvedSearchParams.strategy)),
  };
  const jsonLd = [
    createMarketplaceCollectionJsonLd(),
    createBreadcrumbJsonLd([
      {
        name: "Home",
        path: "/",
      },
      {
        name: "Find Properties",
        path: "/marketplace",
      },
    ]),
  ] as const;

  return (
    <>
      <JsonLd data={jsonLd} id="marketplace-json-ld" />
      <MarketplacePageExperience initialFilters={initialFilters} />
    </>
  );
}
