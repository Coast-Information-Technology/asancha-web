// File: src/features/marketplace/constants/marketplace-dummy-data.ts

import type {
  MarketplaceFilterConfiguration,
  MarketplaceFilters,
  MarketplaceInvestmentStrategy,
  MarketplaceListingCard,
  MarketplaceListingCollection,
  MarketplaceListingDetail,
  MarketplaceTenureType,
} from "../types/marketplace.types";

const now = "2026-07-24T09:00:00.000Z";

const listingStrategies = new Map<string, MarketplaceInvestmentStrategy[]>([
  ["pub-listing-001", ["buy_to_let"]],
  ["pub-listing-002", ["buy_to_let"]],
  ["pub-listing-003", ["buy_refurbish_refinance"]],
  ["pub-listing-004", ["hmo"]],
  ["pub-listing-005", ["flip"]],
  ["pub-listing-006", ["hmo"]],
  ["pub-listing-007", ["portfolio_purchase"]],
  ["pub-listing-008", ["serviced_accommodation"]],
  ["pub-listing-009", ["flip"]],
  ["pub-listing-010", ["buy_to_let"]],
  ["pub-listing-011", ["development"]],
  ["pub-listing-012", ["commercial_conversion"]],
  ["pub-listing-013", ["buy_to_let"]],
  ["pub-listing-014", ["buy_to_let"]],
  ["pub-listing-015", ["buy_to_let"]],
  ["pub-listing-016", ["buy_to_let"]],
]);

function getListingTenureType(
  listing: MarketplaceListingCard,
): MarketplaceTenureType {
  if (
    listing.propertyType === "apartment" ||
    listing.propertyType === "block_of_flats"
  ) {
    return "leasehold";
  }

  return "freehold";
}

