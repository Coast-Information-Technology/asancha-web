// File: src/features/onboarding/schemas/investor-onboarding.schema.ts

/**
 * Investor Onboarding Validation Schema
 *
 * Purpose:
 * Provides client-side Zod validation for the complete investor onboarding
 * and advanced matching-preference flow.
 *
 * Responsibilities:
 * - Validate investment profile information.
 * - Validate buying criteria and budget.
 * - Validate BMV, occupancy, refurbishment, yield, and ROI preferences.
 * - Validate funding readiness and source-of-funds declarations.
 * - Validate final submission confirmations.
 *
 * Important security notes:
 * - Client-side validation improves UX only.
 * - Backend DTO validation and business rules remain authoritative.
 * - Public IDs are treated as opaque strings.
 * - Verification approval must not be inferred from valid form data.
 */

import { z } from "zod";

import {
  BMV_INTEREST_OPTIONS,
  FUNDING_METHOD_OPTIONS,
  INVESTMENT_STRATEGY_OPTIONS,
  INVESTOR_ACCOUNT_HOLDER_OPTIONS,
  INVESTOR_CATEGORY_OPTIONS,
  INVESTOR_EXPERIENCE_OPTIONS,
  INVESTOR_GOAL_OPTIONS,
  INVESTOR_PRIORITY_OPTIONS,
  INVESTOR_PROPERTY_TYPE_OPTIONS,
  OCCUPANCY_STATUS_OPTIONS,
  PURCHASE_TIMELINE_OPTIONS,
  REFURB_LEVEL_OPTIONS,
  STRATEGY_BADGE_OPTIONS,
} from "../constants/onboarding.constants";

const investorAccountHolderValues = INVESTOR_ACCOUNT_HOLDER_OPTIONS.map(
  (option) => option.value,
);

const investorExperienceValues = INVESTOR_EXPERIENCE_OPTIONS.map(
  (option) => option.value,
);

const investorGoalValues = INVESTOR_GOAL_OPTIONS.map((option) => option.value);

const investorCategoryValues = INVESTOR_CATEGORY_OPTIONS.map(
  (option) => option.value,
);

const investorPropertyTypeValues = INVESTOR_PROPERTY_TYPE_OPTIONS.map(
  (option) => option.value,
);

const investmentStrategyValues = INVESTMENT_STRATEGY_OPTIONS.map(
  (option) => option.value,
);

const strategyBadgeValues = STRATEGY_BADGE_OPTIONS.map(
  (option) => option.value,
);

const bmvInterestValues = BMV_INTEREST_OPTIONS.map((option) => option.value);

const occupancyStatusValues = OCCUPANCY_STATUS_OPTIONS.map(
  (option) => option.value,
);

const refurbLevelValues = REFURB_LEVEL_OPTIONS.map((option) => option.value);

const fundingMethodValues = FUNDING_METHOD_OPTIONS.map(
  (option) => option.value,
);

const purchaseTimelineValues = PURCHASE_TIMELINE_OPTIONS.map(
  (option) => option.value,
);

const investorPriorityValues = INVESTOR_PRIORITY_OPTIONS.map(
  (option) => option.value,
);

const publicIdSchema = z
  .string()
  .trim()
  .min(3, "A valid public identifier is required.")
  .max(100, "The public identifier is too long.");

const optionalPublicIdSchema = z
  .union([publicIdSchema, z.literal(""), z.null()])
  .transform((value) => {
    if (value === "" || value === null) {
      return null;
    }

    return value;
  });

const trimmedOptionalTextSchema = z
  .union([z.string(), z.null(), z.undefined()])
  .transform((value) => {
    const normalized = value?.trim();

    return normalized ? normalized : null;
  });

const uniqueStringArraySchema = z
  .array(
    z
      .string()
      .trim()
      .min(1, "Empty values are not allowed.")
      .max(120, "A value is too long."),
  )
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

const nullablePercentageSchema = z
  .union([
    z
      .number()
      .min(0, "Percentage cannot be below 0.")
      .max(100, "Percentage cannot exceed 100."),
    z.null(),
  ])
  .default(null);

