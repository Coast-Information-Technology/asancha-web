// File: src/features/marketplace/types/marketplace.types.ts

/**
 * Asancha Marketplace Types
 *
 * Purpose:
 * Defines the public-safe contracts used by the Asancha marketplace listing,
 * filtering, sorting, pagination, and listing-detail experiences.
 *
 * Responsibilities:
 * - Define public marketplace filters and query parameters.
 * - Define public-safe listing-card data.
 * - Define public-safe listing-detail data.
 * - Define restricted-section guidance.
 * - Define available filter options returned by the backend.
 * - Define marketplace hook state and actions.
 *
 * Security notes:
 * - Marketplace responses must use public IDs and slugs only.
 * - MongoDB ObjectIds must never appear in these contracts.
 * - Private deal packs, seller contact details, sensitive documents,
 *   internal notes, payment data, restricted AI output, storage keys,
 *   and private media URLs must never be exposed.
 * - Frontend filtering and visibility controls are UX guidance only.
 * - Backend marketplace visibility and resource-access rules remain final.
 */

export type MarketplaceCurrency = "GBP";

export type MarketplaceListingType = "sale" | "rent" | "refurbishment";

export type MarketplaceListingCategory =
  | "off_market"
  | "bmv"
  | "market_listing"
  | "distressed"
  | "auction_led"
  | "development_opportunity"
  | "manual";

export type MarketplacePropertyType =
  | "apartment"
  | "terraced_house"
  | "detached_house"
  | "semi_detached"
  | "bungalow"
  | "hmo"
  | "block_of_flats"
  | "land"
  | "commercial"
  | "development_site"
  | "other";

export type MarketplaceOccupancyStatus =
  "vacant" | "tenanted" | "part_occupied" | "unknown";

export type MarketplaceTenureType =
  "freehold" | "leasehold" | "share_of_freehold" | "commonhold" | "other";

export type MarketplaceDealStatus =
  | "published"
  | "reserved"
  | "under_offer"
  | "due_diligence"
  | "exchanged"
  | "completed"
  | "sold";

export type MarketplaceCalculatedStatus =
  "available" | "under_offer" | "reserved" | "inactive";

export type MarketplaceInvestmentStrategy =
  | "buy_to_let"
  | "buy_refurbish_refinance"
  | "flip"
  | "hmo"
  | "serviced_accommodation"
  | "development"
  | "commercial_conversion"
  | "land"
  | "portfolio_purchase"
  | "other";

export type MarketplaceSort =
  | "newest"
  | "oldest"
  | "price_low_to_high"
  | "price_high_to_low"
  | "highest_yield"
  | "highest_roi"
  | "largest_bmv_discount";

export type MarketplaceViewMode = "grid" | "list";

export type MarketplaceVerificationStatus =
  "verified" | "partially_verified" | "not_verified";

export type MarketplaceRequestState =
  | "idle"
  | "loading"
  | "refreshing"
  | "loading_more"
  | "success"
  | "empty"
  | "error";

export type MarketplaceRestrictionReason =
  | "authentication_required"
  | "profile_required"
  | "verification_required"
  | "payment_required"
  | "reservation_required"
  | "permission_required";

export interface MarketplacePriceRange {
  minimum: number | null;
  maximum: number | null;
  currency: MarketplaceCurrency;
}

export interface MarketplacePercentageRange {
  minimum: number | null;
  maximum: number | null;
}

export interface MarketplaceFilters {
  search: string;
  locations: string[];
  propertyTypes: MarketplacePropertyType[];
  tenureTypes: MarketplaceTenureType[];
  listingTypes: MarketplaceListingType[];
  listingCategories: MarketplaceListingCategory[];
  strategies: MarketplaceInvestmentStrategy[];
  occupancyStatuses: MarketplaceOccupancyStatus[];
  dealStatuses: MarketplaceDealStatus[];
  calculatedStatuses: MarketplaceCalculatedStatus[];

