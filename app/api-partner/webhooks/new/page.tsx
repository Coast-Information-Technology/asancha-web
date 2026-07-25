// File: app/api-partner/webhooks/new/page.tsx

/**
 * Purpose:
 * Route entry for the Asancha API partner workspace.
 *
 * Security notes:
 * Backend authorization and state checks remain authoritative.
 */

import { NewWebhookView } from "../../_components/api-partner-views";

export default function Page() {
  return <NewWebhookView />;
}