const percentageRangeSchema = z
  .object({
    minimum: nullablePercentageSchema,
    target: nullablePercentageSchema,
    maximum: nullablePercentageSchema,
  })
  .superRefine((range, context) => {
    if (
      range.minimum !== null &&
      range.maximum !== null &&
      range.minimum > range.maximum
    ) {
      context.addIssue({
        code: "custom",
        path: ["maximum"],
        message:
          "The maximum percentage must be greater than or equal to the minimum.",
      });
    }

    if (
      range.target !== null &&
      range.minimum !== null &&
      range.target < range.minimum
    ) {
      context.addIssue({
        code: "custom",
        path: ["target"],
        message: "The target percentage cannot be below the minimum.",
      });
    }

    if (
      range.target !== null &&
      range.maximum !== null &&
      range.target > range.maximum
    ) {
      context.addIssue({
        code: "custom",
        path: ["target"],
        message: "The target percentage cannot exceed the maximum.",
      });
    }
  });

export const investorInvestmentProfileSchema = z
  .object({
    accountHolderType: z.enum(
      investorAccountHolderValues as [
        (typeof investorAccountHolderValues)[number],
        ...(typeof investorAccountHolderValues)[number][],
      ],
    ),

    experienceLevel: z.enum(
      investorExperienceValues as [
        (typeof investorExperienceValues)[number],
        ...(typeof investorExperienceValues)[number][],
      ],
    ),

    investmentGoals: z
      .array(
        z.enum(
          investorGoalValues as [
            (typeof investorGoalValues)[number],
            ...(typeof investorGoalValues)[number][],
          ],
        ),
      )
      .min(1, "Choose at least one investment goal."),

    investorCategory: z.enum(
      investorCategoryValues as [
        (typeof investorCategoryValues)[number],
        ...(typeof investorCategoryValues)[number][],
      ],
    ),

    companyPublicId: optionalPublicIdSchema,

    otherInvestmentGoal: trimmedOptionalTextSchema,
  })
  .superRefine((values, context) => {
    if (
      values.accountHolderType === "company" &&
      values.companyPublicId === null
    ) {
      context.addIssue({
        code: "custom",
        path: ["companyPublicId"],
        message: "Choose the company connected to this investor profile.",
      });
    }

    if (
      values.investmentGoals.includes("other") &&
      values.otherInvestmentGoal === null
    ) {
      context.addIssue({
        code: "custom",
        path: ["otherInvestmentGoal"],
        message: "Describe your other investment goal.",
      });
    }
  });

export const investorBuyingCriteriaSchema = z
  .object({
    preferredLocations: uniqueStringArraySchema.min(
      1,
      "Add at least one preferred location.",
    ),

    excludedLocations: uniqueStringArraySchema,

    priorityLocations: uniqueStringArraySchema,

    targetPurchaseAreas: uniqueStringArraySchema,

    budgetRange: z
      .object({
        minimum: z
          .number()
          .finite()
          .min(0, "Minimum budget cannot be below 0."),

        maximum: z
          .number()
          .finite()
          .positive("Maximum budget must be greater than 0."),

        currency: z.literal("GBP"),
      })
      .superRefine((budget, context) => {
        if (budget.maximum < budget.minimum) {
          context.addIssue({
            code: "custom",
            path: ["maximum"],
            message:
              "Maximum budget must be greater than or equal to minimum budget.",
          });
        }
      }),

    preferredPropertyTypes: z
      .array(
        z.enum(
          investorPropertyTypeValues as [
            (typeof investorPropertyTypeValues)[number],
            ...(typeof investorPropertyTypeValues)[number][],
          ],
        ),
      )
      .min(1, "Choose at least one preferred property type."),

    acceptablePropertyTypes: z.array(
      z.enum(
        investorPropertyTypeValues as [
          (typeof investorPropertyTypeValues)[number],
          ...(typeof investorPropertyTypeValues)[number][],
        ],
      ),
    ),

    excludedPropertyTypes: z.array(
      z.enum(
        investorPropertyTypeValues as [
          (typeof investorPropertyTypeValues)[number],
          ...(typeof investorPropertyTypeValues)[number][],
        ],
      ),
    ),

    strategies: z
      .array(
        z.enum(
          investmentStrategyValues as [
            (typeof investmentStrategyValues)[number],
            ...(typeof investmentStrategyValues)[number][],
          ],
        ),
      )
      .min(1, "Choose at least one investment strategy."),
  })
  .superRefine((values, context) => {
    const preferredLocations = new Set(
      values.preferredLocations.map((location) =>
        location.toLocaleLowerCase("en-GB"),
      ),
    );

    const overlappingExcludedLocation = values.excludedLocations.find(
      (location) => preferredLocations.has(location.toLocaleLowerCase("en-GB")),
    );

    if (overlappingExcludedLocation) {
      context.addIssue({
        code: "custom",
        path: ["excludedLocations"],
        message: "A location cannot be both preferred and excluded.",
      });
    }

    const preferredPropertyTypes = new Set(values.preferredPropertyTypes);

    const overlappingExcludedPropertyType = values.excludedPropertyTypes.find(
      (propertyType) => preferredPropertyTypes.has(propertyType),
    );

    if (overlappingExcludedPropertyType) {
      context.addIssue({
        code: "custom",
        path: ["excludedPropertyTypes"],
        message: "A property type cannot be both preferred and excluded.",
      });
    }
  });