export const DUMMY_MARKETPLACE_LISTINGS: MarketplaceListingCard[] = [
  {
    listingPublicId: "pub-listing-001",
    slug: "manchester-bmv-terrace-near-ancoats",
    title: "BMV terrace near Ancoats",
    shortDescription:
      "Two-bedroom terrace with public rental and refurb indicators for investor discovery.",
    location: {
      displayName: "Ancoats, Manchester",
      townOrCity: "Manchester",
      county: "Greater Manchester",
      postcodeDistrict: "M4",
      countryCode: "GB",
    },
    propertyType: "terraced_house",
    listingType: "sale",
    listingCategory: "bmv",
    bedrooms: 2,
    bathrooms: 1,
    occupancyStatus: "vacant",
    dealStatus: "published",
    calculatedStatus: "available",
    price: 185000,
    currency: "GBP",
    investmentMetrics: {
      askingPrice: 185000,
      estimatedMarketValue: 215000,
      bmvDiscountPercent: 14,
      estimatedMonthlyRent: 1150,
      estimatedAnnualRent: 13800,
      grossYieldPercent: 7.5,
      estimatedRoiPercent: 13.2,
      refurbishmentEstimate: 18000,
      totalInvestmentEstimate: 203000,
      currency: "GBP",
      disclaimer: "Public marketplace metrics are estimates only.",
    },
    coverImage: {
      mediaPublicId: "dummy-media-001",
      mediaType: "image",
      url: "/auth-bg.avif",
      altText: "Public preview for Manchester terrace",
      caption: null,
      width: 1600,
      height: 1000,
      sortOrder: 1,
      isCover: true,
    },
    badges: ["BMV", "Light refurb", "Vacant"],
    isFeatured: true,
    isSaved: false,
    canSave: true,
    publishedAt: "2026-07-24T08:00:00.000Z",
    updatedAt: now,
  },
  {
    listingPublicId: "pub-listing-002",
    slug: "liverpool-tenanted-buy-to-let-flat",
    title: "Tenanted buy-to-let flat",
    shortDescription:
      "One-bedroom apartment with existing tenancy and public yield preview.",
    location: {
      displayName: "Baltic Triangle, Liverpool",
      townOrCity: "Liverpool",
      county: "Merseyside",
      postcodeDistrict: "L1",
      countryCode: "GB",
    },
    propertyType: "apartment",
    listingType: "sale",
    listingCategory: "market_listing",
    bedrooms: 1,
    bathrooms: 1,
    occupancyStatus: "tenanted",
    dealStatus: "published",
    calculatedStatus: "available",
    price: 142000,
    currency: "GBP",
    investmentMetrics: {
      askingPrice: 142000,
      estimatedMarketValue: 148000,
      bmvDiscountPercent: 4,
      estimatedMonthlyRent: 850,
      estimatedAnnualRent: 10200,
      grossYieldPercent: 7.2,
      estimatedRoiPercent: 10.1,
      refurbishmentEstimate: 6000,
      totalInvestmentEstimate: 148000,
      currency: "GBP",
      disclaimer: "Public marketplace metrics are estimates only.",
    },
    coverImage: {
      mediaPublicId: "dummy-media-002",
      mediaType: "image",
      url: "/auth-bg.avif",
      altText: "Public preview for Liverpool apartment",
      caption: null,
      width: 1600,
      height: 1000,
      sortOrder: 1,
      isCover: true,
    },
    badges: ["Buy to let", "Tenanted", "City centre"],
    isFeatured: false,
    isSaved: false,
    canSave: true,
    publishedAt: "2026-07-23T11:00:00.000Z",
    updatedAt: now,
  },
  {
    listingPublicId: "pub-listing-003",
    slug: "leeds-light-refurb-semi-detached",
    title: "Light refurb semi-detached",
    shortDescription:
      "Three-bedroom semi-detached home with light refurbishment potential.",
    location: {
      displayName: "Headingley, Leeds",
      townOrCity: "Leeds",
      county: "West Yorkshire",
      postcodeDistrict: "LS6",
      countryCode: "GB",
    },
    propertyType: "semi_detached",
    listingType: "refurbishment",
    listingCategory: "distressed",
    bedrooms: 3,
    bathrooms: 1,
    occupancyStatus: "vacant",
    dealStatus: "published",
    calculatedStatus: "available",
    price: 238000,
    currency: "GBP",
    investmentMetrics: {
      askingPrice: 238000,
      estimatedMarketValue: 270000,
      bmvDiscountPercent: 12,
      estimatedMonthlyRent: 1350,
      estimatedAnnualRent: 16200,
      grossYieldPercent: 6.8,
      estimatedRoiPercent: 14.4,
      refurbishmentEstimate: 26000,
      totalInvestmentEstimate: 264000,
      currency: "GBP",
      disclaimer: "Public marketplace metrics are estimates only.",
    },
    coverImage: {
      mediaPublicId: "dummy-media-003",
      mediaType: "image",
      url: "/auth-bg.avif",
      altText: "Public preview for Leeds semi-detached property",
      caption: null,
      width: 1600,
      height: 1000,
      sortOrder: 1,
      isCover: true,
    },
    badges: ["Refurb", "Family let", "Growth area"],
    isFeatured: true,
    isSaved: false,
    canSave: true,
    publishedAt: "2026-07-22T09:30:00.000Z",
    updatedAt: now,
  },
  {
    listingPublicId: "pub-listing-004",
    slug: "birmingham-hmo-conversion-candidate",
    title: "HMO conversion candidate",
    shortDescription:
      "Large terrace with public indicators for an HMO-led strategy.",
    location: {
      displayName: "Edgbaston, Birmingham",
      townOrCity: "Birmingham",
      county: "West Midlands",
      postcodeDistrict: "B15",
      countryCode: "GB",
    },
    propertyType: "terraced_house",
    listingType: "sale",
    listingCategory: "development_opportunity",
    bedrooms: 5,
    bathrooms: 2,
    occupancyStatus: "part_occupied",
    dealStatus: "published",
    calculatedStatus: "available",
    price: 365000,
    currency: "GBP",
    investmentMetrics: {
      askingPrice: 365000,
      estimatedMarketValue: 395000,
      bmvDiscountPercent: 8,
      estimatedMonthlyRent: 2900,
      estimatedAnnualRent: 34800,
      grossYieldPercent: 9.5,
      estimatedRoiPercent: 16.8,
      refurbishmentEstimate: 52000,
      totalInvestmentEstimate: 417000,
      currency: "GBP",
      disclaimer: "Public marketplace metrics are estimates only.",
    },
    coverImage: {
      mediaPublicId: "dummy-media-004",
      mediaType: "image",
      url: "/auth-bg.avif",
      altText: "Public preview for Birmingham HMO candidate",
      caption: null,
      width: 1600,
      height: 1000,
      sortOrder: 1,
      isCover: true,
    },
    badges: ["HMO", "Value add", "High yield"],
    isFeatured: false,
    isSaved: false,
    canSave: true,
    publishedAt: "2026-07-21T14:00:00.000Z",
    updatedAt: now,
  },
  {
    listingPublicId: "pub-listing-005",
    slug: "sheffield-auction-led-family-home",
    title: "Auction-led family home",
    shortDescription:
      "Three-bedroom detached property with public auction-led discovery data.",
    location: {
      displayName: "Crookes, Sheffield",
      townOrCity: "Sheffield",
      county: "South Yorkshire",
      postcodeDistrict: "S10",
      countryCode: "GB",
    },
    propertyType: "detached_house",
    listingType: "sale",
    listingCategory: "auction_led",
    bedrooms: 3,
    bathrooms: 2,
    occupancyStatus: "unknown",
    dealStatus: "under_offer",
    calculatedStatus: "under_offer",
    price: 292000,
    currency: "GBP",
    investmentMetrics: {
      askingPrice: 292000,
      estimatedMarketValue: 315000,
      bmvDiscountPercent: 7,
      estimatedMonthlyRent: 1450,
      estimatedAnnualRent: 17400,
      grossYieldPercent: 6,
      estimatedRoiPercent: 9.4,
      refurbishmentEstimate: 15000,
      totalInvestmentEstimate: 307000,
      currency: "GBP",
      disclaimer: "Public marketplace metrics are estimates only.",
    },
    coverImage: {
      mediaPublicId: "dummy-media-005",
      mediaType: "image",
      url: "/auth-bg.avif",
      altText: "Public preview for Sheffield detached property",
      caption: null,
      width: 1600,
      height: 1000,
      sortOrder: 1,
      isCover: true,
    },
    badges: ["Auction", "Family home", "Under offer"],
    isFeatured: false,
    isSaved: false,
    canSave: true,
    publishedAt: "2026-07-20T16:45:00.000Z",
    updatedAt: now,
  },
  {
    listingPublicId: "pub-listing-006",
    slug: "nottingham-student-let-hmo",
    title: "Student-let HMO",
    shortDescription:
      "Six-bedroom HMO opportunity with public rent and yield indicators.",
    location: {
      displayName: "Lenton, Nottingham",
      townOrCity: "Nottingham",
      county: "Nottinghamshire",
      postcodeDistrict: "NG7",
      countryCode: "GB",
    },
    propertyType: "hmo",
    listingType: "sale",
    listingCategory: "off_market",
    bedrooms: 6,
    bathrooms: 3,
    occupancyStatus: "tenanted",
    dealStatus: "published",
    calculatedStatus: "available",
    price: 420000,
    currency: "GBP",
    investmentMetrics: {
      askingPrice: 420000,
      estimatedMarketValue: 448000,
      bmvDiscountPercent: 6,
      estimatedMonthlyRent: 3600,
      estimatedAnnualRent: 43200,
      grossYieldPercent: 10.3,
      estimatedRoiPercent: 15.9,
      refurbishmentEstimate: 20000,
      totalInvestmentEstimate: 440000,
      currency: "GBP",
      disclaimer: "Public marketplace metrics are estimates only.",
    },
    coverImage: {
      mediaPublicId: "dummy-media-006",
      mediaType: "image",
      url: "/auth-bg.avif",
      altText: "Public preview for Nottingham HMO",
      caption: null,
      width: 1600,
      height: 1000,
      sortOrder: 1,
      isCover: true,
    },
    badges: ["HMO", "Student let", "Tenanted"],
    isFeatured: true,
    isSaved: false,
    canSave: true,
    publishedAt: "2026-07-19T12:00:00.000Z",
    updatedAt: now,
  },
  {
    listingPublicId: "pub-listing-007",
    slug: "bristol-block-of-flats-income-play",
    title: "Block of flats income play",
    shortDescription:
      "Small block of flats with public income and occupancy summary.",
    location: {
      displayName: "Easton, Bristol",
      townOrCity: "Bristol",
      county: "Bristol",
      postcodeDistrict: "BS5",
      countryCode: "GB",
    },
    propertyType: "block_of_flats",
    listingType: "sale",
    listingCategory: "off_market",
    bedrooms: 8,
    bathrooms: 5,
    occupancyStatus: "tenanted",
    dealStatus: "published",
    calculatedStatus: "available",
    price: 895000,
    currency: "GBP",
    investmentMetrics: {
      askingPrice: 895000,
      estimatedMarketValue: 930000,
      bmvDiscountPercent: 4,
      estimatedMonthlyRent: 6900,
      estimatedAnnualRent: 82800,
      grossYieldPercent: 9.3,
      estimatedRoiPercent: 11.7,
      refurbishmentEstimate: 40000,
      totalInvestmentEstimate: 935000,
      currency: "GBP",
      disclaimer: "Public marketplace metrics are estimates only.",
    },
    coverImage: {
      mediaPublicId: "dummy-media-007",
      mediaType: "image",
      url: "/auth-bg.avif",
      altText: "Public preview for Bristol block of flats",
      caption: null,
      width: 1600,
      height: 1000,
      sortOrder: 1,
      isCover: true,
    },
    badges: ["Portfolio", "Income", "Tenanted"],
    isFeatured: false,
    isSaved: false,
    canSave: true,
    publishedAt: "2026-07-18T10:15:00.000Z",
    updatedAt: now,
  },
  {
    listingPublicId: "pub-listing-008",
    slug: "cardiff-bay-serviced-accommodation-flat",
    title: "Serviced accommodation flat",
    shortDescription:
      "Two-bedroom apartment positioned for serviced accommodation review.",
    location: {
      displayName: "Cardiff Bay, Cardiff",
      townOrCity: "Cardiff",
      county: "South Glamorgan",
      postcodeDistrict: "CF10",
      countryCode: "GB",
    },
    propertyType: "apartment",
    listingType: "sale",
    listingCategory: "market_listing",
    bedrooms: 2,
    bathrooms: 2,
    occupancyStatus: "vacant",
    dealStatus: "published",
    calculatedStatus: "available",
    price: 255000,
    currency: "GBP",
    investmentMetrics: {
      askingPrice: 255000,
      estimatedMarketValue: 268000,
      bmvDiscountPercent: 5,
      estimatedMonthlyRent: 1700,
      estimatedAnnualRent: 20400,
      grossYieldPercent: 8,
      estimatedRoiPercent: 12.6,
      refurbishmentEstimate: 9000,
      totalInvestmentEstimate: 264000,
      currency: "GBP",
      disclaimer: "Public marketplace metrics are estimates only.",
    },
    coverImage: {
      mediaPublicId: "dummy-media-008",
      mediaType: "image",
      url: "/auth-bg.avif",
      altText: "Public preview for Cardiff apartment",
      caption: null,
      width: 1600,
      height: 1000,
      sortOrder: 1,
      isCover: true,
    },
    badges: ["Serviced accommodation", "Waterfront", "Vacant"],
    isFeatured: false,
    isSaved: false,
    canSave: true,
    publishedAt: "2026-07-17T09:00:00.000Z",
    updatedAt: now,
  },
  {
    listingPublicId: "pub-listing-009",
    slug: "newcastle-flip-opportunity",
    title: "Flip opportunity",
    shortDescription:
      "Public preview for a two-bedroom house with resale uplift potential.",
    location: {
      displayName: "Heaton, Newcastle",
      townOrCity: "Newcastle",
      county: "Tyne and Wear",
      postcodeDistrict: "NE6",
      countryCode: "GB",
    },
    propertyType: "terraced_house",
    listingType: "refurbishment",
    listingCategory: "distressed",
    bedrooms: 2,
    bathrooms: 1,
    occupancyStatus: "vacant",
    dealStatus: "published",
    calculatedStatus: "available",
    price: 128000,
    currency: "GBP",
    investmentMetrics: {
      askingPrice: 128000,
      estimatedMarketValue: 160000,
      bmvDiscountPercent: 20,
      estimatedMonthlyRent: 800,
      estimatedAnnualRent: 9600,
      grossYieldPercent: 7.5,
      estimatedRoiPercent: 18.5,
      refurbishmentEstimate: 24000,
      totalInvestmentEstimate: 152000,
      currency: "GBP",
      disclaimer: "Public marketplace metrics are estimates only.",
    },
    coverImage: {
      mediaPublicId: "dummy-media-009",
      mediaType: "image",
      url: "/auth-bg.avif",
      altText: "Public preview for Newcastle flip opportunity",
      caption: null,
      width: 1600,
      height: 1000,
      sortOrder: 1,
      isCover: true,
    },
    badges: ["Flip", "BMV", "Refurb"],
    isFeatured: true,
    isSaved: false,
    canSave: true,
    publishedAt: "2026-07-16T08:20:00.000Z",
    updatedAt: now,
  },
  {
    listingPublicId: "pub-listing-010",
    slug: "glasgow-buy-to-let-apartment",
    title: "Buy-to-let apartment",
    shortDescription:
      "Two-bedroom apartment with public rental signals and city demand context.",
    location: {
      displayName: "Finnieston, Glasgow",
      townOrCity: "Glasgow",
      county: "Glasgow City",
      postcodeDistrict: "G3",
      countryCode: "GB",
    },
    propertyType: "apartment",
    listingType: "sale",
    listingCategory: "market_listing",
    bedrooms: 2,
    bathrooms: 1,
    occupancyStatus: "tenanted",
    dealStatus: "published",
    calculatedStatus: "available",
    price: 176000,
    currency: "GBP",
    investmentMetrics: {
      askingPrice: 176000,
      estimatedMarketValue: 184000,
      bmvDiscountPercent: 4,
      estimatedMonthlyRent: 1050,
      estimatedAnnualRent: 12600,
      grossYieldPercent: 7.2,
      estimatedRoiPercent: 9.8,
      refurbishmentEstimate: 7000,
      totalInvestmentEstimate: 183000,
      currency: "GBP",
      disclaimer: "Public marketplace metrics are estimates only.",
    },
    coverImage: {
      mediaPublicId: "dummy-media-010",
      mediaType: "image",
      url: "/auth-bg.avif",
      altText: "Public preview for Glasgow apartment",
      caption: null,
      width: 1600,
      height: 1000,
      sortOrder: 1,
      isCover: true,
    },
    badges: ["Buy to let", "Tenanted", "City demand"],
    isFeatured: false,
    isSaved: false,
    canSave: true,
    publishedAt: "2026-07-15T15:30:00.000Z",
    updatedAt: now,
  },
  {
    listingPublicId: "pub-listing-011",
    slug: "coventry-development-site",
    title: "Small development site",
    shortDescription:
      "Land opportunity with public development strategy indicators.",
    location: {
      displayName: "Earlsdon, Coventry",
      townOrCity: "Coventry",
      county: "West Midlands",
      postcodeDistrict: "CV5",
      countryCode: "GB",
    },
    propertyType: "development_site",
    listingType: "sale",
    listingCategory: "development_opportunity",
    bedrooms: null,
    bathrooms: null,
    occupancyStatus: "vacant",
    dealStatus: "published",
    calculatedStatus: "available",
    price: 310000,
    currency: "GBP",
    investmentMetrics: {
      askingPrice: 310000,
      estimatedMarketValue: 350000,
      bmvDiscountPercent: 11,
      estimatedMonthlyRent: null,
      estimatedAnnualRent: null,
      grossYieldPercent: null,
      estimatedRoiPercent: 17.4,
      refurbishmentEstimate: 95000,
      totalInvestmentEstimate: 405000,
      currency: "GBP",
      disclaimer: "Public marketplace metrics are estimates only.",
    },
    coverImage: {
      mediaPublicId: "dummy-media-011",
      mediaType: "image",
      url: "/auth-bg.avif",
      altText: "Public preview for Coventry development site",
      caption: null,
      width: 1600,
      height: 1000,
      sortOrder: 1,
      isCover: true,
    },
    badges: ["Development", "Land", "Value add"],
    isFeatured: false,
    isSaved: false,
    canSave: true,
    publishedAt: "2026-07-14T10:00:00.000Z",
    updatedAt: now,
  },
  {
    listingPublicId: "pub-listing-012",
    slug: "southampton-commercial-conversion",
    title: "Commercial conversion",
    shortDescription:
      "Commercial unit with public conversion and refurbishment indicators.",
    location: {
      displayName: "Ocean Village, Southampton",
      townOrCity: "Southampton",
      county: "Hampshire",
      postcodeDistrict: "SO14",
      countryCode: "GB",
    },
    propertyType: "commercial",
    listingType: "refurbishment",
    listingCategory: "development_opportunity",
    bedrooms: null,
    bathrooms: 2,
    occupancyStatus: "vacant",
    dealStatus: "published",
    calculatedStatus: "available",
    price: 485000,
    currency: "GBP",
    investmentMetrics: {
      askingPrice: 485000,
      estimatedMarketValue: 560000,
      bmvDiscountPercent: 13,
      estimatedMonthlyRent: 3200,
      estimatedAnnualRent: 38400,
      grossYieldPercent: 7.9,
      estimatedRoiPercent: 15.1,
      refurbishmentEstimate: 68000,
      totalInvestmentEstimate: 553000,
      currency: "GBP",
      disclaimer: "Public marketplace metrics are estimates only.",
    },
    coverImage: {
      mediaPublicId: "dummy-media-012",
      mediaType: "image",
      url: "/auth-bg.avif",
      altText: "Public preview for Southampton commercial conversion",
      caption: null,
      width: 1600,
      height: 1000,
      sortOrder: 1,
      isCover: true,
    },
    badges: ["Commercial", "Conversion", "Refurb"],
    isFeatured: true,
    isSaved: false,
    canSave: true,
    publishedAt: "2026-07-13T12:10:00.000Z",
    updatedAt: now,
  },
  {
    listingPublicId: "pub-listing-013",
    slug: "reading-bungalow-downsize-market",
    title: "Bungalow near commuter links",
    shortDescription:
      "Two-bedroom bungalow with public market listing and rental signals.",
    location: {
      displayName: "Caversham, Reading",
      townOrCity: "Reading",
      county: "Berkshire",
      postcodeDistrict: "RG4",
      countryCode: "GB",
    },
    propertyType: "bungalow",
    listingType: "sale",
    listingCategory: "market_listing",
    bedrooms: 2,
    bathrooms: 1,
    occupancyStatus: "vacant",
    dealStatus: "published",
    calculatedStatus: "available",
    price: 390000,
    currency: "GBP",
    investmentMetrics: {
      askingPrice: 390000,
      estimatedMarketValue: 402000,
      bmvDiscountPercent: 3,
      estimatedMonthlyRent: 1550,
      estimatedAnnualRent: 18600,
      grossYieldPercent: 4.8,
      estimatedRoiPercent: 7.4,
      refurbishmentEstimate: 12000,
      totalInvestmentEstimate: 402000,
      currency: "GBP",
      disclaimer: "Public marketplace metrics are estimates only.",
    },
    coverImage: {
      mediaPublicId: "dummy-media-013",
      mediaType: "image",
      url: "/auth-bg.avif",
      altText: "Public preview for Reading bungalow",
      caption: null,
      width: 1600,
      height: 1000,
      sortOrder: 1,
      isCover: true,
    },
    badges: ["Commuter", "Vacant", "Low refurb"],
    isFeatured: false,
    isSaved: false,
    canSave: true,
    publishedAt: "2026-07-12T12:10:00.000Z",
    updatedAt: now,
  },
  {
    listingPublicId: "pub-listing-014",
    slug: "london-east-apartment-under-offer",
    title: "East London apartment",
    shortDescription:
      "Two-bedroom apartment preview with status marked under offer.",
    location: {
      displayName: "Stratford, London",
      townOrCity: "London",
      county: "Greater London",
      postcodeDistrict: "E15",
      countryCode: "GB",
    },
    propertyType: "apartment",
    listingType: "sale",
    listingCategory: "market_listing",
    bedrooms: 2,
    bathrooms: 2,
    occupancyStatus: "tenanted",
    dealStatus: "under_offer",
    calculatedStatus: "under_offer",
    price: 465000,
    currency: "GBP",
    investmentMetrics: {
      askingPrice: 465000,
      estimatedMarketValue: 475000,
      bmvDiscountPercent: 2,
      estimatedMonthlyRent: 2200,
      estimatedAnnualRent: 26400,
      grossYieldPercent: 5.7,
      estimatedRoiPercent: 8.1,
      refurbishmentEstimate: 8000,
      totalInvestmentEstimate: 473000,
      currency: "GBP",
      disclaimer: "Public marketplace metrics are estimates only.",
    },
    coverImage: {
      mediaPublicId: "dummy-media-014",
      mediaType: "image",
      url: "/auth-bg.avif",
      altText: "Public preview for East London apartment",
      caption: null,
      width: 1600,
      height: 1000,
      sortOrder: 1,
      isCover: true,
    },
    badges: ["London", "Under offer", "Transport links"],
    isFeatured: false,
    isSaved: false,
    canSave: true,
    publishedAt: "2026-07-11T12:10:00.000Z",
    updatedAt: now,
  },
  {
    listingPublicId: "pub-listing-015",
    slug: "preston-high-yield-terrace",
    title: "High-yield terrace",
    shortDescription:
      "Affordable two-bedroom terrace with public high-yield indicators.",
    location: {
      displayName: "Ashton-on-Ribble, Preston",
      townOrCity: "Preston",
      county: "Lancashire",
      postcodeDistrict: "PR2",
      countryCode: "GB",
    },
    propertyType: "terraced_house",
    listingType: "sale",
    listingCategory: "bmv",
    bedrooms: 2,
    bathrooms: 1,
    occupancyStatus: "vacant",
    dealStatus: "published",
    calculatedStatus: "available",
    price: 98000,
    currency: "GBP",
    investmentMetrics: {
      askingPrice: 98000,
      estimatedMarketValue: 116000,
      bmvDiscountPercent: 16,
      estimatedMonthlyRent: 725,
      estimatedAnnualRent: 8700,
      grossYieldPercent: 8.9,
      estimatedRoiPercent: 15.2,
      refurbishmentEstimate: 11000,
      totalInvestmentEstimate: 109000,
      currency: "GBP",
      disclaimer: "Public marketplace metrics are estimates only.",
    },
    coverImage: {
      mediaPublicId: "dummy-media-015",
      mediaType: "image",
      url: "/auth-bg.avif",
      altText: "Public preview for Preston terrace",
      caption: null,
      width: 1600,
      height: 1000,
      sortOrder: 1,
      isCover: true,
    },
    badges: ["High yield", "BMV", "Entry price"],
    isFeatured: true,
    isSaved: false,
    canSave: true,
    publishedAt: "2026-07-10T12:10:00.000Z",
    updatedAt: now,
  },
  {
    listingPublicId: "pub-listing-016",
    slug: "norwich-family-let-semi-detached",
    title: "Family-let semi-detached",
    shortDescription:
      "Three-bedroom semi-detached property with public family-let indicators.",
    location: {
      displayName: "Eaton, Norwich",
      townOrCity: "Norwich",
      county: "Norfolk",
      postcodeDistrict: "NR4",
      countryCode: "GB",
    },
    propertyType: "semi_detached",
    listingType: "sale",
    listingCategory: "manual",
    bedrooms: 3,
    bathrooms: 2,
    occupancyStatus: "vacant",
    dealStatus: "published",
    calculatedStatus: "available",
    price: 275000,
    currency: "GBP",
    investmentMetrics: {
      askingPrice: 275000,
      estimatedMarketValue: 292000,
      bmvDiscountPercent: 6,
      estimatedMonthlyRent: 1325,
      estimatedAnnualRent: 15900,
      grossYieldPercent: 5.8,
      estimatedRoiPercent: 8.7,
      refurbishmentEstimate: 14000,
      totalInvestmentEstimate: 289000,
      currency: "GBP",
      disclaimer: "Public marketplace metrics are estimates only.",
    },
    coverImage: {
      mediaPublicId: "dummy-media-016",
      mediaType: "image",
      url: "/auth-bg.avif",
      altText: "Public preview for Norwich semi-detached property",
      caption: null,
      width: 1600,
      height: 1000,
      sortOrder: 1,
      isCover: true,
    },
    badges: ["Family let", "Vacant", "Low works"],
    isFeatured: false,
    isSaved: false,
    canSave: true,
    publishedAt: "2026-07-09T12:10:00.000Z",
    updatedAt: now,
  },
];

