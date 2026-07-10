"use client";

// File: app/auth/sign-up/_components/account-details-step.tsx

/**
 * Asancha Account Details Step
 *
 * Purpose:
 * Collects ordinary public signup account details.
 *
 * Main responsibilities:
 * - Collect name, email, phone, password, and confirmation password
 * - Render required account-level policy acceptance checkboxes
 * - Provide accessible inline validation messages
 *
 * Security note:
 * Frontend validation improves UX only.
 * Backend DTO validation, password hashing, policy acceptance versioning,
 * email verification token generation, and audit logging remain final.
 */

import { useState } from "react";

import { Button } from "@/src/components/ui/button/button";
import { Input } from "@/src/components/ui/input/input";

import {
  PolicyAcceptanceValue,
  PolicyCheckboxList,
} from "./policy-checkbox-list";

export interface SignupAccountDetails {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  policies: PolicyAcceptanceValue;
}

interface AccountDetailsStepProps {
  initialValue: SignupAccountDetails;
  onBack: () => void;
  onSubmit: (value: SignupAccountDetails) => void;
}

interface AccountDetailsErrors {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
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
    policies.platformRulesAccepted
  );
}

/**
 * Validates account details for frontend UX.
 */
function validateAccountDetails(
  value: SignupAccountDetails,
): AccountDetailsErrors {
  const errors: AccountDetailsErrors = {};

  if (value.fullName.trim().length < 2) {
    errors.fullName = "Enter your full name.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (value.phoneNumber.trim().length < 7) {
    errors.phoneNumber = "Enter a valid phone number.";
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
  onBack,
  onSubmit,
}: AccountDetailsStepProps) {
  const [formValue, setFormValue] =
    useState<SignupAccountDetails>(initialValue);
  const [errors, setErrors] = useState<AccountDetailsErrors>({});

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
        Use accurate details. Email verification comes before profile setup.
      </p>

      <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
        <Input
          autoComplete="name"
          errorMessage={errors.fullName}
          label="Full name"
          onChange={(event) => updateField("fullName", event.target.value)}
          required
          value={formValue.fullName}
        />

        <Input
          autoComplete="email"
          errorMessage={errors.email}
          label="Email address"
          onChange={(event) => updateField("email", event.target.value)}
          required
          type="email"
          value={formValue.email}
        />

        <Input
          autoComplete="tel"
          errorMessage={errors.phoneNumber}
          label="Phone number"
          onChange={(event) => updateField("phoneNumber", event.target.value)}
          required
          type="tel"
          value={formValue.phoneNumber}
        />

        <Input
          autoComplete="new-password"
          errorMessage={errors.password}
          helpText="Use at least 8 characters. Avoid reusing passwords from other websites."
          label="Password"
          onChange={(event) => updateField("password", event.target.value)}
          required
          type="password"
          value={formValue.password}
        />

        <Input
          autoComplete="new-password"
          errorMessage={errors.confirmPassword}
          label="Confirm password"
          onChange={(event) =>
            updateField("confirmPassword", event.target.value)
          }
          required
          type="password"
          value={formValue.confirmPassword}
        />

        <PolicyCheckboxList
          errorMessage={errors.policies}
          onChange={(policies) => updateField("policies", policies)}
          value={formValue.policies}
        />

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <Button onClick={onBack} type="button" variant="secondary">
            Back
          </Button>

          <Button type="submit">Continue</Button>
        </div>
      </form>
    </section>
  );
}
