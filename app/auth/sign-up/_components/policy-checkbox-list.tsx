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

import { Checkbox } from "@/src/components/ui/checkbox/checkbox";

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
      <legend className="text-sm font-bold text-foreground">
        Required policy acknowledgements
      </legend>

      <Checkbox
        checked={value.termsAccepted}
        description="You agree to use Asancha according to the public user terms."
        errorMessage={
          errorMessage && !value.termsAccepted ? errorMessage : undefined
        }
        label="I accept the Terms of Use."
        onChange={(event) =>
          updatePolicy("termsAccepted", event.target.checked)
        }
        required
      />

      <Checkbox
        checked={value.privacyAccepted}
        description="You understand how Asancha handles public and account information."
        errorMessage={
          errorMessage && !value.privacyAccepted ? errorMessage : undefined
        }
        label="I accept the Privacy Policy."
        onChange={(event) =>
          updatePolicy("privacyAccepted", event.target.checked)
        }
        required
      />

      <Checkbox
        checked={value.platformRulesAccepted}
        description="You agree to follow Asancha platform rules and safe workflow expectations."
        errorMessage={
          errorMessage && !value.platformRulesAccepted
            ? errorMessage
            : undefined
        }
        label="I accept the Platform Rules."
        onChange={(event) =>
          updatePolicy("platformRulesAccepted", event.target.checked)
        }
        required
      />

      <Checkbox
        checked={value.dataProcessingConsentAccepted}
        description="You consent to the processing needed to create and manage your public Asancha account."
        errorMessage={
          errorMessage && !value.dataProcessingConsentAccepted
            ? errorMessage
            : undefined
        }
        label="I accept the Data Processing Consent."
        onChange={(event) =>
          updatePolicy("dataProcessingConsentAccepted", event.target.checked)
        }
        required
      />
    </fieldset>
  );
}
