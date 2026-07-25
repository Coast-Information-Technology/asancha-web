// File: app/api-partner/webhooks/page.tsx

/**
 * Purpose:
 * Route entry for the Asancha API partner workspace.
 *
 * Security notes:
 * Backend authorization and state checks remain authoritative.
 */

import { WebhooksView } from "../_components/api-partner-views";

export default function Page() {
  return <WebhooksView />;
}
