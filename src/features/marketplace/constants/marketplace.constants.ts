// File: src/features/marketplace/constants/marketplace.constants.ts

/**
 * Asancha Marketplace Constants
 *
 * Purpose:
 * Defines stable marketplace routes, endpoint paths, filter options,
 * pagination limits, sort options, default filters, and public-safe messages.
 *
 * Responsibilities:
 * - Keep marketplace API paths in one place.
 * - Define allowed public filter and sort values.
 * - Provide default marketplace state.
 * - Provide filter labels for public interfaces.
 * - Provide safe empty and error messages.
 *
 * Security notes:
 * - These constants do not grant access to restricted listing information.
 * - Backend marketplace visibility rules remain final.
 * - Admin, staff, private document, payment, and internal API routes must not
 *   be included here.
 */

import type {
  MarketplaceFilters,
  MarketplaceInvestmentStrategy,
  MarketplaceListingCategory,
  MarketplaceListingType,
  MarketplaceOccupancyStatus,
  MarketplacePropertyType,
  MarketplaceSort,
  MarketplaceTenureType,
  MarketplaceViewMode,
} from "../types/marketplace.types";

export const MARKETPLACE_API_ENDPOINTS = {
  listings: "/marketplace/listings",

  listing: (listingSlug: string): string =>
    `/marketplace/listings/${encodeURIComponent(listingSlug)}`,

  filters: "/marketplace/filters",
} as const;

export const MARKETPLACE_PAGE_ROUTES = {
  root: "/marketplace",

  listing: (listingSlug: string): string =>
    `/marketplace/${encodeURIComponent(listingSlug)}`,

  signIn: "/auth/sign-in",
  signUp: "/auth/sign-up",
  verification: "/verification",
  recommendations: "/recommendations",
} as const;

export const MARKETPLACE_PAGE_SIZE_OPTIONS = [12, 24, 36, 48] as const;

export const MARKETPLACE_DEFAULT_PAGE_SIZE = 12;

export const MARKETPLACE_MAX_PAGE_SIZE = 48;

export const MARKETPLACE_DEFAULT_VIEW_MODE =
  "grid" as const satisfies MarketplaceViewMode;

export const MARKETPLACE_SORT_OPTIONS = [
  {
    value: "newest",
    label: "Newest first",
  },
  {
    value: "oldest",
    label: "Oldest first",
  },
  {
    value: "price_low_to_high",
    label: "Price: low to high",
  },
  {
    value: "price_high_to_low",
    label: "Price: high to low",
  },
  {
    value: "highest_yield",
    label: "Highest gross yield",
  },
  {
    value: "highest_roi",
    label: "Highest estimated ROI",
  },
  {
    value: "largest_bmv_discount",
    label: "Largest BMV discount",
  },
] as const satisfies ReadonlyArray<{
  value: MarketplaceSort;
  label: string;
}>;

export const MARKETPLACE_PROPERTY_TYPE_OPTIONS = [
  {
    value: "apartment",
    label: "Apartment",
  },
  {
    value: "terraced_house",
    label: "Terraced house",
  },
  {
    value: "detached_house",
    label: "Detached house",
  },
  {
    value: "semi_detached",
    label: "Semi-detached house",
  },
  {
    value: "bungalow",
    label: "Bungalow",
  },
  {
    value: "hmo",
    label: "HMO",
  },
  {
    value: "block_of_flats",
    label: "Block of flats",
  },
  {
    value: "land",
    label: "Land",
  },
  {
    value: "commercial",
    label: "Commercial property",
  },
  {
    value: "development_site",
    label: "Development site",
  },
  {
    value: "other",
    label: "Other",
  },
] as const satisfies ReadonlyArray<{
  value: MarketplacePropertyType;
  label: string;
}>;

export const MARKETPLACE_TENURE_OPTIONS = [
  {
    value: "freehold",
    label: "Freehold",
  },
  {
    value: "leasehold",
    label: "Leasehold",
  },
  {
    value: "share_of_freehold",
    label: "Share of freehold",
  },
  {
    value: "commonhold",
    label: "Commonhold",
  },
  {
    value: "other",
    label: "Other",
  },
] as const satisfies ReadonlyArray<{
  value: MarketplaceTenureType;
  label: string;
}>;

