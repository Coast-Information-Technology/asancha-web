// File: src/features/properties/schemas/property-create.schema.ts

/**
 * Asancha Property Creation Schema
 *
 * Purpose:
 * Provides client-side Zod validation for creating and editing property
 * records in property-owner and property-agent workspaces.
 *
 * Responsibilities:
 * - Validate property title and private reference name.
 * - Validate UK property address fields.
 * - Validate physical property information.
 * - Validate ownership capacity and authority information.
 * - Require accuracy and authority declarations before final submission.
 *
 * Security notes:
 * - Client-side validation improves UX only.
 * - Backend DTO validation and business rules remain authoritative.
 * - Authority declarations do not replace supporting document review.
 * - A valid property form does not grant publication or listing approval.
 * - Public IDs are treated as opaque identifiers.
 */

import { z } from "zod";

import {
  PROPERTY_AUTHORITY_TYPE_OPTIONS,
  PROPERTY_CONDITION_OPTIONS,
  PROPERTY_OCCUPANCY_OPTIONS,
  PROPERTY_OWNERSHIP_CAPACITY_OPTIONS,
  PROPERTY_TENURE_OPTIONS,
  PROPERTY_TYPE_OPTIONS,
} from "../constants/properties.constants";

const propertyTypeValues = PROPERTY_TYPE_OPTIONS.map((option) => option.value);

const tenureValues = PROPERTY_TENURE_OPTIONS.map((option) => option.value);

const occupancyValues = PROPERTY_OCCUPANCY_OPTIONS.map(
  (option) => option.value,
);

const conditionValues = PROPERTY_CONDITION_OPTIONS.map(
  (option) => option.value,
);

const ownershipCapacityValues = PROPERTY_OWNERSHIP_CAPACITY_OPTIONS.map(
  (option) => option.value,
);

const authorityTypeValues = PROPERTY_AUTHORITY_TYPE_OPTIONS.map(
  (option) => option.value,
);

function enumFromValues<TValue extends string>(values: readonly TValue[]) {
  return z.enum(values as [TValue, ...TValue[]]);
}

const nullableTrimmedTextSchema = (maximumLength: number) =>
  z
    .union([z.string(), z.null(), z.undefined()])
    .transform((value) => {
      const normalized = value?.trim();

      return normalized ? normalized : null;
    })
    .pipe(
      z
        .string()
        .max(maximumLength, `Enter no more than ${maximumLength} characters.`)
        .nullable(),
    );

const optionalPublicIdSchema = z
  .union([z.string(), z.null(), z.undefined()])
  .transform((value) => {
    const normalized = value?.trim();

    return normalized ? normalized : null;
  })
  .pipe(
    z
      .string()
      .min(3, "A valid public identifier is required.")
      .max(120, "The public identifier is too long.")
      .regex(
        /^[A-Za-z0-9_-]+$/,
        "The public identifier contains invalid characters.",
      )
      .nullable(),
  );

const nullableNonNegativeIntegerSchema = z
  .union([z.number().int().nonnegative(), z.nan(), z.null(), z.undefined()])
  .transform((value) => {
    if (value === null || value === undefined || Number.isNaN(value)) {
      return null;
    }

    return value;
  });

const nullablePositiveNumberSchema = z
  .union([z.number().positive(), z.nan(), z.null(), z.undefined()])
  .transform((value) => {
    if (value === null || value === undefined || Number.isNaN(value)) {
      return null;
    }

    return value;
  });

const ukPostcodeSchema = z
  .string()
  .trim()
  .toUpperCase()
  .min(5, "Enter a valid UK postcode.")
  .max(8, "Enter a valid UK postcode.")
  .regex(/^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/, "Enter a valid UK postcode.");

const propertyAddressSchema = z.object({
  addressLine1: z
    .string()
    .trim()
    .min(3, "Address line 1 is required.")
    .max(160, "Address line 1 is too long."),

  addressLine2: nullableTrimmedTextSchema(160),

  townOrCity: z
    .string()
    .trim()
    .min(2, "Town or city is required.")
    .max(100, "Town or city is too long."),

  county: nullableTrimmedTextSchema(100),

  postcode: ukPostcodeSchema,

  countryCode: z.literal("GB"),
});

const propertyCoordinatesSchema = z
  .object({
    latitude: z.number().min(-90).max(90),

    longitude: z.number().min(-180).max(180),
  })
  .nullable();

