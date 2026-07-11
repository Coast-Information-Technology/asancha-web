// File: src/features/listings/constants/listings.constants.ts

/**
 * Asancha Listing Constants
 *
 * Purpose:
 * Defines listing API endpoints, workspace routes, lifecycle options,
 * creation defaults, filters, and public-safe messages.
 *
 * Responsibilities:
 * - Keep listing endpoint paths in one place.
 * - Define listing type, category, status, visibility, and strategy options.
 * - Define role-aware listing workspace routes.
 * - Provide default listing filters and form values.
 * - Provide safe user-facing messages.
 *
 * Security notes:
 * - Users may create, edit, submit, withdraw, or delete only where allowed.
 * - Approval, publication, unpublication, and protected deal lifecycle changes
 *   remain backend/admin-controlled.
 * - Frontend constants do not grant permissions.
 */

import type {
  ListingCategory,
  ListingCreateValues,
  ListingDealStatus,
  ListingFilters,
  ListingInvestmentStrategy,
  ListingStatus,
  ListingType,
  ListingVisibility,
  ListingWorkspaceRole,
} from "../types/listings.types";

export const LISTINGS_API_ENDPOINTS = {
  create: "/listings",
  mine: "/listings/me",

  listing: (listingPublicId: string): string =>
    `/listings/${encodeURIComponent(listingPublicId)}`,

  submit: (listingPublicId: string): string =>
    `/listings/${encodeURIComponent(listingPublicId)}/submit`,

  withdraw: (listingPublicId: string): string =>
    `/listings/${encodeURIComponent(listingPublicId)}/withdraw`,
} as const;

export const LISTING_PAGE_ROUTES = {
  ownerList: "/dashboard/property-owner/listings",

  ownerCreate: (propertyPublicId?: string): string =>
    propertyPublicId
      ? `/dashboard/property-owner/listings/new?propertyPublicId=${encodeURIComponent(
          propertyPublicId,
        )}`
      : "/dashboard/property-owner/listings/new",

  ownerDetail: (listingPublicId: string): string =>
    `/dashboard/property-owner/listings/${encodeURIComponent(listingPublicId)}`,

  ownerEdit: (listingPublicId: string): string =>
    `/dashboard/property-owner/listings/${encodeURIComponent(
      listingPublicId,
    )}/edit`,

  agentList: "/dashboard/property-agent/listings",

  agentCreate: (propertyPublicId?: string): string =>
    propertyPublicId
      ? `/dashboard/property-agent/listings/new?propertyPublicId=${encodeURIComponent(
          propertyPublicId,
        )}`
      : "/dashboard/property-agent/listings/new",

  agentDetail: (listingPublicId: string): string =>
    `/dashboard/property-agent/listings/${encodeURIComponent(listingPublicId)}`,

  agentEdit: (listingPublicId: string): string =>
    `/dashboard/property-agent/listings/${encodeURIComponent(
      listingPublicId,
    )}/edit`,

  sourcerList: "/dashboard/property-sourcer/deals",
  sourcerCreate: "/dashboard/property-sourcer/deals/new",

  sourcerDetail: (listingPublicId: string): string =>
    `/dashboard/property-sourcer/deals/${encodeURIComponent(listingPublicId)}`,

  sourcerEdit: (listingPublicId: string): string =>
    `/dashboard/property-sourcer/deals/${encodeURIComponent(
      listingPublicId,
    )}/edit`,

  marketplace: "/marketplace",

  publicListing: (slug: string): string =>
    `/marketplace/${encodeURIComponent(slug)}`,
} as const;

export const LISTING_WORKSPACE_ROLES = [
  "property_owner",
  "property_agent",
  "property_sourcer",
] as const satisfies readonly ListingWorkspaceRole[];

export const LISTING_TYPE_OPTIONS = [
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
  value: ListingType;
  label: string;
}>;

export const LISTING_CATEGORY_OPTIONS = [
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
  value: ListingCategory;
  label: string;
}>;

export const LISTING_VISIBILITY_OPTIONS = [
  {
    value: "private",
    label: "Private workspace",
  },
  {
    value: "restricted",
    label: "Restricted access",
  },
  {
    value: "public",
    label: "Public marketplace",
  },
] as const satisfies ReadonlyArray<{
  value: ListingVisibility;
  label: string;
}>;

export const LISTING_STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "submitted", label: "Submitted" },
  { value: "under_review", label: "Under review" },
  { value: "approved", label: "Approved" },
  { value: "published", label: "Published" },
  { value: "on_hold", label: "On hold" },
  {
    value: "correction_required",
    label: "Correction required",
  },
  { value: "rejected", label: "Rejected" },
  { value: "withdrawn", label: "Withdrawn" },
  { value: "archived", label: "Archived" },
] as const satisfies ReadonlyArray<{
  value: ListingStatus;
  label: string;
}>;