export const MARKETPLACE_LISTING_TYPE_OPTIONS = [
  {
    value: "sale",
    label: "For sale",
  },
  {
    value: "rent",
    label: "To rent",
  },
  {
    value: "refurbishment",
    label: "Refurbishment opportunity",
  },
] as const satisfies ReadonlyArray<{
  value: MarketplaceListingType;
  label: string;
}>;

export const MARKETPLACE_LISTING_CATEGORY_OPTIONS = [
  {
    value: "off_market",
    label: "Off market",
  },
  {
    value: "bmv",
    label: "Below market value",
  },
  {
    value: "market_listing",
    label: "Market listing",
  },
  {
    value: "distressed",
    label: "Distressed opportunity",
  },
  {
    value: "auction_led",
    label: "Auction-led",
  },
  {
    value: "development_opportunity",
    label: "Development opportunity",
  },
  {
    value: "manual",
    label: "Other opportunity",
  },
] as const satisfies ReadonlyArray<{
  value: MarketplaceListingCategory;
  label: string;
}>;

export const MARKETPLACE_STRATEGY_OPTIONS = [
  {
    value: "buy_to_let",
    label: "Buy to let",
  },
  {
    value: "buy_refurbish_refinance",
    label: "Buy, refurbish and refinance",
  },
  {
    value: "flip",
    label: "Buy, refurbish and sell",
  },
  {
    value: "hmo",
    label: "HMO",
  },
  {
    value: "serviced_accommodation",
    label: "Serviced accommodation",
  },
  {
    value: "development",
    label: "Development",
  },
  {
    value: "commercial_conversion",
    label: "Commercial conversion",
  },
  {
    value: "land",
    label: "Land",
  },
  {
    value: "portfolio_purchase",
    label: "Portfolio purchase",
  },
  {
    value: "other",
    label: "Other",
  },
] as const satisfies ReadonlyArray<{
  value: MarketplaceInvestmentStrategy;
  label: string;
}>;

export const MARKETPLACE_OCCUPANCY_OPTIONS = [
  {
    value: "vacant",
    label: "Vacant",
  },
  {
    value: "tenanted",
    label: "Tenanted",
  },
  {
    value: "part_occupied",
    label: "Part occupied",
  },
  {
    value: "unknown",
    label: "Unknown",
  },
] as const satisfies ReadonlyArray<{
  value: MarketplaceOccupancyStatus;
  label: string;
}>;

export const DEFAULT_MARKETPLACE_FILTERS: MarketplaceFilters = {
  search: "",
  locations: [],
  propertyTypes: [],
  tenureTypes: [],
  listingTypes: [],
  listingCategories: [],
  strategies: [],
  occupancyStatuses: [],
  dealStatuses: [],
  calculatedStatuses: [],

  minimumPrice: null,
  maximumPrice: null,
  minimumBedrooms: null,
  maximumBedrooms: null,
  minimumBathrooms: null,
  maximumBathrooms: null,

  minimumBmvDiscountPercent: null,
  minimumGrossYieldPercent: null,
  minimumRoiPercent: null,
  minimumEstimatedMonthlyRent: null,

  listedFrom: null,
  listedTo: null,

  sort: "newest",
  page: 1,
  pageSize: MARKETPLACE_DEFAULT_PAGE_SIZE,
};

export const MARKETPLACE_SAFE_MESSAGES = {
  loadError: "We could not load marketplace listings. Please refresh the page.",

  listingLoadError:
    "We could not load this property opportunity. It may no longer be publicly available.",

  filtersLoadError: "We could not load the available marketplace filters.",

  empty:
    "Try widening your location, budget or investment criteria to see more property opportunities.",

  signInToSave: "Create an account or sign in to save this property.",

  verificationRequired:
    "Complete verification to access this deal information.",

  restrictedDetails:
    "Some deal details are available only to verified investors.",

  paymentRequired: "This section requires payment before access.",

  aiDisclaimer:
    "Property metrics and AI-supported insights are estimates and do not guarantee financial, legal, rental, resale, or completion outcomes.",
} as const;

export function getMarketplaceSortLabel(sort: MarketplaceSort): string {
  return (
    MARKETPLACE_SORT_OPTIONS.find((option) => option.value === sort)?.label ??
    sort
  );
}