const propertyPhysicalDetailsSchema = z
  .object({
    propertyType: enumFromValues(propertyTypeValues),

    customPropertyType: nullableTrimmedTextSchema(100),

    bedrooms: nullableNonNegativeIntegerSchema,

    bathrooms: nullableNonNegativeIntegerSchema,

    receptionRooms: nullableNonNegativeIntegerSchema,

    kitchens: nullableNonNegativeIntegerSchema,

    floorAreaSquareFeet: nullablePositiveNumberSchema,

    plotAreaSquareFeet: nullablePositiveNumberSchema,

    yearBuilt: z
      .union([
        z
          .number()
          .int()
          .min(1000)
          .max(new Date().getFullYear() + 2),
        z.nan(),
        z.null(),
        z.undefined(),
      ])
      .transform((value) => {
        if (value === null || value === undefined || Number.isNaN(value)) {
          return null;
        }

        return value;
      }),

    tenureType: enumFromValues(tenureValues),

    leaseYearsRemaining: nullableNonNegativeIntegerSchema,

    occupancyStatus: enumFromValues(occupancyValues),

    condition: enumFromValues(conditionValues),
  })
  .superRefine((values, context) => {
    if (values.propertyType === "other" && values.customPropertyType === null) {
      context.addIssue({
        code: "custom",
        path: ["customPropertyType"],
        message: "Describe the property type.",
      });
    }

    if (
      values.tenureType === "leasehold" &&
      values.leaseYearsRemaining === null
    ) {
      context.addIssue({
        code: "custom",
        path: ["leaseYearsRemaining"],
        message: "Enter the remaining lease term where known.",
      });
    }
  });

const propertyOwnershipDetailsSchema = z
  .object({
    ownershipCapacity: enumFromValues(ownershipCapacityValues),

    authorityType: enumFromValues(authorityTypeValues),

    ownerDisplayName: nullableTrimmedTextSchema(160),

    ownerCompanyPublicId: optionalPublicIdSchema,

    representingCompanyPublicId: optionalPublicIdSchema,

    jointOwnerNames: z
      .array(
        z
          .string()
          .trim()
          .min(2, "Enter a valid joint-owner name.")
          .max(160, "Joint-owner name is too long."),
      )
      .default([])
      .superRefine((names, context) => {
        const normalizedNames = names.map((name) =>
          name.toLocaleLowerCase("en-GB"),
        );

        if (new Set(normalizedNames).size !== normalizedNames.length) {
          context.addIssue({
            code: "custom",
            message: "A joint owner cannot be added more than once.",
          });
        }
      }),

    authorityDeclarationAccepted: z.boolean(),

    informationAccuracyConfirmed: z.boolean(),
  })
  .superRefine((values, context) => {
    if (
      values.ownershipCapacity === "joint_owner" &&
      values.jointOwnerNames.length === 0
    ) {
      context.addIssue({
        code: "custom",
        path: ["jointOwnerNames"],
        message: "Add at least one joint owner.",
      });
    }

    if (
      values.ownershipCapacity === "company_owner" &&
      values.ownerCompanyPublicId === null
    ) {
      context.addIssue({
        code: "custom",
        path: ["ownerCompanyPublicId"],
        message: "Choose the company that owns the property.",
      });
    }

    if (
      ["agent_for_owner", "authorised_representative", "sourcer"].includes(
        values.ownershipCapacity,
      ) &&
      values.representingCompanyPublicId === null &&
      values.ownerDisplayName === null
    ) {
      context.addIssue({
        code: "custom",
        path: ["ownerDisplayName"],
        message: "Provide the owner or represented party.",
      });
    }

    if (
      values.ownershipCapacity === "sole_owner" &&
      values.authorityType !== "owner"
    ) {
      context.addIssue({
        code: "custom",
        path: ["authorityType"],
        message: "A sole owner should use owner authority.",
      });
    }
  });

export const propertyCreateSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Property title must contain at least 5 characters.")
    .max(160, "Property title must contain no more than 160 characters."),

  referenceName: nullableTrimmedTextSchema(100),

  address: propertyAddressSchema,

  coordinates: propertyCoordinatesSchema,

  physicalDetails: propertyPhysicalDetailsSchema,

  ownershipDetails: propertyOwnershipDetailsSchema,

  shortDescription: nullableTrimmedTextSchema(1_000),

  internalUserNotes: nullableTrimmedTextSchema(2_000),
});

export const propertySubmissionSchema = z.object({
  informationAccurate: z.literal(true, {
    error: "Confirm that the property information is accurate.",
  }),

  authorityConfirmed: z.literal(true, {
    error: "Confirm that you own the property or have authority to submit it.",
  }),
});

export type PropertyCreateFormInput = z.input<typeof propertyCreateSchema>;

export type PropertyCreateFormValues = z.output<typeof propertyCreateSchema>;

export type PropertySubmissionFormValues = z.output<
  typeof propertySubmissionSchema
>;
