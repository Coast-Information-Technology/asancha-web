// File: src/features/marketplace/lib/marketplace-dummy-data.ts

/**
 * Public marketplace dummy data.
 *
 * This does not bypass protected backend routes. It only supplies public-safe
 * listing data while the marketplace API is not ready.
 */

import {
  MARKETPLACE_DEFAULT_PAGE_SIZE,
  MARKETPLACE_LISTING_CATEGORY_OPTIONS,
  MARKETPLACE_LISTING_TYPE_OPTIONS,
  MARKETPLACE_OCCUPANCY_OPTIONS,
  MARKETPLACE_PROPERTY_TYPE_OPTIONS,
  MARKETPLACE_STRATEGY_OPTIONS,
} from "../constants/marketplace.constants";
import type {
  MarketplaceFilterConfiguration,
  MarketplaceFilters,
  MarketplaceListingCard,
  MarketplaceListingCollection,
  MarketplaceListingDetail,
  MarketplacePublicMedia,
  MarketplaceQuery,
} from "../types/marketplace.types";

export const USE_MARKETPLACE_DUMMY_DATA = true;

const DUMMY_LISTED_AT = "2026-07-18T10:00:00.000Z";
const DUMMY_UPDATED_AT = "2026-07-19T08:00:00.000Z";

function createImage(
  id: string,
  url: string,
  altText: string,
  sortOrder: number,
  isCover = false,
): MarketplacePublicMedia {
  return {
    mediaPublicId: id,
    mediaType: "image",
    url,
    altText,
    caption: null,
    width: 1600,
    height: 1067,
    sortOrder,
    isCover,
  };
}