export const LISTING_DEAL_STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "submitted", label: "Submitted" },
  { value: "under_review", label: "Under review" },
  { value: "approved", label: "Approved" },
  { value: "published", label: "Published" },
  { value: "reserved", label: "Reserved" },
  { value: "under_offer", label: "Under offer" },
  { value: "due_diligence", label: "Due diligence" },
  { value: "exchanged", label: "Exchanged" },
  { value: "completed", label: "Completed" },
  { value: "sold", label: "Sold" },
  { value: "rejected", label: "Rejected" },
  { value: "withdrawn", label: "Withdrawn" },
  { value: "archived", label: "Archived" },
] as const satisfies ReadonlyArray<{
  value: ListingDealStatus;
  label: string;
}>;

export const LISTING_STRATEGY_OPTIONS = [
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
  value: ListingInvestmentStrategy;
  label: string;
}>;

export const LISTING_SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  {
    value: "updated_recently",
    label: "Recently updated",
  },
  {
    value: "title_ascending",
    label: "Title: A to Z",
  },
  {
    value: "title_descending",
    label: "Title: Z to A",
  },
  {
    value: "price_low_to_high",
    label: "Price: low to high",
  },
  {
    value: "price_high_to_low",
    label: "Price: high to low",
  },
  { value: "status", label: "Status" },
] as const;

export const LISTING_PAGE_SIZE_OPTIONS = [10, 20, 30, 50] as const;

export const LISTING_MAX_PAGE_SIZE = 50;

export const DEFAULT_LISTING_FILTERS: ListingFilters = {
  search: "",
  statuses: [],
  dealStatuses: [],
  verificationStatuses: [],
  listingTypes: [],
  listingCategories: [],
  visibilities: [],
  submissionSources: [],

  propertyPublicId: null,
  correctionRequired: null,
  isPublished: null,
  isMarketplaceVisible: null,

  sort: "updated_recently",
  page: 1,
  pageSize: 20,
};

export const INITIAL_LISTING_CREATE_VALUES: ListingCreateValues = {
  propertyPublicId: "",

  title: "",
  shortDescription: "",
  description: "",

  listingType: "sale",
  listingCategory: "market_listing",
  occupancyStatus: "unknown",

  priceDetails: {
    askingPrice: null,
    guidePrice: null,
    estimatedMarketValue: null,
    estimatedMonthlyRent: null,
    refurbishmentEstimate: null,
    otherAcquisitionCostsEstimate: null,
    currency: "GBP",
  },

  investmentStrategies: [],
  badges: [],
  features: [],

  accessRequirements: {
    authenticationRequired: false,
    investorProfileRequired: false,
    onboardingRequired: false,
    verificationRequired: false,
    proofOfFundsRequired: false,
    paymentRequired: false,
    reservationRequired: false,
  },

  isFeaturedRequested: false,
  informationAccurateConfirmed: false,
  listingStandardsAccepted: false,
  authorityConfirmed: false,
};

export const LISTING_SAFE_MESSAGES = {
  loadError: "We could not load your listings. Please refresh the page.",

  detailLoadError:
    "We could not load this listing. It may not exist or may not be available to your active profile.",

  createError:
    "We could not create the listing. Confirm that the property is approved and belongs to your active profile.",

  created: "The listing draft has been created.",

  saveError:
    "We could not save the listing. Please review the information and try again.",

  saved: "The listing has been updated.",

  submitError:
    "We could not submit the listing. Complete all required information, policies, media, and documents first.",

  submitted:
    "The listing has been submitted for review. Submission does not publish it to the marketplace.",

  withdrawError:
    "We could not withdraw this listing. Its current state may not allow withdrawal.",

  withdrawn: "The listing has been withdrawn.",

  deleteError:
    "We could not delete this listing. Only eligible draft listings may be deleted.",

  deleted: "The listing draft has been deleted.",

  correctionRequired:
    "Some listing information, media, or documents need your attention.",

  publicationControlled:
    "Only authorised Asancha staff may approve and publish a listing.",

  publicVisibilityRule:
    "A listing appears publicly only when it is published and marketplace visibility is enabled by the backend.",
} as const;

export function getListingWorkspaceListPath(
  role: ListingWorkspaceRole,
): string {
  switch (role) {
    case "property_agent":
      return LISTING_PAGE_ROUTES.agentList;

    case "property_sourcer":
      return LISTING_PAGE_ROUTES.sourcerList;

    case "property_owner":
    default:
      return LISTING_PAGE_ROUTES.ownerList;
  }
}

export function getListingWorkspaceDetailPath(
  role: ListingWorkspaceRole,
  listingPublicId: string,
): string {
  switch (role) {
    case "property_agent":
      return LISTING_PAGE_ROUTES.agentDetail(listingPublicId);

    case "property_sourcer":
      return LISTING_PAGE_ROUTES.sourcerDetail(listingPublicId);

    case "property_owner":
    default:
      return LISTING_PAGE_ROUTES.ownerDetail(listingPublicId);
  }
}
