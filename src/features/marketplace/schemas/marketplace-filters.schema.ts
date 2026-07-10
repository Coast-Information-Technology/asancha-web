// File: src/features/marketplace/schemas/marketplace-filters.schema.ts

/**
 * Marketplace Filter Validation Schema
 *
 * Purpose:
 * Provides client-side Zod validation and normalization for public
 * marketplace filter values.
 *
 * Responsibilities:
 * - Validate marketplace search and filter input.
 * - Validate price, bedroom, bathroom, BMV, yield, and ROI ranges.
 * - Validate pagination and sorting.
 * - Normalize empty form values to null or empty arrays.
 * - Provide URL-query-compatible validated values.
 *
 * Security notes:
 * - Client-side validation improves UX only.
 * - Backend filter validation and public-visibility rules remain final.
 * - Filters must not be used to infer the existence of private listings.
 */

import { z } from "zod";

import {
  MARKETPLACE_LISTING_CATEGORY_OPTIONS,
  MARKETPLACE_LISTING_TYPE_OPTIONS,
  MARKETPLACE_MAX_PAGE_SIZE,
  MARKETPLACE_OCCUPANCY_OPTIONS,
  MARKETPLACE_PROPERTY_TYPE_OPTIONS,
  MARKETPLACE_SORT_OPTIONS,
  MARKETPLACE_STRATEGY_OPTIONS,
} from "../constants/marketplace.constants";

const propertyTypeValues = MARKETPLACE_PROPERTY_TYPE_OPTIONS.map(
  (option) => option.value,
);

const listingTypeValues = MARKETPLACE_LISTING_TYPE_OPTIONS.map(
  (option) => option.value,
);

const listingCategoryValues = MARKETPLACE_LISTING_CATEGORY_OPTIONS.map(
  (option) => option.value,
);

const strategyValues = MARKETPLACE_STRATEGY_OPTIONS.map(
  (option) => option.value,
);

const occupancyValues = MARKETPLACE_OCCUPANCY_OPTIONS.map(
  (option) => option.value,
);

const sortValues = MARKETPLACE_SORT_OPTIONS.map((option) => option.value);

function createEnumSchema<TValue extends readonly [string, ...string[]]>(
  values: TValue,
) {
  return z.enum(values);
}

const propertyTypeSchema = createEnumSchema(
  propertyTypeValues as [
    (typeof propertyTypeValues)[number],
    ...(typeof propertyTypeValues)[number][],
  ],
);

const listingTypeSchema = createEnumSchema(
  listingTypeValues as [
    (typeof listingTypeValues)[number],
    ...(typeof listingTypeValues)[number][],
  ],
);

const listingCategorySchema = createEnumSchema(
  listingCategoryValues as [
    (typeof listingCategoryValues)[number],
    ...(typeof listingCategoryValues)[number][],
  ],
);

const strategySchema = createEnumSchema(
  strategyValues as [
    (typeof strategyValues)[number],
    ...(typeof strategyValues)[number][],
  ],
);

const occupancySchema = createEnumSchema(
  occupancyValues as [
    (typeof occupancyValues)[number],
    ...(typeof occupancyValues)[number][],
  ],
);

const sortSchema = createEnumSchema(
  sortValues as [(typeof sortValues)[number], ...(typeof sortValues)[number][]],
);

const optionalNonNegativeNumberSchema = z
  .union([z.number().finite().nonnegative(), z.nan(), z.null(), z.undefined()])
  .transform((value) => {
    if (value === null || value === undefined || Number.isNaN(value)) {
      return null;
    }

    return value;
  });

const optionalNonNegativeIntegerSchema = z
  .union([z.number().int().nonnegative(), z.nan(), z.null(), z.undefined()])
  .transform((value) => {
    if (value === null || value === undefined || Number.isNaN(value)) {
      return null;
    }

    return value;
  });

const optionalPercentageSchema = z
  .union([
    z.number().finite().min(0).max(100),
    z.nan(),
    z.null(),
    z.undefined(),
  ])
  .transform((value) => {
    if (value === null || value === undefined || Number.isNaN(value)) {
      return null;
    }

    return value;
  });

