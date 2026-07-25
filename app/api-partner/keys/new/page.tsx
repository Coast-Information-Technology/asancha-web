// File: app/api-partner/keys/new/page.tsx

/**
 * Purpose:
 * Route entry for the Asancha API partner workspace.
 *
 * Security notes:
 * Backend authorization and state checks remain authoritative.
 */

import { NewKeyView } from "../../_components/api-partner-views";

export default function Page() {
  return <NewKeyView />;
}
