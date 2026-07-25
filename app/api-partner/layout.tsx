// File: app/api-partner/layout.tsx

/**
 * Purpose:
 * Provides the dedicated API partner application and workspace layout.
 *
 * Security notes:
 * Route visibility is not authorization. API endpoints remain authoritative.
 */

import type { ReactNode } from "react";
import { ApiPartnerShell } from "./_components/api-partner-shell";

export default function ApiPartnerLayout({ children }: { children: ReactNode }) {
  return <ApiPartnerShell>{children}</ApiPartnerShell>;
}