const MARKETPLACE_DUMMY_LISTING_DETAILS: MarketplaceListingDetail[] = [
  {
    listingPublicId: "marketplace-preview-001",
    slug: "birmingham-bmv-terraced-house",
    title: "Birmingham BMV terraced house",
    shortDescription:
      "Refurb-ready terraced house with rental upside near commuter links.",
    description:
      "A public-safe preview of a terraced house opportunity in Birmingham. The property is positioned for a light refurbishment strategy with comparable rental evidence, strong commuter access, and a clear route to stabilisation after works.",
    location: {
      displayName: "Birmingham, West Midlands",
      townOrCity: "Birmingham",
      county: "West Midlands",
      postcodeDistrict: "B12",
      countryCode: "GB",
    },
    propertyType: "terraced_house",
    listingType: "sale",
    listingCategory: "bmv",
    bedrooms: 3,
    bathrooms: 1,
    receptionRooms: 2,
    occupancyStatus: "vacant",
    tenureType: "freehold",
    dealStatus: "published",
    calculatedStatus: "available",
    price: 185000,
    currency: "GBP",
    investmentMetrics: {
      askingPrice: 185000,
      estimatedMarketValue: 220000,
      bmvDiscountPercent: 15.9,
      estimatedMonthlyRent: 1350,
      estimatedAnnualRent: 16200,
      grossYieldPercent: 8.8,
      estimatedRoiPercent: 18.5,
      refurbishmentEstimate: 28000,
      totalInvestmentEstimate: 223000,
      currency: "GBP",
      disclaimer:
        "Preview metrics are dummy estimates for UI work and are not investment advice.",
    },
    publicMedia: [
      createImage(
        "marketplace-preview-001-cover",
        "/auth-bg.avif",
        "Preview exterior image for Birmingham terraced house",
        1,
        true,
      ),
      createImage(
        "marketplace-preview-001-2",
        "/auth-bg.avif",
        "Preview interior image for Birmingham terraced house",
        2,
      ),
    ],
    features: [
      "Vacant possession",
      "Comparable rental demand",
      "Light refurbishment opportunity",
      "Freehold title",
    ],
    strategies: ["buy_refurbish_refinance", "buy_to_let", "flip"],
    badges: ["BMV", "Refurb upside", "Vacant"],
    isFeatured: true,
    isSaved: false,
    canSave: false,
    canRequestAccess: false,
    canReserve: false,
    canStartConversation: false,
    restrictedSections: [
      {
        key: "deal-pack",
        title: "Full deal pack",
        reason: "authentication_required",
        message:
          "Detailed comparables, seller notes, and diligence files require a verified account.",
        actionLabel: "Sign in to request access",
        actionPath: null,
      },
    ],
    publishedAt: DUMMY_LISTED_AT,
    updatedAt: DUMMY_UPDATED_AT,
  },
  {
    listingPublicId: "marketplace-preview-002",
    slug: "manchester-hmo-conversion",
    title: "Manchester HMO conversion candidate",
    shortDescription:
      "Large semi-detached property with layout potential for an HMO strategy.",
    description:
      "A dummy marketplace opportunity for evaluating an HMO conversion workflow. The public preview includes only safe summary information and sample financial indicators.",
    location: {
      displayName: "Manchester, Greater Manchester",
      townOrCity: "Manchester",
      county: "Greater Manchester",
      postcodeDistrict: "M14",
      countryCode: "GB",
    },
    propertyType: "semi_detached",
    listingType: "sale",
    listingCategory: "development_opportunity",
    bedrooms: 5,
    bathrooms: 2,
    receptionRooms: 2,
    occupancyStatus: "part_occupied",
    tenureType: "freehold",
    dealStatus: "published",
    calculatedStatus: "available",
    price: 375000,
    currency: "GBP",
    investmentMetrics: {
      askingPrice: 375000,
      estimatedMarketValue: 410000,
      bmvDiscountPercent: 8.5,
      estimatedMonthlyRent: 3600,
      estimatedAnnualRent: 43200,
      grossYieldPercent: 11.5,
      estimatedRoiPercent: 21.2,
      refurbishmentEstimate: 65000,
      totalInvestmentEstimate: 455000,
      currency: "GBP",
      disclaimer:
        "Preview metrics are dummy estimates for UI work and are not investment advice.",
    },
    publicMedia: [
      createImage(
        "marketplace-preview-002-cover",
        "/auth-bg.avif",
        "Preview exterior image for Manchester HMO conversion candidate",
        1,
        true,
      ),
    ],
    features: ["Large footprint", "HMO strategy", "University corridor"],
    strategies: ["hmo", "buy_refurbish_refinance"],
    badges: ["HMO", "Conversion", "High yield"],
    isFeatured: false,
    isSaved: false,
    canSave: false,
    canRequestAccess: false,
    canReserve: false,
    canStartConversation: false,
    restrictedSections: [
      {
        key: "planning",
        title: "Planning and licensing notes",
        reason: "verification_required",
        message:
          "Planning assumptions and licensing notes are available to verified users.",
        actionLabel: "Sign in to continue",
        actionPath: null,
      },
    ],
    publishedAt: "2026-07-15T09:00:00.000Z",
    updatedAt: "2026-07-18T12:00:00.000Z",
  },
  {
    listingPublicId: "marketplace-preview-003",
    slug: "leeds-tenanted-apartment",
    title: "Leeds tenanted apartment",
    shortDescription:
      "Stabilised apartment with existing tenant and steady gross yield.",
    description:
      "A dummy public preview for a lower-touch buy-to-let opportunity. Sensitive tenancy documents, owner details, and lease files are intentionally not included.",
    location: {
      displayName: "Leeds, West Yorkshire",
      townOrCity: "Leeds",
      county: "West Yorkshire",
      postcodeDistrict: "LS2",
      countryCode: "GB",
    },
    propertyType: "apartment",
    listingType: "sale",
    listingCategory: "market_listing",
    bedrooms: 2,
    bathrooms: 2,
    receptionRooms: 1,
    occupancyStatus: "tenanted",
    tenureType: "leasehold",
    dealStatus: "published",
    calculatedStatus: "available",
    price: 245000,
    currency: "GBP",
    investmentMetrics: {
      askingPrice: 245000,
      estimatedMarketValue: 250000,
      bmvDiscountPercent: 2,
      estimatedMonthlyRent: 1450,
      estimatedAnnualRent: 17400,
      grossYieldPercent: 7.1,
      estimatedRoiPercent: 11.4,
      refurbishmentEstimate: 6000,
      totalInvestmentEstimate: 261000,
      currency: "GBP",
      disclaimer:
        "Preview metrics are dummy estimates for UI work and are not investment advice.",
    },
    publicMedia: [
      createImage(
        "marketplace-preview-003-cover",
        "/auth-bg.avif",
        "Preview apartment image for Leeds tenanted apartment",
        1,
        true,
      ),
    ],
    features: ["Existing tenant", "City centre access", "Low works estimate"],
    strategies: ["buy_to_let"],
    badges: ["Tenanted", "Low-touch"],
    isFeatured: false,
    isSaved: false,
    canSave: false,
    canRequestAccess: false,
    canReserve: false,
    canStartConversation: false,
    restrictedSections: [],
    publishedAt: "2026-07-10T11:00:00.000Z",
    updatedAt: "2026-07-17T15:30:00.000Z",
  },
];

