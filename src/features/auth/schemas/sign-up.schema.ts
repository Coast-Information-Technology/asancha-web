// File: src/features/auth/schemas/sign-up.schema.ts

/**
 * Purpose:
 * Defines client-side Zod validation for the ordinary Asancha public signup
 * form hosted at /auth/sign-up.
 *
 * Responsibilities:
 * - Validates the selected ordinary public role.
 * - Validates email and password input.
 * - Confirms that password fields match.
 * - Requires all account-level policy types before account creation.
 * - Produces strongly typed signup-form values.
 *
 * Security notes:
 * - Client-side validation improves UX but does not replace backend validation.
 * - API partner, guest, and staff roles are deliberately excluded.
 * - Policy checkboxes must not be selected automatically.
 * - Password values must not be logged or persisted in browser storage.
 */

import { z } from "zod";

import {
  AUTH_PASSWORD_RULES,
  PUBLIC_SIGNUP_ROLES,
  REQUIRED_SIGNUP_POLICY_TYPES,
} from "../constants/auth.constants";

/**
 * Zod schema for an ordinary public signup role.
 */
export const publicSignupRoleSchema = z.enum(PUBLIC_SIGNUP_ROLES, {
  error: "Please choose a valid account type to continue.",
});

/**
 * Zod schema for account-level policy types.
 */
export const accountPolicyTypeSchema = z.enum(REQUIRED_SIGNUP_POLICY_TYPES);

/**
 * Shared password validation used by the signup form.
 */
export const signupPasswordSchema = z
  .string()
  .min(
    AUTH_PASSWORD_RULES.minimumLength,
    `Password must contain at least ${AUTH_PASSWORD_RULES.minimumLength} characters.`,
  )
  .max(
    AUTH_PASSWORD_RULES.maximumLength,
    `Password must contain no more than ${AUTH_PASSWORD_RULES.maximumLength} characters.`,
  )
  .regex(/[a-z]/, "Password must include a lowercase letter.")
  .regex(/[A-Z]/, "Password must include an uppercase letter.")
  .regex(/[0-9]/, "Password must include a number.")
  .regex(/[^A-Za-z0-9]/, "Password must include a special character.");

/**
 * Full signup form schema.
 *
 * acceptedPolicyTypes represents the checkboxes selected in the browser. Before
 * calling the registration endpoint, the UI should combine these types with
 * the active backend-provided policy versions.
 */
export const signUpSchema = z
  .object({
    selectedRole: publicSignupRoleSchema,

    email: z
      .string()
      .trim()
      .min(1, "Email address is required.")
      .email("Enter a valid email address.")
      .max(254, "Email address is too long.")
      .transform((email) => email.toLowerCase()),

    password: signupPasswordSchema,

    confirmPassword: z.string().min(1, "Confirm your password."),

    acceptedPolicyTypes: z
      .array(accountPolicyTypeSchema)
      .default([])
      .superRefine((acceptedPolicies, context) => {
        for (const requiredPolicy of REQUIRED_SIGNUP_POLICY_TYPES) {
          if (!acceptedPolicies.includes(requiredPolicy)) {
            context.addIssue({
              code: "custom",
              message: "Please accept all required policies.",
              params: {
                missingPolicyType: requiredPolicy,
              },
            });
          }
        }
      }),
  })
  .superRefine((values, context) => {
    if (values.password !== values.confirmPassword) {
      context.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "Passwords do not match.",
      });
    }

    const uniquePolicies = new Set(values.acceptedPolicyTypes);

    if (uniquePolicies.size !== values.acceptedPolicyTypes.length) {
      context.addIssue({
        code: "custom",
        path: ["acceptedPolicyTypes"],
        message: "A policy cannot be accepted more than once.",
      });
    }
  });

/**
 * Input values accepted by React Hook Form before Zod transformations.
 */
export type SignUpFormInput = z.input<typeof signUpSchema>;

/**
 * Validated and transformed signup form values.
 */
export type SignUpFormValues = z.output<typeof signUpSchema>;