export const investorDealPreferencesSchema = z
  .object({
    strategyBadges: z.array(
      z.enum(
        strategyBadgeValues as [
          (typeof strategyBadgeValues)[number],
          ...(typeof strategyBadgeValues)[number][],
        ],
      ),
    ),

    bmvInterest: z.enum(
      bmvInterestValues as [
        (typeof bmvInterestValues)[number],
        ...(typeof bmvInterestValues)[number][],
      ],
    ),

    preferredBmvDiscountBands: uniqueStringArraySchema,

    minimumBmvDiscountPercent: nullablePercentageSchema,

    acceptableOccupancyStatuses: z.array(
      z.enum(
        occupancyStatusValues as [
          (typeof occupancyStatusValues)[number],
          ...(typeof occupancyStatusValues)[number][],
        ],
      ),
    ),

    preferredOccupancyStatuses: z.array(
      z.enum(
        occupancyStatusValues as [
          (typeof occupancyStatusValues)[number],
          ...(typeof occupancyStatusValues)[number][],
        ],
      ),
    ),

    acceptableRefurbLevels: z.array(
      z.enum(
        refurbLevelValues as [
          (typeof refurbLevelValues)[number],
          ...(typeof refurbLevelValues)[number][],
        ],
      ),
    ),

    preferredRefurbLevels: z.array(
      z.enum(
        refurbLevelValues as [
          (typeof refurbLevelValues)[number],
          ...(typeof refurbLevelValues)[number][],
        ],
      ),
    ),

    grossYieldRange: percentageRangeSchema,

    roiRange: percentageRangeSchema,

    dealBreakers: uniqueStringArraySchema.max(
      20,
      "Add no more than 20 deal breakers.",
    ),

    priorityWeights: z
      .array(
        z.object({
          key: z.enum(
            investorPriorityValues as [
              (typeof investorPriorityValues)[number],
              ...(typeof investorPriorityValues)[number][],
            ],
          ),
          weight: z
            .number()
            .int("Priority weight must be a whole number.")
            .min(0, "Priority weight cannot be below 0.")
            .max(100, "Priority weight cannot exceed 100."),
        }),
      )
      .superRefine((priorities, context) => {
        const keys = priorities.map((priority) => priority.key);

        if (new Set(keys).size !== keys.length) {
          context.addIssue({
            code: "custom",
            message: "Each matching priority may only be included once.",
          });
        }

        const totalWeight = priorities.reduce(
          (total, priority) => total + priority.weight,
          0,
        );

        if (priorities.length > 0 && totalWeight !== 100) {
          context.addIssue({
            code: "custom",
            message: "Matching priority weights must add up to 100.",
          });
        }
      }),
  })
  .superRefine((values, context) => {
    const acceptableOccupancy = new Set(values.acceptableOccupancyStatuses);

    for (const preferredStatus of values.preferredOccupancyStatuses) {
      if (!acceptableOccupancy.has(preferredStatus)) {
        context.addIssue({
          code: "custom",
          path: ["preferredOccupancyStatuses"],
          message: "Preferred occupancy statuses must also be acceptable.",
        });

        break;
      }
    }

    const acceptableRefurbLevels = new Set(values.acceptableRefurbLevels);

    for (const preferredLevel of values.preferredRefurbLevels) {
      if (!acceptableRefurbLevels.has(preferredLevel)) {
        context.addIssue({
          code: "custom",
          path: ["preferredRefurbLevels"],
          message: "Preferred refurbishment levels must also be acceptable.",
        });

        break;
      }
    }

    if (
      values.bmvInterest === "required" &&
      values.minimumBmvDiscountPercent === null
    ) {
      context.addIssue({
        code: "custom",
        path: ["minimumBmvDiscountPercent"],
        message: "Enter the minimum BMV discount you require.",
      });
    }
  });

