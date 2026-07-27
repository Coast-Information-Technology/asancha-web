// File: app/api-partner/client/page.tsx

/**
 * Purpose:
 * Redirects the old API partner client route to the apps route.
 */

import { redirect } from "next/navigation";

export default function Page() {
  redirect("/api-partner/apps");
}
