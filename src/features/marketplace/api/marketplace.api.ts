// File: src/features/marketplace/api/marketplace.api.ts

/**
 * Asancha Marketplace API
 *
 * Purpose:
 * Provides typed public API functions for listing discovery, listing detail,
 * and available marketplace filters.
 *
 * Responsibilities:
 * - Build safe marketplace query strings.
 * - Retrieve public listing-card collections.
 * - Retrieve one public listing by slug.
 * - Retrieve backend-provided marketplace filter options.
 *
 * Security notes:
 * - These endpoints are public and must return public-safe data only.
 * - Private listing information must never be requested from this feature.
 * - Public listing detail must not include private seller details, deal packs,
 *   sensitive documents, payment records, restricted AI analysis, internal
 *   notes, ObjectIds, storage keys, or private media URLs.
 * - Backend marketplace publication and visibility rules remain final.
 */

import {
  getDummyMarketplaceFilterConfiguration,
  getDummyMarketplaceListingDetail,
  getDummyMarketplaceListings,
} from "../constants/marketplace-dummy-data";
import type {
  MarketplaceFilterConfiguration,
  MarketplaceFilters,
  MarketplaceListingCollection,
  MarketplaceListingDetail,
  MarketplaceQuery,
} from "../types/marketplace.types";

async function getListings(
  query: MarketplaceQuery | Partial<MarketplaceFilters> = {},
): Promise<MarketplaceListingCollection> {
  return getDummyMarketplaceListings(query);
}

async function getListing(
  listingSlug: string,
): Promise<MarketplaceListingDetail> {
  return getDummyMarketplaceListingDetail(listingSlug);
}

async function getFilterConfiguration(): Promise<MarketplaceFilterConfiguration> {
  return getDummyMarketplaceFilterConfiguration();
}

export const marketplaceApi = {
  getListings,
  getListing,
  getFilterConfiguration,
} as const;
