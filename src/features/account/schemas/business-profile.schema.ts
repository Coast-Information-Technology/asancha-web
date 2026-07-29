// File: src/features/account/schemas/business-profile.schema.ts

/**
 * Business Profile Validation Schemas
 *
 * Purpose:
 * Provides client-side Zod validation for creating and switching
 * role-specific Asancha business profiles.
 *
 * Responsibilities:
 * - Validate supported additional profile types.
 * - Validate profile display names.
 * - Validate optional company public identifiers.
 * - Validate versioned profile-specific policy acceptances.
 * - Validate active-profile switching requests.
 *
 * Security notes:
 * - Client-side validation improves UX only.
 * - Backend DTO validation, duplicate-profile checks, policy requirements,
 *   account status, profile status, and permissions remain final.
 * - Public IDs are opaque strings and must never be interpreted as ObjectIds.
 * - Policy checkboxes must not be selected automatically.
 */

import { z } from "zod";

import {
  BUSINESS_PROFILE_TYPES,
  PROFILE_POLICY_CONTEXTS,
} from "../constants/account.constants";

const businessProfileTypeSchema = z.enum(BUSINESS_PROFILE_TYPES, {
  error: "Choose a valid business profile type.",
});

const publicIdSchema = z
  .string()
  .trim()
  .min(3, "A valid public identifier is required.")
  .max(120, "The public identifier is too long.")
  .regex(
    /^[A-Za-z0-9_-]+$/,
    "The public identifier contains invalid characters.",
  );

const optionalPublicIdSchema = z
  .union([publicIdSchema, z.literal(""), z.null(), z.undefined()])
  .transform((value) => {
    if (!value) {
      return null;
    }

    return value;
  });

export const profilePolicyAcceptanceSchema = z.object({
  policyType: z.enum([
    "terms_of_use",
    "privacy_policy",
    "platform_rules",
    "property_submission_rules",
    "listing_standards",
    "sourcer_compliance_declaration",
    "api_acceptable_use_policy",
    "api_billing_terms",
    "data_processing_consent",
    "authority_declaration",
  ]),

  policyVersion: z
    .string()
    .trim()
    .min(1, "Policy version is required.")
    .max(50, "Policy version is too long."),

  source: z.enum([
    "profile_creation",
    "api_application",
    "policy_reacceptance",
  ]),
});

export const businessProfileSchema = z
  .object({
    profileType: businessProfileTypeSchema,

    displayName: z
      .string()
      .trim()
      .min(2, "Profile name must contain at least 2 characters.")
      .max(120, "Profile name must contain no more than 120 characters."),

    companyPublicId: optionalPublicIdSchema,

    policyAcceptances: z.array(profilePolicyAcceptanceSchema).default([]),
  })
  .superRefine((values, context) => {
    const acceptanceKeys = values.policyAcceptances.map(
      (acceptance) => `${acceptance.policyType}:${acceptance.policyVersion}`,
    );

    if (new Set(acceptanceKeys).size !== acceptanceKeys.length) {
      context.addIssue({
        code: "custom",
        path: ["policyAcceptances"],
        message: "The same policy version cannot be accepted more than once.",
      });
    }

    const expectedSource =
      values.profileType === "api_partner"
        ? "api_application"
        : "profile_creation";

    const invalidSourceIndex = values.policyAcceptances.findIndex(
      (acceptance) =>
        acceptance.source !== expectedSource &&
        acceptance.source !== "policy_reacceptance",
    );

    if (invalidSourceIndex >= 0) {
      context.addIssue({
        code: "custom",
        path: ["policyAcceptances", invalidSourceIndex, "source"],
        message:
          values.profileType === "api_partner"
            ? "API partner policies must use the API application source."
            : "Business profile policies must use the profile creation source.",
      });
    }

    if (values.profileType === "api_partner" && values.displayName.length < 3) {
      context.addIssue({
        code: "custom",
        path: ["displayName"],
        message:
          "Enter the organisation or integration name for the API partner application.",
      });
    }
  });

export const switchBusinessProfileSchema = z.object({
  profileType: businessProfileTypeSchema,
});

export const profilePolicyContextSchema = z.enum([
  PROFILE_POLICY_CONTEXTS.investor,
  PROFILE_POLICY_CONTEXTS.property_owner,
  PROFILE_POLICY_CONTEXTS.property_agent,
  PROFILE_POLICY_CONTEXTS.property_sourcer,
  PROFILE_POLICY_CONTEXTS.service_provider,
  PROFILE_POLICY_CONTEXTS.api_partner,
]);

export type BusinessProfileFormInput = z.input<typeof businessProfileSchema>;

export type BusinessProfileFormValues = z.output<typeof businessProfileSchema>;

export type SwitchBusinessProfileFormValues = z.output<
  typeof switchBusinessProfileSchema
>;
