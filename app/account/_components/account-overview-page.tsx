"use client";

// File: app/account/_components/account-overview-page.tsx

/**
 * Asancha Account Overview Page
 *
 * Purpose:
 * Displays the authenticated user's account identity returned by /users/me
 * and links to the dedicated account-management areas.
 *
 * Important:
 * /users/me is not a composite dashboard endpoint. Business profiles,
 * policies, security, documents, and payments are loaded by their own pages.
 */

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { AUTH_API_ENDPOINTS } from "../../../src/features/auth/constants/auth.constants";
import { authApiGet } from "../../../src/lib/api/auth-fetch";
import { isRecord } from "../../../src/lib/api/api-response";
import type {
  AccountBusinessProfileType,
  CurrentAccountUser,
  CurrentAccountUserResponse,
} from "../_types/account.types";

const DASHBOARD_PATHS: Record<AccountBusinessProfileType, string> = {
  investor: "/dashboard/investor",
  property_owner: "/dashboard/property-owner",
  property_agent: "/dashboard/property-agent",
  property_sourcer: "/dashboard/property-sourcer",
  service_provider: "/dashboard/service-provider",
  api_partner: "/api-partner/dashboard",
};

const ACCOUNT_AREAS = [
  {
    title: "Personal profile",
    description: "Manage your personal details and contact preferences.",
    href: "/account/profile",
    linkLabel: "Manage profile",
  },
  {
    title: "Business profiles",
    description: "Create or continue a role-specific business profile.",
    href: "/account/business-profiles/add",
    linkLabel: "Manage business profiles",
  },
  {
    title: "Policies",
    description: "Review required policies and your acceptance status.",
    href: "/account/policies",
    linkLabel: "Review policies",
  },
  {
    title: "Security",
    description: "Manage your password, sessions and account security.",
    href: "/account/security",
    linkLabel: "Open security",
  },
] as const;

function formatValue(value: string | null | undefined): string {
  if (!value) {
    return "Not available";
  }

  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character: string): string => character.toUpperCase());
}

