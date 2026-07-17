"use client";

// File: app/auth/sign-up/_components/signup-flow.tsx

/**
 * Asancha Signup Flow
 *
 * Purpose:
 * Coordinates the ordinary public-user signup flow for Asancha Web Public.
 *
 * Main responsibilities:
 * - Keep signup as one multi-step route at /auth/sign-up
 * - Restrict ordinary signup to public signup roles only
 * - Collect account details and policy acknowledgements
 * - Show safe email verification next-step guidance
 *
 * Important Asancha Web Public rule:
 * API partner access is separate from ordinary signup.
 * Admin/staff accounts must not be created from public signup.
 *
 * Security note:
 * This component does not replace backend validation, policy versioning,
 * email verification, password hashing, account status checks, or audit logs.
 */

import Link from "next/link";
import { useMemo, useState } from "react";

import { Button } from "@/src/components/ui/button/button";
import { authApi } from "@/src/features/auth/api/auth.api";
import { AUTH_SAFE_MESSAGES } from "@/src/features/auth/constants/auth.constants";
import type { AccountPolicyType } from "@/src/features/auth/types/auth.types";
import type { PublicSignupRole } from "@/src/lib/auth/role-guards";
import { getRoleLabel } from "@/src/lib/auth/role-guards";

import {
  AccountDetailsStep,
  SignupAccountDetails,
} from "./account-details-step";
import { EmailVerificationStep } from "./email-verification-step";
import { RoleSelectionStep } from "./role-selection-step";

type SignupStep = "role" | "account" | "verify";

const emptyAccountDetails: SignupAccountDetails = {
  email: "",
  password: "",
  confirmPassword: "",
  policies: {
    termsAccepted: false,
    privacyAccepted: false,
    platformRulesAccepted: false,
    dataProcessingConsentAccepted: false,
  },
};

function getAcceptedPolicies(
  policies: SignupAccountDetails["policies"],
): AccountPolicyType[] {
  const acceptedPolicies: AccountPolicyType[] = [];

  if (policies.termsAccepted) {
    acceptedPolicies.push("terms_of_use");
  }

  if (policies.privacyAccepted) {
    acceptedPolicies.push("privacy_policy");
  }

  if (policies.platformRulesAccepted) {
    acceptedPolicies.push("platform_rules");
  }

  if (policies.dataProcessingConsentAccepted) {
    acceptedPolicies.push("data_processing_consent");
  }

  return acceptedPolicies;
}

/**
 * Renders the multi-step public signup flow.
 */
export function SignupFlow() {
  const [step, setStep] = useState<SignupStep>("role");
  const [selectedRole, setSelectedRole] = useState<PublicSignupRole | null>(
    null,
  );
  const [accountDetails, setAccountDetails] =
    useState<SignupAccountDetails>(emptyAccountDetails);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const stepNumber = useMemo(() => {
    if (step === "role") {
      return 1;
    }

    if (step === "account") {
      return 2;
    }

    return 3;
  }, [step]);

  function handleRoleContinue() {
    if (!selectedRole) {
      return;
    }

    setStep("account");
  }

  async function handleAccountSubmit(value: SignupAccountDetails) {
    if (!selectedRole) {
      setStep("role");
      return;
    }

    setSubmitError(null);
    setIsSubmitting(true);

    try {
      await authApi.signUp({
        email: value.email.trim().toLowerCase(),
        password: value.password,
        role: selectedRole,
        acceptedPolicies: getAcceptedPolicies(value.policies),
      });

      setAccountDetails(value);
      setStep("verify");
    } catch {
      setSubmitError(AUTH_SAFE_MESSAGES.genericError);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleStartOver() {
    setSelectedRole(null);
    setAccountDetails(emptyAccountDetails);
    setStep("role");
  }

  return (
    <div className="rounded-lg border border-border bg-card/95 p-6 shadow-xl shadow-slate-950/10 sm:p-8">
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-wide text-primary">
          Create public account
        </p>

        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-card-foreground sm:text-4xl">
          Join Asancha
        </h1>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Step {stepNumber} of 3. Ordinary signup is for investors, property
          owners, property agents, property sourcers, and service providers.
        </p>

        <p className="mt-4 text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            className="font-bold !text-primary hover:!text-primary-hover focus:outline-none focus:ring-4 focus:ring-primary/20"
            href="/auth/sign-in"
          >
            Sign in
          </Link>
        </p>

        <div
          aria-label={`Signup progress: step ${stepNumber} of 3`}
          className="mt-5 grid grid-cols-3 gap-2"
        >
          {["Role", "Account", "Verify"].map((label, index) => {
            const active = index + 1 <= stepNumber;

            return (
              <div
                className={`rounded-md border px-3 py-2 text-center text-xs font-extrabold ${
                  active
                    ? "border-primary bg-accent text-primary"
                    : "border-border bg-muted/70 text-muted-foreground"
                }`}
                key={label}
              >
                {label}
              </div>
            );
          })}
        </div>

        {selectedRole ? (
          <p className="mt-4 inline-flex rounded-md bg-accent px-3 py-1 text-xs font-bold text-primary">
            Selected role: {getRoleLabel(selectedRole)}
          </p>
        ) : null}
      </div>

      {step === "role" ? (
        <>
          <RoleSelectionStep
            onSelectRole={setSelectedRole}
            selectedRole={selectedRole}
          />

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Link
              className="text-sm font-bold text-primary hover:text-primary-hover focus:outline-none focus:ring-4 focus:ring-primary/20"
              href="/api-partner/apply"
            >
              Applying as an API partner?
            </Link>

            <Button disabled={!selectedRole} onClick={handleRoleContinue}>
              Continue
            </Button>
          </div>
        </>
      ) : null}

      {step === "account" ? (
        <AccountDetailsStep
          initialValue={accountDetails}
          isSubmitting={isSubmitting}
          onBack={() => setStep("role")}
          onSubmit={handleAccountSubmit}
        />
      ) : null}

      {submitError ? (
        <p
          className="mt-5 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm leading-6 text-destructive"
          role="alert"
        >
          {submitError}
        </p>
      ) : null}

      {step === "verify" ? (
        <EmailVerificationStep
          email={accountDetails.email}
          onStartOver={handleStartOver}
        />
      ) : null}
    </div>
  );
}