  minimumPrice: number | null;
  maximumPrice: number | null;
  minimumBedrooms: number | null;
  maximumBedrooms: number | null;
  minimumBathrooms: number | null;
  maximumBathrooms: number | null;

  minimumBmvDiscountPercent: number | null;
  minimumGrossYieldPercent: number | null;
  minimumRoiPercent: number | null;
  minimumEstimatedMonthlyRent: number | null;

  listedFrom: string | null;
  listedTo: string | null;

  sort: MarketplaceSort;
  page: number;
  pageSize: number;
}

export interface MarketplaceLocationSummary {
  displayName: string;
  townOrCity: string | null;
  county: string | null;
  postcodeDistrict: string | null;
  countryCode: string;
}

export interface MarketplacePublicMedia {
  mediaPublicId: string;
  mediaType: "image" | "floorplan" | "video";
  url: string;
  altText: string;
  caption: string | null;
  width: number | null;
  height: number | null;
  sortOrder: number;
  isCover: boolean;
}

export interface MarketplaceInvestmentMetrics {
  askingPrice: number | null;
  estimatedMarketValue: number | null;
  bmvDiscountPercent: number | null;
  estimatedMonthlyRent: number | null;
  estimatedAnnualRent: number | null;
  grossYieldPercent: number | null;
  estimatedRoiPercent: number | null;
  refurbishmentEstimate: number | null;
  totalInvestmentEstimate: number | null;
  currency: MarketplaceCurrency;
  disclaimer: string | null;
}

export interface MarketplaceInvestorMatchSummary {
  scorePercent: number;
  matchReasons: string[];
  mismatchReasons: string[];
}

export interface MarketplaceListingCard {
  listingPublicId: string;
  slug: string;
  title: string;
  shortDescription: string | null;

  location: MarketplaceLocationSummary;
  propertyType: MarketplacePropertyType;
  listingType: MarketplaceListingType;
  listingCategory: MarketplaceListingCategory;

  bedrooms: number | null;
  bathrooms: number | null;
  occupancyStatus: MarketplaceOccupancyStatus | null;
  tenureType?: MarketplaceTenureType | null;

  dealStatus: MarketplaceDealStatus;
  calculatedStatus: MarketplaceCalculatedStatus;

  price: number | null;
  currency: MarketplaceCurrency;

  investmentMetrics: MarketplaceInvestmentMetrics | null;

  coverImage: MarketplacePublicMedia | null;
  badges: string[];

  isFeatured: boolean;
  isSaved: boolean;
  canSave: boolean;
  investorMatch?: MarketplaceInvestorMatchSummary | null;
  verificationStatus?: MarketplaceVerificationStatus | null;

  publishedAt: string;
  updatedAt: string;
}

export interface MarketplaceRestrictedSection {
  key: string;
  title: string;
  reason: MarketplaceRestrictionReason;
  message: string;
  actionLabel: string | null;
  actionPath: string | null;
}

export interface MarketplaceListingDetail {
  listingPublicId: string;
  slug: string;
  title: string;
  description: string;
  shortDescription: string | null;

  location: MarketplaceLocationSummary;
  propertyType: MarketplacePropertyType;
  listingType: MarketplaceListingType;
  listingCategory: MarketplaceListingCategory;

  bedrooms: number | null;
  bathrooms: number | null;
  receptionRooms: number | null;
  occupancyStatus: MarketplaceOccupancyStatus | null;
  tenureType: MarketplaceTenureType | null;

  dealStatus: MarketplaceDealStatus;
  calculatedStatus: MarketplaceCalculatedStatus;

  price: number | null;
  currency: MarketplaceCurrency;

  investmentMetrics: MarketplaceInvestmentMetrics | null;
  publicMedia: MarketplacePublicMedia[];
  features: string[];
  strategies: MarketplaceInvestmentStrategy[];
  badges: string[];

  isFeatured: boolean;
  isSaved: boolean;
  canSave: boolean;
  canRequestAccess: boolean;
  canReserve: boolean;
  canStartConversation: boolean;

  restrictedSections: MarketplaceRestrictedSection[];

  publishedAt: string;
  updatedAt: string;
}

