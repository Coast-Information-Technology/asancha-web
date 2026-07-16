"use client";

// File: app/auth/sign-up/_components/role-selection-step.tsx

/**
 * Asancha Role Selection Step
 *
 * Purpose:
 * Provides ordinary public signup role selection.
 *
 * Main responsibilities:
 * - Allow only approved ordinary public signup roles
 * - Exclude guest, API partner, admin, customer care, and super admin
 * - Explain that users can add more business profiles later
 *
 * Security note:
 * Frontend role selection is user guidance only.
 * Backend must reject forbidden role values and enforce public signup rules.
 */

import type { PublicSignupRole } from "@/src/lib/auth/role-guards";
import { PUBLIC_SIGNUP_ROLES, getRoleLabel } from "@/src/lib/auth/role-guards";

interface RoleSelectionStepProps {
  selectedRole: PublicSignupRole | null;
  onSelectRole: (role: PublicSignupRole) => void;
}

const roleDescriptions: Record<PublicSignupRole, string> = {
  investor:
    "Browse opportunities, save listings, set preferences, and continue into investor workflows.",
  property_owner:
    "Prepare property information, manage listings, and respond to document or verification needs.",
  property_agent:
    "Represent properties with clearer agency, company, listing, and authority-document context.",
  property_sourcer:
    "Submit sourced opportunities, prepare deal packs, and follow compliance-aware workflows.",
  service_provider:
    "Present property-related services, manage availability, bookings, documents, and payments.",
};

/**
 * Renders the signup role selection step.
 */
export function RoleSelectionStep({
  onSelectRole,
  selectedRole,
}: RoleSelectionStepProps) {
  return (
    <section aria-labelledby="signup-role-heading">
      <h2
        className="text-2xl font-extrabold text-foreground"
        id="signup-role-heading"
      >
        Choose your first Asancha role
      </h2>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Select the role that best describes what you want to do first. Existing
        users can add more business profiles later from their account.
      </p>

      <div className="mt-6 grid gap-3">
        {PUBLIC_SIGNUP_ROLES.map((role) => {
          const active = selectedRole === role;

          return (
            <button
              aria-pressed={active}
              className={`rounded-lg border p-4 text-left transition focus:outline-none focus:ring-4 focus:ring-primary/20 ${
                active
                  ? "border-primary bg-accent text-accent-foreground"
                  : "border-border bg-card text-card-foreground hover:border-primary hover:bg-accent"
              }`}
              key={role}
              onClick={() => onSelectRole(role)}
              type="button"
            >
              <span className="block text-base font-bold">
                {getRoleLabel(role)}
              </span>
              <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                {roleDescriptions[role]}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 rounded-lg border border-border bg-muted/80 p-4">
        <p className="text-sm leading-6 text-muted-foreground">
          API partner access is not part of ordinary signup. API partners should
          use the controlled API partner application route.
        </p>
      </div>
    </section>
  );
}
