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

import { apiGet } from "../../../lib/api/api-client";

import { MARKETPLACE_API_ENDPOINTS } from "../constants/marketplace.constants";
import type {
  MarketplaceFilterConfiguration,
  MarketplaceFilters,
  MarketplaceListingCollection,
  MarketplaceListingDetail,
  MarketplaceQuery,
} from "../types/marketplace.types";

function appendStringArray(
  searchParams: URLSearchParams,
  key: string,
  values: readonly string[] | undefined,
): void {
  if (!values || values.length === 0) {
    return;
  }

  for (const value of values) {
    const normalizedValue = value.trim();

    if (normalizedValue) {
      searchParams.append(key, normalizedValue);
    }
  }
}

function appendNumber(
  searchParams: URLSearchParams,
  key: string,
  value: number | null | undefined,
): void {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return;
  }

  searchParams.set(key, String(value));
}

function appendString(
  searchParams: URLSearchParams,
  key: string,
  value: string | null | undefined,
): void {
  const normalizedValue = value?.trim();

  if (normalizedValue) {
    searchParams.set(key, normalizedValue);
  }
}

function createMarketplaceQueryString(
  query: MarketplaceQuery | Partial<MarketplaceFilters>,
): string {
  const searchParams = new URLSearchParams();

  appendString(searchParams, "search", query.search);

  appendStringArray(searchParams, "locations", query.locations);

  appendStringArray(searchParams, "propertyTypes", query.propertyTypes);

  appendStringArray(searchParams, "listingTypes", query.listingTypes);

  appendStringArray(searchParams, "listingCategories", query.listingCategories);

  appendStringArray(searchParams, "strategies", query.strategies);

  appendStringArray(searchParams, "occupancyStatuses", query.occupancyStatuses);

  appendStringArray(searchParams, "dealStatuses", query.dealStatuses);

  appendStringArray(
    searchParams,
    "calculatedStatuses",
    query.calculatedStatuses,
  );

  appendNumber(searchParams, "minimumPrice", query.minimumPrice);

  appendNumber(searchParams, "maximumPrice", query.maximumPrice);

  appendNumber(searchParams, "minimumBedrooms", query.minimumBedrooms);

  appendNumber(searchParams, "maximumBedrooms", query.maximumBedrooms);

  appendNumber(searchParams, "minimumBathrooms", query.minimumBathrooms);

  appendNumber(searchParams, "maximumBathrooms", query.maximumBathrooms);

  appendNumber(
    searchParams,
    "minimumBmvDiscountPercent",
    query.minimumBmvDiscountPercent,
  );

  appendNumber(
    searchParams,
    "minimumGrossYieldPercent",
    query.minimumGrossYieldPercent,
  );

  appendNumber(searchParams, "minimumRoiPercent", query.minimumRoiPercent);

  appendString(searchParams, "listedFrom", query.listedFrom);

  appendString(searchParams, "listedTo", query.listedTo);

  appendString(searchParams, "sort", query.sort);

  appendNumber(searchParams, "page", query.page);

  appendNumber(searchParams, "pageSize", query.pageSize);

  const queryString = searchParams.toString();

  return queryString ? `?${queryString}` : "";
}

async function getListings(
  query: MarketplaceQuery | Partial<MarketplaceFilters> = {},
): Promise<MarketplaceListingCollection> {
  const queryString = createMarketplaceQueryString(query);

  return apiGet<MarketplaceListingCollection>(
    `${MARKETPLACE_API_ENDPOINTS.listings}${queryString}`,
  );
}

async function getListing(
  listingSlug: string,
): Promise<MarketplaceListingDetail> {
  return apiGet<MarketplaceListingDetail>(
    MARKETPLACE_API_ENDPOINTS.listing(listingSlug),
  );
}

async function getFilterConfiguration(): Promise<MarketplaceFilterConfiguration> {
  return apiGet<MarketplaceFilterConfiguration>(
    MARKETPLACE_API_ENDPOINTS.filters,
  );
}

export const marketplaceApi = {
  getListings,
  getListing,
  getFilterConfiguration,
} as const;