function toListingCard(
  listing: MarketplaceListingDetail,
): MarketplaceListingCard {
  return {
    listingPublicId: listing.listingPublicId,
    slug: listing.slug,
    title: listing.title,
    shortDescription: listing.shortDescription,
    location: listing.location,
    propertyType: listing.propertyType,
    listingType: listing.listingType,
    listingCategory: listing.listingCategory,
    bedrooms: listing.bedrooms,
    bathrooms: listing.bathrooms,
    occupancyStatus: listing.occupancyStatus,
    dealStatus: listing.dealStatus,
    calculatedStatus: listing.calculatedStatus,
    price: listing.price,
    currency: listing.currency,
    investmentMetrics: listing.investmentMetrics,
    coverImage:
      listing.publicMedia.find((media) => media.isCover) ??
      listing.publicMedia[0] ??
      null,
    badges: listing.badges,
    isFeatured: listing.isFeatured,
    isSaved: listing.isSaved,
    canSave: listing.canSave,
    publishedAt: listing.publishedAt,
    updatedAt: listing.updatedAt,
  };
}

function matchesQuery(
  listing: MarketplaceListingDetail,
  query: MarketplaceQuery | Partial<MarketplaceFilters>,
): boolean {
  const search = query.search?.trim().toLowerCase();

  if (
    search &&
    ![
      listing.title,
      listing.shortDescription ?? "",
      listing.location.displayName,
    ]
      .join(" ")
      .toLowerCase()
      .includes(search)
  ) {
    return false;
  }

  if (query.propertyTypes?.length && !query.propertyTypes.includes(listing.propertyType)) {
    return false;
  }

  if (query.listingTypes?.length && !query.listingTypes.includes(listing.listingType)) {
    return false;
  }

  if (
    query.listingCategories?.length &&
    !query.listingCategories.includes(listing.listingCategory)
  ) {
    return false;
  }

  if (query.minimumPrice !== undefined && query.minimumPrice !== null) {
    if (listing.price === null || listing.price < query.minimumPrice) {
      return false;
    }
  }

  if (query.maximumPrice !== undefined && query.maximumPrice !== null) {
    if (listing.price === null || listing.price > query.maximumPrice) {
      return false;
    }
  }

  return true;
}

export function getDummyMarketplaceListings(
  query: MarketplaceQuery | Partial<MarketplaceFilters> = {},
): MarketplaceListingCollection {
  const page = query.page ?? 1;
  const pageSize = query.pageSize ?? MARKETPLACE_DEFAULT_PAGE_SIZE;
  const filteredItems = MARKETPLACE_DUMMY_LISTING_DETAILS.filter((listing) =>
    matchesQuery(listing, query),
  ).map(toListingCard);
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const startIndex = (page - 1) * pageSize;
  const items = filteredItems.slice(startIndex, startIndex + pageSize);

  return {
    items,
    pagination: {
      page,
      pageSize,
      totalItems: filteredItems.length,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
    appliedFilters: query,
  };
}

export function getDummyMarketplaceListing(
  listingSlug: string,
): MarketplaceListingDetail | null {
  return (
    MARKETPLACE_DUMMY_LISTING_DETAILS.find(
      (listing) => listing.slug === listingSlug.trim(),
    ) ?? null
  );
}

export function getDummyMarketplaceFilterConfiguration(): MarketplaceFilterConfiguration {
  return {
    locations: [
      { value: "Birmingham", label: "Birmingham", count: 1 },
      { value: "Manchester", label: "Manchester", count: 1 },
      { value: "Leeds", label: "Leeds", count: 1 },
    ],
    propertyTypes: MARKETPLACE_PROPERTY_TYPE_OPTIONS.map((option) => ({
      ...option,
      count: null,
    })),
    listingTypes: MARKETPLACE_LISTING_TYPE_OPTIONS.map((option) => ({
      ...option,
      count: null,
    })),
    listingCategories: MARKETPLACE_LISTING_CATEGORY_OPTIONS.map((option) => ({
      ...option,
      count: null,
    })),
    strategies: MARKETPLACE_STRATEGY_OPTIONS.map((option) => ({
      ...option,
      count: null,
    })),
    occupancyStatuses: MARKETPLACE_OCCUPANCY_OPTIONS.map((option) => ({
      ...option,
      count: null,
    })),
    dealStatuses: [
      { value: "published", label: "Published", count: 3 },
      { value: "reserved", label: "Reserved", count: 0 },
      { value: "under_offer", label: "Under offer", count: 0 },
    ],
    priceRange: {
      minimum: 185000,
      maximum: 375000,
      currency: "GBP",
    },
    bedroomRange: {
      minimum: 1,
      maximum: 6,
    },
    bathroomRange: {
      minimum: 1,
      maximum: 3,
    },
    bmvDiscountRange: {
      minimum: 0,
      maximum: 20,
    },
    grossYieldRange: {
      minimum: 5,
      maximum: 12,
    },
    roiRange: {
      minimum: 8,
      maximum: 25,
    },
    updatedAt: DUMMY_UPDATED_AT,
  };
}