function matchesText(listing: MarketplaceListingCard, search: string): boolean {
  const normalizedSearch = search.trim().toLowerCase();

  if (!normalizedSearch) return true;

  return [
    listing.title,
    listing.shortDescription,
    listing.location.displayName,
    listing.location.townOrCity,
    listing.location.county,
    listing.propertyType,
    listing.listingCategory,
    ...listing.badges,
  ]
    .filter(Boolean)
    .some((value) => String(value).toLowerCase().includes(normalizedSearch));
}

function matchesNumberRange(
  value: number | null,
  minimum: number | null | undefined,
  maximum: number | null | undefined,
): boolean {
  if (value === null) return minimum == null && maximum == null;
  if (minimum != null && value < minimum) return false;
  if (maximum != null && value > maximum) return false;
  return true;
}

function includesEveryOrEmpty<TValue extends string>(
  selectedValues: TValue[],
  value: TValue | null,
): boolean {
  return (
    selectedValues.length === 0 ||
    (value !== null && selectedValues.includes(value))
  );
}

function includesAnyOrEmpty<TValue extends string>(
  selectedValues: TValue[],
  values: TValue[],
): boolean {
  return (
    selectedValues.length === 0 ||
    selectedValues.some((selectedValue) => values.includes(selectedValue))
  );
}