const optionalDateSchema = z
  .union([z.string().trim(), z.null(), z.undefined()])
  .transform((value) => {
    if (!value) {
      return null;
    }

    return value;
  })
  .refine(
    (value) => value === null || !Number.isNaN(Date.parse(value)),
    "Enter a valid date.",
  );

const uniqueStringArraySchema = z
  .array(z.string().trim().min(1).max(120))
  .default([])
  .transform((values) =>
    Array.from(
      new Map(
        values.map((value) => [value.toLocaleLowerCase("en-GB"), value]),
      ).values(),
    ),
  );

export const marketplaceFiltersSchema = z
  .object({
    search: z.string().trim().max(160, "Search text is too long.").default(""),

    locations: uniqueStringArraySchema,

    propertyTypes: z.array(propertyTypeSchema).default([]),

    listingTypes: z.array(listingTypeSchema).default([]),

    listingCategories: z.array(listingCategorySchema).default([]),

    strategies: z.array(strategySchema).default([]),

    occupancyStatuses: z.array(occupancySchema).default([]),

    dealStatuses: z
      .array(
        z.enum([
          "published",
          "reserved",
          "under_offer",
          "due_diligence",
          "exchanged",
          "completed",
          "sold",
        ]),
      )
      .default([]),

    calculatedStatuses: z
      .array(z.enum(["available", "under_offer", "reserved", "inactive"]))
      .default([]),

    minimumPrice: optionalNonNegativeNumberSchema,
    maximumPrice: optionalNonNegativeNumberSchema,

    minimumBedrooms: optionalNonNegativeIntegerSchema,
    maximumBedrooms: optionalNonNegativeIntegerSchema,

    minimumBathrooms: optionalNonNegativeIntegerSchema,
    maximumBathrooms: optionalNonNegativeIntegerSchema,

    minimumBmvDiscountPercent: optionalPercentageSchema,
    minimumGrossYieldPercent: optionalPercentageSchema,
    minimumRoiPercent: optionalPercentageSchema,

    listedFrom: optionalDateSchema,
    listedTo: optionalDateSchema,

    sort: sortSchema.default("newest"),

    page: z.number().int().min(1).default(1),

    pageSize: z
      .number()
      .int()
      .min(1)
      .max(MARKETPLACE_MAX_PAGE_SIZE)
      .default(12),
  })
  .superRefine((filters, context) => {
    if (
      filters.minimumPrice !== null &&
      filters.maximumPrice !== null &&
      filters.minimumPrice > filters.maximumPrice
    ) {
      context.addIssue({
        code: "custom",
        path: ["maximumPrice"],
        message:
          "Maximum price must be greater than or equal to minimum price.",
      });
    }

    if (
      filters.minimumBedrooms !== null &&
      filters.maximumBedrooms !== null &&
      filters.minimumBedrooms > filters.maximumBedrooms
    ) {
      context.addIssue({
        code: "custom",
        path: ["maximumBedrooms"],
        message:
          "Maximum bedrooms must be greater than or equal to minimum bedrooms.",
      });
    }

    if (
      filters.minimumBathrooms !== null &&
      filters.maximumBathrooms !== null &&
      filters.minimumBathrooms > filters.maximumBathrooms
    ) {
      context.addIssue({
        code: "custom",
        path: ["maximumBathrooms"],
        message:
          "Maximum bathrooms must be greater than or equal to minimum bathrooms.",
      });
    }

    if (
      filters.listedFrom !== null &&
      filters.listedTo !== null &&
      Date.parse(filters.listedFrom) > Date.parse(filters.listedTo)
    ) {
      context.addIssue({
        code: "custom",
        path: ["listedTo"],
        message: "The end date must be on or after the start date.",
      });
    }
  });

export type MarketplaceFiltersInput = z.input<typeof marketplaceFiltersSchema>;

export type MarketplaceFiltersValues = z.output<
  typeof marketplaceFiltersSchema
>;
