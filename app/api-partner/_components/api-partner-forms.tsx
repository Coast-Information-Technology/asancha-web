"use client";

// File: app/api-partner/_components/api-partner-forms.tsx

/**
 * Purpose:
 * Keeps legacy API partner form exports available for route modules that still
 * import them while the current application form lives in /api-partner/apply.
 */

import { LockedState } from "./api-partner-views";

export function ApiPartnerApplicationForm() {
  return (
    <LockedState
      href="/api-partner/apply"
      nextAction="Open application form"
      reason="API partner applications are completed from the dedicated apply page."
      title="Application form moved"
    />
  );
}

export function ApiKeyCreateForm() {
  return (
    <LockedState
      href="/api-partner/dashboard"
      nextAction="Return to dashboard"
      reason="API key creation is available after API partner approval."
      title="API key creation locked"
    />
  );
}

export function ApiWebhookForm() {
  return (
    <LockedState
      href="/api-partner/dashboard"
      nextAction="Return to dashboard"
      reason="Webhook setup is available after API partner approval."
      title="Webhook setup locked"
    />
  );
}

export function ApiPartnerSupportForm() {
  return (
    <LockedState
      href="/contact"
      nextAction="Contact support"
      reason="Use the contact page for API partner support while the workspace support form is prepared."
      title="Support form"
    />
  );
}