function getSortedListings(
  listings: MarketplaceListingCard[],
  sort: MarketplaceFilters["sort"],
): MarketplaceListingCard[] {
  return [...listings].sort((a, b) => {
    switch (sort) {
      case "oldest":
        return Date.parse(a.publishedAt) - Date.parse(b.publishedAt);
      case "price_low_to_high":
        return (
          (a.price ?? Number.MAX_SAFE_INTEGER) -
          (b.price ?? Number.MAX_SAFE_INTEGER)
        );
      case "price_high_to_low":
        return (b.price ?? 0) - (a.price ?? 0);
      case "highest_yield":
        return (
          (b.investmentMetrics?.grossYieldPercent ?? 0) -
          (a.investmentMetrics?.grossYieldPercent ?? 0)
        );
      case "highest_roi":
        return (
          (b.investmentMetrics?.estimatedRoiPercent ?? 0) -
          (a.investmentMetrics?.estimatedRoiPercent ?? 0)
        );
      case "largest_bmv_discount":
        return (
          (b.investmentMetrics?.bmvDiscountPercent ?? 0) -
          (a.investmentMetrics?.bmvDiscountPercent ?? 0)
        );
      case "newest":
      default:
        return Date.parse(b.publishedAt) - Date.parse(a.publishedAt);
    }
  });
}

