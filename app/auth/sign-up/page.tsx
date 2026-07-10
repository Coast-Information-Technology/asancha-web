// File: app/auth/sign-up/page.tsx

/**
 * Asancha Public Sign-Up Page
 *
 * Purpose:
 * Provides the ordinary public-user signup entry for Asancha Web Public.
 *
 * Main responsibilities:
 * - Render one multi-step signup flow
 * - Allow only ordinary public signup roles
 * - Keep API partner separate from ordinary signup
 * - Prevent admin/staff role registration from public frontend
 *
 * Security note:
 * Frontend signup validation is user guidance only.
 * Backend account creation, policy acceptance, role validation, and audit
 * logging remain final.
 */

import type { Metadata } from "next";

import { SignupFlow } from "./_components/signup-flow";

export const metadata: Metadata = {
  title: "Create an Asancha Account",
  description:
    "Create a public Asancha account as an investor, property owner, property agent, property sourcer, or service provider.",
  alternates: {
    canonical: "/auth/sign-up",
  },
};

/**
 * Renders the public signup page.
 */
export default function SignUpPage() {
  return <SignupFlow />;
}
