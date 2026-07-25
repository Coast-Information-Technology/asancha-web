// File: app/api-partner/webhooks/deliveries/page.tsx

/**
 * Purpose:
 * Route entry for the Asancha API partner workspace.
 *
 * Security notes:
 * Backend authorization and state checks remain authoritative.
 */

import { WebhookDeliveriesView } from "../../_components/api-partner-views";

export default function Page() {
  return <WebhookDeliveriesView />;
}
