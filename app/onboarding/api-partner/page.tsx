import type { Metadata } from "next";

import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "API Partner Application | Asancha",
  description: "Continue to the Asancha API partner application.",
};

export default function ApiPartnerOnboardingPage() {
  redirect("/api-partner/apply");
}