export function getDummyMarketplaceListings(
  filters: Partial<MarketplaceFilters>,
): MarketplaceListingCollection {
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 12;

  const filteredListings = DUMMY_MARKETPLACE_LISTINGS.filter((listing) => {
    return (
      matchesText(listing, filters.search ?? "") &&
      (filters.locations?.length
        ? filters.locations.some(
            (location) =>
              listing.location.displayName.includes(location) ||
              listing.location.townOrCity === location,
          )
        : true) &&
      includesEveryOrEmpty(filters.propertyTypes ?? [], listing.propertyType) &&
      includesEveryOrEmpty(
        filters.tenureTypes ?? [],
        getListingTenureType(listing),
      ) &&
      includesEveryOrEmpty(filters.listingTypes ?? [], listing.listingType) &&
      includesEveryOrEmpty(
        filters.listingCategories ?? [],
        listing.listingCategory,
      ) &&
      includesAnyOrEmpty(
        filters.strategies ?? [],
        listingStrategies.get(listing.listingPublicId) ?? [],
      ) &&
      includesEveryOrEmpty(
        filters.occupancyStatuses ?? [],
        listing.occupancyStatus,
      ) &&
      includesEveryOrEmpty(filters.dealStatuses ?? [], listing.dealStatus) &&
      includesEveryOrEmpty(
        filters.calculatedStatuses ?? [],
        listing.calculatedStatus,
      ) &&
      matchesNumberRange(
        listing.price,
        filters.minimumPrice,
        filters.maximumPrice,
      ) &&
      matchesNumberRange(
        listing.bedrooms,
        filters.minimumBedrooms,
        filters.maximumBedrooms,
      ) &&
      matchesNumberRange(
        listing.bathrooms,
        filters.minimumBathrooms,
        filters.maximumBathrooms,
      ) &&
      (filters.minimumBmvDiscountPercent == null ||
        (listing.investmentMetrics?.bmvDiscountPercent ?? 0) >=
          filters.minimumBmvDiscountPercent) &&
      (filters.minimumGrossYieldPercent == null ||
        (listing.investmentMetrics?.grossYieldPercent ?? 0) >=
          filters.minimumGrossYieldPercent) &&
      (filters.minimumRoiPercent == null ||
        (listing.investmentMetrics?.estimatedRoiPercent ?? 0) >=
          filters.minimumRoiPercent) &&
      (filters.minimumEstimatedMonthlyRent == null ||
        (listing.investmentMetrics?.estimatedMonthlyRent ?? 0) >=
          filters.minimumEstimatedMonthlyRent)
    );
  });

  const sortedListings = getSortedListings(
    filteredListings,
    filters.sort ?? "newest",
  );
  const startIndex = (page - 1) * pageSize;
  const items = sortedListings
    .slice(startIndex, startIndex + pageSize)
    .map((listing) => ({
      ...listing,
      tenureType: getListingTenureType(listing),
    }));
  const totalPages = Math.max(1, Math.ceil(sortedListings.length / pageSize));

  return {
    items,
    pagination: {
      page,
      pageSize,
      totalItems: sortedListings.length,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
    appliedFilters: filters,
  };
}

function countBy<TValue extends string>(
  values: TValue[],
): Array<{ value: TValue; count: number }> {
  const counts = new Map<TValue, number>();

  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);

  return Array.from(counts.entries()).map(([value, count]) => ({
    value,
    count,
  }));
}

