// File: src/features/listings/schemas/listing-create.schema.ts

/**
 * Asancha Listing Creation Schema
 *
 * Purpose:
 * Provides client-side Zod validation for creating, updating, submitting, and
 * withdrawing authenticated user listings.
 *
 * Responsibilities:
 * - Validate the linked approved property public ID.
 * - Validate listing descriptions, category, type, pricing, and strategies.
 * - Validate access requirements and investment values.
 * - Require listing-standard, accuracy, and authority declarations.
 * - Validate listing withdrawal reasons.
 *
 * Security notes:
 * - Client-side validation improves UX only.
 * - Backend DTO validation and listing policies remain authoritative.
 * - Users must not submit publication, approval, visibility, or protected deal
 *   status values through this schema.
 * - A valid form does not mean the listing is approved or published.
 */

import { z } from "zod";

import {
  LISTING_CATEGORY_OPTIONS,
  LISTING_STRATEGY_OPTIONS,
  LISTING_TYPE_OPTIONS,
} from "../constants/listings.constants";

const listingTypeValues = LISTING_TYPE_OPTIONS.map((option) => option.value);

const listingCategoryValues = LISTING_CATEGORY_OPTIONS.map(
  (option) => option.value,
);

const strategyValues = LISTING_STRATEGY_OPTIONS.map((option) => option.value);

function enumFromValues<TValue extends string>(values: readonly TValue[]) {
  return z.enum(values as [TValue, ...TValue[]]);
}

const publicIdSchema = z
  .string()
  .trim()
  .min(3, "Choose a valid property.")
  .max(120, "The property identifier is too long.")
  .regex(
    /^[A-Za-z0-9_-]+$/,
    "The property identifier contains invalid characters.",
  );

const nullableMoneySchema = z
  .union([z.number().finite().nonnegative(), z.nan(), z.null(), z.undefined()])
  .transform((value) => {
    if (value === null || value === undefined || Number.isNaN(value)) {
      return null;
    }

    return value;
  });

const uniqueTextArraySchema = (maximumItems: number, maximumLength: number) =>
  z
    .array(
      z
        .string()
        .trim()
        .min(1, "Empty values are not allowed.")
        .max(maximumLength, `Enter no more than ${maximumLength} characters.`),
    )
    .max(maximumItems, `Add no more than ${maximumItems} items.`)
    .default([])
    .superRefine((values, context) => {
      const normalizedValues = values.map((value) =>
        value.toLocaleLowerCase("en-GB"),
      );

      if (new Set(normalizedValues).size !== normalizedValues.length) {
        context.addIssue({
          code: "custom",
          message: "Duplicate values are not allowed.",
        });
      }
    });

const listingPriceDetailsSchema = z
  .object({
    askingPrice: nullableMoneySchema,
    guidePrice: nullableMoneySchema,
    estimatedMarketValue: nullableMoneySchema,
    estimatedMonthlyRent: nullableMoneySchema,
    refurbishmentEstimate: nullableMoneySchema,
    otherAcquisitionCostsEstimate: nullableMoneySchema,
    currency: z.literal("GBP"),
  })
  .superRefine((prices, context) => {
    if (prices.askingPrice === null && prices.guidePrice === null) {
      context.addIssue({
        code: "custom",
        path: ["askingPrice"],
        message: "Enter an asking price or guide price.",
      });
    }

    if (
      prices.askingPrice !== null &&
      prices.estimatedMarketValue !== null &&
      prices.askingPrice > prices.estimatedMarketValue * 10
    ) {
      context.addIssue({
        code: "custom",
        path: ["askingPrice"],
        message: "Review the asking price and estimated market value.",
      });
    }
  });

const listingAccessRequirementsSchema = z
  .object({
    authenticationRequired: z.boolean(),
    investorProfileRequired: z.boolean(),
    onboardingRequired: z.boolean(),
    verificationRequired: z.boolean(),
    proofOfFundsRequired: z.boolean(),
    paymentRequired: z.boolean(),
    reservationRequired: z.boolean(),
  })
  .superRefine((requirements, context) => {
    if (
      requirements.proofOfFundsRequired &&
      !requirements.verificationRequired
    ) {
      context.addIssue({
        code: "custom",
        path: ["verificationRequired"],
        message:
          "Verification should be required when proof of funds is required.",
      });
    }

    if (
      requirements.investorProfileRequired &&
      !requirements.authenticationRequired
    ) {
      context.addIssue({
        code: "custom",
        path: ["authenticationRequired"],
        message:
          "Authentication is required when an investor profile is required.",
      });
    }

    if (
      requirements.onboardingRequired &&
      !requirements.authenticationRequired
    ) {
      context.addIssue({
        code: "custom",
        path: ["authenticationRequired"],
        message: "Authentication is required when onboarding is required.",
      });
    }

    if (
      requirements.verificationRequired &&
      !requirements.authenticationRequired
    ) {
      context.addIssue({
        code: "custom",
        path: ["authenticationRequired"],
        message: "Authentication is required when verification is required.",
      });
    }
  });

export const listingCreateSchema = z.object({
  propertyPublicId: publicIdSchema,

  title: z
    .string()
    .trim()
    .min(5, "Listing title must contain at least 5 characters.")
    .max(160, "Listing title must contain no more than 160 characters."),

  shortDescription: z
    .string()
    .trim()
    .min(20, "Short description must contain at least 20 characters.")
    .max(300, "Short description must contain no more than 300 characters."),

  description: z
    .string()
    .trim()
    .min(50, "Listing description must contain at least 50 characters.")
    .max(
      10_000,
      "Listing description must contain no more than 10,000 characters.",
    ),

  listingType: enumFromValues(listingTypeValues),

  listingCategory: enumFromValues(listingCategoryValues),

  occupancyStatus: z.enum([
    "vacant",
    "owner_occupied",
    "tenanted",
    "part_occupied",
    "unknown",
  ]),

  priceDetails: listingPriceDetailsSchema,

  investmentStrategies: z
    .array(enumFromValues(strategyValues))
    .min(1, "Choose at least one suitable investment strategy.")
    .max(10, "Choose no more than 10 investment strategies."),

  badges: uniqueTextArraySchema(12, 80),

  features: uniqueTextArraySchema(30, 160),

  accessRequirements: listingAccessRequirementsSchema,

  isFeaturedRequested: z.boolean(),

  informationAccurateConfirmed: z.boolean(),

  listingStandardsAccepted: z.boolean(),

  authorityConfirmed: z.boolean(),
});

export const listingSubmissionSchema = z.object({
  informationAccurateConfirmed: z.literal(true, {
    error: "Confirm that the listing information is accurate.",
  }),

  listingStandardsAccepted: z.literal(true, {
    error: "Accept the current listing standards before submitting.",
  }),

  authorityConfirmed: z.literal(true, {
    error: "Confirm that you have authority to market this property.",
  }),
});

export const listingWithdrawalSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(10, "Provide a short reason for withdrawing the listing.")
    .max(500, "Withdrawal reason must contain no more than 500 characters."),
});

export type ListingCreateFormInput = z.input<typeof listingCreateSchema>;

export type ListingCreateFormValues = z.output<typeof listingCreateSchema>;

export type ListingSubmissionFormValues = z.output<
  typeof listingSubmissionSchema
>;

export type ListingWithdrawalFormValues = z.output<
  typeof listingWithdrawalSchema
>;