export const investorFundingReadinessSchema = z
  .object({
    fundingMethods: z
      .array(
        z.enum(
          fundingMethodValues as [
            (typeof fundingMethodValues)[number],
            ...(typeof fundingMethodValues)[number][],
          ],
        ),
      )
      .min(1, "Choose at least one funding method."),

    otherFundingMethod: trimmedOptionalTextSchema,

    proofOfFundsStatus: z.enum([
      "not_required",
      "not_provided",
      "planned",
      "submitted",
      "in_review",
      "approved",
      "rejected",
      "replacement_required",
    ]),

    sourceOfFundsStatus: z.enum([
      "not_required",
      "not_provided",
      "declared",
      "document_submitted",
      "in_review",
      "approved",
      "rejected",
      "on_hold",
    ]),

    sourceOfFundsDeclaration: trimmedOptionalTextSchema,

    targetPurchaseTimeline: z.enum(
      purchaseTimelineValues as [
        (typeof purchaseTimelineValues)[number],
        ...(typeof purchaseTimelineValues)[number][],
      ],
    ),

    proofOfFundsDocumentPublicId: optionalPublicIdSchema,
  })
  .superRefine((values, context) => {
    if (
      values.fundingMethods.includes("other") &&
      values.otherFundingMethod === null
    ) {
      context.addIssue({
        code: "custom",
        path: ["otherFundingMethod"],
        message: "Describe your other funding method.",
      });
    }

    if (
      values.sourceOfFundsStatus === "declared" &&
      values.sourceOfFundsDeclaration === null
    ) {
      context.addIssue({
        code: "custom",
        path: ["sourceOfFundsDeclaration"],
        message: "Provide a source-of-funds declaration.",
      });
    }

    if (
      values.proofOfFundsStatus === "submitted" &&
      values.proofOfFundsDocumentPublicId === null
    ) {
      context.addIssue({
        code: "custom",
        path: ["proofOfFundsDocumentPublicId"],
        message: "Select the proof-of-funds document you submitted.",
      });
    }
  });

export const investorOnboardingSchema = z.object({
  investmentProfile: investorInvestmentProfileSchema,
  buyingCriteria: investorBuyingCriteriaSchema,
  dealPreferences: investorDealPreferencesSchema,
  fundingReadiness: investorFundingReadinessSchema,
  confirmation: z.object({
    informationAccurate: z.literal(true, {
      error: "Confirm that the information you provided is accurate.",
    }),
    matchingPreferencesConfirmed: z.literal(true, {
      error:
        "Confirm that the matching preferences reflect what you are looking for.",
    }),
  }),
});

export type InvestorOnboardingFormInput = z.input<
  typeof investorOnboardingSchema
>;

export type InvestorOnboardingFormValues = z.output<
  typeof investorOnboardingSchema
>;

export type InvestorInvestmentProfileFormValues = z.output<
  typeof investorInvestmentProfileSchema
>;

export type InvestorBuyingCriteriaFormValues = z.output<
  typeof investorBuyingCriteriaSchema
>;

export type InvestorDealPreferencesFormValues = z.output<
  typeof investorDealPreferencesSchema
>;

export type InvestorFundingReadinessFormValues = z.output<
  typeof investorFundingReadinessSchema
>;