function formatDate(value: string | null | undefined): string {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function isAccountBusinessProfileType(
  value: unknown,
): value is AccountBusinessProfileType {
  return (
    value === "investor" ||
    value === "property_owner" ||
    value === "property_agent" ||
    value === "property_sourcer" ||
    value === "service_provider" ||
    value === "api_partner"
  );
}

function isCurrentAccountUserResponse(
  value: unknown,
): value is CurrentAccountUserResponse {
  if (!isRecord(value) || !isRecord(value.user)) {
    return false;
  }

  const { user } = value;

  return (
    typeof user.publicId === "string" &&
    typeof user.email === "string" &&
    isAccountBusinessProfileType(user.role) &&
    typeof user.isVerified === "boolean" &&
    (typeof user.emailVerifiedAt === "string" ||
      user.emailVerifiedAt === null) &&
    typeof user.onboardingStatus === "string" &&
    typeof user.isActive === "boolean" &&
    typeof user.isSuspended === "boolean" &&
    typeof user.accountStatus === "string" &&
    typeof user.createdAt === "string" &&
    typeof user.updatedAt === "string"
  );
}

export function AccountOverviewPage() {
  const [user, setUser] = useState<CurrentAccountUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadAccount = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await authApiGet<unknown>(AUTH_API_ENDPOINTS.session);

      if (!isCurrentAccountUserResponse(result)) {
        throw new Error("Unexpected current-user response.");
      }

      setUser(result.user);
    } catch {
      setUser(null);
      setErrorMessage("We could not load your account information.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect((): void => {
    queueMicrotask(() => {
      void loadAccount();
    });
  }, [loadAccount]);

  if (isLoading) {
    return (
      <main className="px-4 py-8 sm:px-6 lg:px-8">
        <div
          aria-label="Loading account overview"
          className="h-80 animate-pulse rounded-[var(--asancha-radius-xl)] bg-[var(--muted)]"
        />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="px-4 py-8 sm:px-6 lg:px-8">
        <div
          className="rounded-[var(--asancha-radius-md)] border border-[var(--destructive)] p-5 text-sm text-[var(--destructive)]"
          role="alert"
        >
          <p>{errorMessage ?? "Your account is unavailable."}</p>
          <button
            className="mt-4 cursor-pointer rounded-[var(--asancha-radius-md)] bg-[var(--primary)] px-4 py-2 font-semibold text-[var(--primary-foreground)]"
            onClick={() => void loadAccount()}
            type="button"
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  const dashboardPath = DASHBOARD_PATHS[user.role];
  const accountAvailability = user.isSuspended
    ? "Suspended"
    : user.isActive
      ? "Active"
      : "Inactive";

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--primary)]">
          Account
        </p>
        <h1 className="mt-2 text-3xl font-bold">Account overview</h1>
        <p className="mt-3 max-w-3xl leading-7 text-[var(--muted-foreground)]">
          Review your account identity and continue to the appropriate account
          or business-profile area.
        </p>
      </header>

      {user.isSuspended ? (
        <div
          className="mt-5 rounded-[var(--asancha-radius-md)] border border-[var(--destructive)] bg-[var(--card)] p-4 text-sm leading-6 text-[var(--destructive)]"
          role="alert"
        >
          This account is suspended. Contact Asancha support if you need help.
        </div>
      ) : null}

      <section
        aria-label="Account status summary"
        className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {[
          { label: "Account", value: formatValue(user.accountStatus) },
          {
            label: "Email",
            value: user.isVerified ? "Verified" : "Not verified",
          },
          { label: "Onboarding", value: formatValue(user.onboardingStatus) },
          { label: "Registered role", value: formatValue(user.role) },
        ].map((item) => (
          <article
            className="rounded-[var(--asancha-radius-lg)] border border-[var(--border)] bg-[var(--card)] p-5"
            key={item.label}
          >
            <p className="text-sm text-[var(--muted-foreground)]">
              {item.label}
            </p>
            <p className="mt-2 text-xl font-bold">{item.value}</p>
          </article>
        ))}
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-2">
        <article className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7">
          <h2 className="text-xl font-bold">Account identity</h2>
          <dl className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <dt className="text-sm text-[var(--muted-foreground)]">Email</dt>
              <dd className="mt-1 break-all font-semibold">{user.email}</dd>
            </div>
            <div>
              <dt className="text-sm text-[var(--muted-foreground)]">
                Email verified
              </dt>
              <dd className="mt-1 font-semibold">
                {user.emailVerifiedAt
                  ? formatDate(user.emailVerifiedAt)
                  : "Not verified"}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-[var(--muted-foreground)]">
                Account availability
              </dt>
              <dd className="mt-1 font-semibold">{accountAvailability}</dd>
            </div>
            <div>
              <dt className="text-sm text-[var(--muted-foreground)]">
                Account created
              </dt>
              <dd className="mt-1 font-semibold">
                {formatDate(user.createdAt)}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-[var(--muted-foreground)]">
                Last updated
              </dt>
              <dd className="mt-1 font-semibold">
                {formatDate(user.updatedAt)}
              </dd>
            </div>
          </dl>
        </article>

        <article className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7">
          <h2 className="text-xl font-bold">Registered role</h2>
          <p className="mt-4 text-lg font-bold">{formatValue(user.role)}</p>
          <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
            Your registered role identifies the account journey you started
            with. Active business-profile details are managed separately.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              className="inline-flex min-h-10 cursor-pointer items-center justify-center rounded-[var(--asancha-radius-md)] bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--primary-foreground)]"
              href={dashboardPath}
            >
              Open dashboard
            </Link>
            <Link
              className="inline-flex min-h-10 cursor-pointer items-center justify-center rounded-[var(--asancha-radius-md)] border border-[var(--border)] px-4 py-2 text-sm font-semibold"
              href="/account/status"
            >
              View account status
            </Link>
          </div>
        </article>
      </section>

      <section aria-labelledby="account-areas-heading" className="mt-8">
        <h2 className="text-xl font-bold" id="account-areas-heading">
          Manage your account
        </h2>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Each area loads its information from the relevant dedicated service.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {ACCOUNT_AREAS.map((area) => (
            <article
              className="flex flex-col rounded-[var(--asancha-radius-lg)] border border-[var(--border)] bg-[var(--card)] p-5"
              key={area.href}
            >
              <h3 className="font-bold">{area.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-[var(--muted-foreground)]">
                {area.description}
              </p>
              <Link
                className="mt-4 inline-flex cursor-pointer text-sm font-semibold text-[var(--primary)] hover:underline"
                href={area.href}
              >
                {area.linkLabel}
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
