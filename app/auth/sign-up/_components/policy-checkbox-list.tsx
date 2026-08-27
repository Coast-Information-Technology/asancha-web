"use client";

// File: app/auth/sign-up/_components/policy-checkbox-list.tsx

/**
 * Asancha Policy Checkbox List
 *
 * Purpose:
 * Provides public signup policy acceptance checkboxes.
 *
 * Main responsibilities:
 * - Render required account-level policy acknowledgements
 * - Keep policy acceptance explicit and un-preselected
 * - Provide accessible labels and descriptions
 *
 * Important Asancha Web Public rule:
 * Public account creation requires account-level policy acceptance.
 *
 * Security note:
 * Frontend checkbox state is not final proof of policy acceptance.
 * Backend must version, validate, store, and audit policy acceptance.
 */

import Link from "next/link";

import { Checkbox } from "@/src/components/ui/checkbox/checkbox";

const policyLinkClassName =
  "cursor-pointer rounded-sm underline-offset-4 transition-colors hover:text-primary hover:underline focus-visible:text-primary focus-visible:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30";

function PolicyAcceptanceLink({
  href,
  policyName,
}: {
  href: string;
  policyName: string;
}) {
  return (
    <>
      <Link className={policyLinkClassName} href={href}>
        {policyName}
      </Link>
      .
    </>
  );
}

export interface PolicyAcceptanceValue {
  termsAccepted: boolean;
  privacyAccepted: boolean;
  platformRulesAccepted: boolean;
  dataProcessingConsentAccepted: boolean;
}

interface PolicyCheckboxListProps {
  value: PolicyAcceptanceValue;
  onChange: (value: PolicyAcceptanceValue) => void;
  errorMessage?: string;
}

/**
 * Renders required signup policy checkboxes.
 */
export function PolicyCheckboxList({
  errorMessage,
  onChange,
  value,
}: PolicyCheckboxListProps) {
  function updatePolicy(key: keyof PolicyAcceptanceValue, checked: boolean) {
    onChange({
      ...value,
      [key]: checked,
    });
  }

  return (
    <fieldset className="space-y-4">
      <legend className="text-sm font-bold text-foreground">Agreements</legend>

      <Checkbox
        checked={value.termsAccepted}
        description="The rules for using Asancha."
        errorMessage={
          errorMessage && !value.termsAccepted ? errorMessage : undefined
        }
        label="I accept the"
        labelTrailingContent={
          <PolicyAcceptanceLink href="/legal/terms" policyName="Terms of Use" />
        }
        onChange={(event) =>
          updatePolicy("termsAccepted", event.target.checked)
        }
        required
      />

      <Checkbox
        checked={value.privacyAccepted}
        description="How we handle your information."
        errorMessage={
          errorMessage && !value.privacyAccepted ? errorMessage : undefined
        }
        label="I accept the"
        labelTrailingContent={
          <PolicyAcceptanceLink
            href="/legal/privacy"
            policyName="Privacy Policy"
          />
        }
        onChange={(event) =>
          updatePolicy("privacyAccepted", event.target.checked)
        }
        required
      />

      <Checkbox
        checked={value.platformRulesAccepted}
        description="How members should use the platform."
        errorMessage={
          errorMessage && !value.platformRulesAccepted
            ? errorMessage
            : undefined
        }
        label="I accept the"
        labelTrailingContent={
          <PolicyAcceptanceLink
            href="/legal/platform-rules"
            policyName="Platform Rules"
          />
        }
        onChange={(event) =>
          updatePolicy("platformRulesAccepted", event.target.checked)
        }
        required
      />

      <Checkbox
        checked={value.dataProcessingConsentAccepted}
        description="Permission to create and manage your account."
        errorMessage={
          errorMessage && !value.dataProcessingConsentAccepted
            ? errorMessage
            : undefined
        }
        label="I accept the"
        labelTrailingContent={
          <PolicyAcceptanceLink
            href="/legal/data-processing"
            policyName="Data Processing Consent"
          />
        }
        onChange={(event) =>
          updatePolicy("dataProcessingConsentAccepted", event.target.checked)
        }
        required
      />
    </fieldset>
  );
}