export interface MarketplacePagination {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface MarketplaceListingCollection {
  items: MarketplaceListingCard[];
  pagination: MarketplacePagination;
  appliedFilters: Partial<MarketplaceFilters>;
}

export interface MarketplaceFilterOption<TValue extends string = string> {
  value: TValue;
  label: string;
  count: number | null;
}

export interface MarketplaceFilterConfiguration {
  locations: MarketplaceFilterOption[];
  propertyTypes: MarketplaceFilterOption<MarketplacePropertyType>[];
  tenureTypes: MarketplaceFilterOption<MarketplaceTenureType>[];
  listingTypes: MarketplaceFilterOption<MarketplaceListingType>[];
  listingCategories: MarketplaceFilterOption<MarketplaceListingCategory>[];
  strategies: MarketplaceFilterOption<MarketplaceInvestmentStrategy>[];
  occupancyStatuses: MarketplaceFilterOption<MarketplaceOccupancyStatus>[];
  dealStatuses: MarketplaceFilterOption<MarketplaceDealStatus>[];

  priceRange: MarketplacePriceRange;
  bedroomRange: {
    minimum: number;
    maximum: number;
  };
  bathroomRange: {
    minimum: number;
    maximum: number;
  };
  bmvDiscountRange: MarketplacePercentageRange;
  grossYieldRange: MarketplacePercentageRange;
  roiRange: MarketplacePercentageRange;

  updatedAt: string;
}

export interface MarketplaceQuery {
  search?: string;
  locations?: string[];
  propertyTypes?: MarketplacePropertyType[];
  tenureTypes?: MarketplaceTenureType[];
  listingTypes?: MarketplaceListingType[];
  listingCategories?: MarketplaceListingCategory[];
  strategies?: MarketplaceInvestmentStrategy[];
  occupancyStatuses?: MarketplaceOccupancyStatus[];
  dealStatuses?: MarketplaceDealStatus[];
  calculatedStatuses?: MarketplaceCalculatedStatus[];

  minimumPrice?: number;
  maximumPrice?: number;
  minimumBedrooms?: number;
  maximumBedrooms?: number;
  minimumBathrooms?: number;
  maximumBathrooms?: number;

  minimumBmvDiscountPercent?: number;
  minimumGrossYieldPercent?: number;
  minimumRoiPercent?: number;
  minimumEstimatedMonthlyRent?: number;

  listedFrom?: string;
  listedTo?: string;

  sort?: MarketplaceSort;
  page?: number;
  pageSize?: number;
}

export interface MarketplaceHookState {
  requestState: MarketplaceRequestState;

  listings: MarketplaceListingCard[];
  selectedListing: MarketplaceListingDetail | null;
  filterConfiguration: MarketplaceFilterConfiguration | null;
  filters: MarketplaceFilters;
  pagination: MarketplacePagination | null;

  viewMode: MarketplaceViewMode;
  errorMessage: string | null;

  isLoading: boolean;
  isRefreshing: boolean;
  isLoadingMore: boolean;
  isEmpty: boolean;
}

export interface MarketplaceHookActions {
  loadMarketplace: (
    filters?: Partial<MarketplaceFilters>,
  ) => Promise<MarketplaceListingCollection | null>;

  refreshMarketplace: () => Promise<MarketplaceListingCollection | null>;

  loadMore: () => Promise<MarketplaceListingCollection | null>;

  loadListing: (
    listingSlug: string,
  ) => Promise<MarketplaceListingDetail | null>;

  loadFilterConfiguration: () => Promise<MarketplaceFilterConfiguration | null>;

  setFilters: (filters: Partial<MarketplaceFilters>) => void;

  replaceFilters: (filters: MarketplaceFilters) => void;

  resetFilters: () => void;

  setViewMode: (viewMode: MarketplaceViewMode) => void;

  clearSelectedListing: () => void;

  clearError: () => void;

  reset: () => void;
}

export type UseMarketplaceResult = MarketplaceHookState &
  MarketplaceHookActions;