export function getDummyMarketplaceFilterConfiguration(): MarketplaceFilterConfiguration {
  const prices = DUMMY_MARKETPLACE_LISTINGS.map(
    (listing) => listing.price,
  ).filter((value): value is number => value !== null);

  return {
    locations: countBy(
      DUMMY_MARKETPLACE_LISTINGS.map(
        (listing) =>
          listing.location.townOrCity ?? listing.location.displayName,
      ),
    ).map((item) => ({
      value: item.value,
      label: item.value,
      count: item.count,
    })),
    propertyTypes: countBy(
      DUMMY_MARKETPLACE_LISTINGS.map((listing) => listing.propertyType),
    ).map((item) => ({ ...item, label: item.value.replaceAll("_", " ") })),
    tenureTypes: countBy(
      DUMMY_MARKETPLACE_LISTINGS.map(getListingTenureType),
    ).map((item) => ({ ...item, label: item.value.replaceAll("_", " ") })),
    listingTypes: countBy(
      DUMMY_MARKETPLACE_LISTINGS.map((listing) => listing.listingType),
    ).map((item) => ({ ...item, label: item.value.replaceAll("_", " ") })),
    listingCategories: countBy(
      DUMMY_MARKETPLACE_LISTINGS.map((listing) => listing.listingCategory),
    ).map((item) => ({ ...item, label: item.value.replaceAll("_", " ") })),
    strategies: countBy(Array.from(listingStrategies.values()).flat()).map(
      (item) => ({
        ...item,
        label: item.value.replaceAll("_", " "),
      }),
    ),
    occupancyStatuses: countBy(
      DUMMY_MARKETPLACE_LISTINGS.map(
        (listing) => listing.occupancyStatus ?? "unknown",
      ),
    ).map((item) => ({ ...item, label: item.value.replaceAll("_", " ") })),
    dealStatuses: countBy(
      DUMMY_MARKETPLACE_LISTINGS.map((listing) => listing.dealStatus),
    ).map((item) => ({ ...item, label: item.value.replaceAll("_", " ") })),
    priceRange: {
      minimum: Math.min(...prices),
      maximum: Math.max(...prices),
      currency: "GBP",
    },
    bedroomRange: {
      minimum: 0,
      maximum: 8,
    },
    bathroomRange: {
      minimum: 0,
      maximum: 5,
    },
    bmvDiscountRange: {
      minimum: 0,
      maximum: 20,
    },
    grossYieldRange: {
      minimum: 0,
      maximum: 11,
    },
    roiRange: {
      minimum: 0,
      maximum: 19,
    },
    updatedAt: now,
  };
}

export function getDummyMarketplaceListingDetail(
  listingSlug: string,
): MarketplaceListingDetail {
  const listing =
    DUMMY_MARKETPLACE_LISTINGS.find((item) => item.slug === listingSlug) ??
    DUMMY_MARKETPLACE_LISTINGS[0];

  return {
    ...listing,
    description:
      listing.shortDescription ??
      "Public-safe property opportunity preview for marketplace discovery.",
    receptionRooms: listing.bedrooms ? Math.max(1, listing.bedrooms - 1) : null,
    tenureType: getListingTenureType(listing),
    publicMedia: listing.coverImage ? [listing.coverImage] : [],
    features: listing.badges,
    strategies: listingStrategies.get(listing.listingPublicId) ?? [],
    canRequestAccess: true,
    canReserve: false,
    canStartConversation: false,
    restrictedSections: [
      {
        key: "private_deal_pack",
        title: "Private deal pack",
        reason: "authentication_required",
        message:
          "Create an account or sign in to request access to restricted deal material.",
        actionLabel: "Sign in",
        actionPath: "/auth/sign-in",
      },
    ],
  };
}
