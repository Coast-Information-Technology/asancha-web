"use client";

// File: app/auth/sign-up/_components/account-details-step.tsx

/**
 * Asancha Account Details Step
 *
 * Purpose:
 * Collects ordinary public signup account details.
 *
 * Main responsibilities:
 * - Collect email, password, and confirmation password
 * - Render required account-level policy acceptance checkboxes
 * - Provide accessible inline validation messages
 *
 * Security note:
 * Frontend validation improves UX only.
 * Backend DTO validation, password hashing, policy acceptance versioning,
 * email verification token generation, and audit logging remain final.
 */

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/src/components/ui/button/button";
import { Input } from "@/src/components/ui/input/input";

import {
  PolicyAcceptanceValue,
  PolicyCheckboxList,
} from "./policy-checkbox-list";

export interface SignupAccountDetails {
  email: string;
  password: string;
  confirmPassword: string;
  policies: PolicyAcceptanceValue;
}

interface AccountDetailsStepProps {
  initialValue: SignupAccountDetails;
  isSubmitting?: boolean;
  onBack: () => void;
  onSubmit: (value: SignupAccountDetails) => void;
}

interface AccountDetailsErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  policies?: string;
}

/**
 * Checks whether every required policy has been accepted.
 */
function hasAcceptedRequiredPolicies(policies: PolicyAcceptanceValue): boolean {
  return (
    policies.termsAccepted &&
    policies.privacyAccepted &&
    policies.platformRulesAccepted &&
    policies.dataProcessingConsentAccepted
  );
}

/**
 * Validates account details for frontend UX.
 */
function validateAccountDetails(
  value: SignupAccountDetails,
): AccountDetailsErrors {
  const errors: AccountDetailsErrors = {};

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (value.password.length < 8) {
    errors.password = "Use at least 8 characters.";
  }

  if (value.confirmPassword !== value.password) {
    errors.confirmPassword = "Passwords do not match.";
  }

  if (!hasAcceptedRequiredPolicies(value.policies)) {
    errors.policies = "Accept all required policies to continue.";
  }

  return errors;
}

/**
 * Renders the account details step.
 */
export function AccountDetailsStep({
  initialValue,
  isSubmitting = false,
  onBack,
  onSubmit,
}: AccountDetailsStepProps) {
  const [formValue, setFormValue] =
    useState<SignupAccountDetails>(initialValue);
  const [errors, setErrors] = useState<AccountDetailsErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  function updateField<TKey extends keyof SignupAccountDetails>(
    key: TKey,
    value: SignupAccountDetails[TKey],
  ) {
    setFormValue((currentValue) => ({
      ...currentValue,
      [key]: value,
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateAccountDetails(formValue);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    onSubmit(formValue);
  }

  return (
    <section aria-labelledby="signup-account-heading">
      <h2
        className="text-2xl font-extrabold text-foreground"
        id="signup-account-heading"
      >
        Create your account
      </h2>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        We'll send a verification link to this address.
      </p>

      <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
        <Input
          autoComplete="email"
          disabled={isSubmitting}
          errorMessage={errors.email}
          label="Email address"
          onChange={(event) => updateField("email", event.target.value)}
          required
          type="email"
          value={formValue.email}
        />

        <Input
          autoComplete="new-password"
          disabled={isSubmitting}
          errorMessage={errors.password}
          helpText="Use at least 8 characters."
          label="Password"
          onChange={(event) => updateField("password", event.target.value)}
          required
          rightElement={
            <button
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-primary focus:outline-none focus:ring-4 focus:ring-primary/20"
              disabled={isSubmitting}
              onClick={() => setShowPassword((current) => !current)}
              type="button"
            >
              {showPassword ? (
                <EyeOff aria-hidden="true" size={17} strokeWidth={2.5} />
              ) : (
                <Eye aria-hidden="true" size={17} strokeWidth={2.5} />
              )}
            </button>
          }
          type={showPassword ? "text" : "password"}
          value={formValue.password}
        />

        <Input
          autoComplete="new-password"
          disabled={isSubmitting}
          errorMessage={errors.confirmPassword}
          label="Confirm password"
          onChange={(event) =>
            updateField("confirmPassword", event.target.value)
          }
          required
          rightElement={
            <button
              aria-label={
                showConfirmPassword
                  ? "Hide password confirmation"
                  : "Show password confirmation"
              }
              className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-primary focus:outline-none focus:ring-4 focus:ring-primary/20"
              disabled={isSubmitting}
              onClick={() => setShowConfirmPassword((current) => !current)}
              type="button"
            >
              {showConfirmPassword ? (
                <EyeOff aria-hidden="true" size={17} strokeWidth={2.5} />
              ) : (
                <Eye aria-hidden="true" size={17} strokeWidth={2.5} />
              )}
            </button>
          }
          type={showConfirmPassword ? "text" : "password"}
          value={formValue.confirmPassword}
        />

        <PolicyCheckboxList
          errorMessage={errors.policies}
          onChange={(policies) => updateField("policies", policies)}
          value={formValue.policies}
        />

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <Button
            disabled={isSubmitting}
            onClick={onBack}
            type="button"
            variant="secondary"
          >
            Back
          </Button>

          <Button
            isLoading={isSubmitting}
            loadingLabel="Creating account"
            type="submit"
          >
            Create account
          </Button>
        </div>
      </form>
    </section>
  );
}
