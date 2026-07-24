"use client";

// File: app/api-partner/dashboard/_components/api-partner-dashboard-page-client.tsx

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  ExternalLink,
  KeyRound,
  LifeBuoy,
  Loader2,
  RefreshCcw,
  ShieldCheck,
  Webhook,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@/src/components/ui/button/button";
import { isAsanchaApiError } from "@/src/lib/api/api-error";
import { API_ROUTES } from "@/src/lib/api/api-routes";
import { authApiGet } from "@/src/lib/api/auth-fetch";

type ApiPartnerApplicationStatusValue =
  | "active"
  | "approved"
  | "completed"
  | "draft"
  | "submitted"
  | "under_review"
  | "more_information_required"
  | "on_hold"
  | "rejected"
  | "withdrawn"
  | "cancelled"
  | string;

interface ApiPartnerContact {
  name?: string;
  email?: string;
  phoneNumber?: string;
}

interface ApiPartnerApplicationStatus {
  partnerPublicId?: string;
  applicationPublicId?: string;
  applicationStatus?: ApiPartnerApplicationStatusValue;
  partnerStatus?: ApiPartnerApplicationStatusValue;
  clientPublicId?: string;
  name?: string;
  environment?: string;
  status?: ApiPartnerApplicationStatusValue;
  billingEmail?: string;
  allowedOrigins?: string[];
  allowedIps?: string[];
  defaultScopes?: string[];
  safeUserMessage?: string | null;
  apiPartner?: {
    companyName?: string;
    website?: string;
    country?: string;
    useCase?: string;
    businessContact?: ApiPartnerContact;
    technicalContact?: ApiPartnerContact;
    scopes?: string[];
    completedAt?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

const MINIMUM_STATUS_LOADING_MS = 3000;

function normalizeStatus(value: string | null | undefined): string {
  return value?.replaceAll("_", " ") ?? "pending review";
}

function isApprovedStatus(
  application: ApiPartnerApplicationStatus | null,
): boolean {
  const statuses = [
    application?.applicationStatus,
    application?.partnerStatus,
    application?.status,
  ];

  return statuses.some(
    (status) =>
      status === "active" || status === "approved" || status === "completed",
  );
}

function getPrimaryStatus(
  application: ApiPartnerApplicationStatus | null,
): string {
  return (
    application?.applicationStatus ??
    application?.partnerStatus ??
    application?.status ??
    "pending_review"
  );
}

function getStatusTone(status: string, approved: boolean): string {
  if (approved) {
    return "border-green-200 bg-green-50 text-green-800";
  }

  if (status === "rejected" || status === "cancelled" || status === "withdrawn") {
    return "border-red-200 bg-red-50 text-red-800";
  }

  if (status === "more_information_required" || status === "on_hold") {
    return "border-amber-200 bg-amber-50 text-amber-800";
  }

  return "border-orange-200 bg-orange-50 text-orange-800";
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export function ApiPartnerDashboardPageClient() {
  const router = useRouter();
  const [application, setApplication] =
    useState<ApiPartnerApplicationStatus | null>(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const approved = useMemo(() => isApprovedStatus(application), [application]);
  const primaryStatus = getPrimaryStatus(application);
  const statusTone = getStatusTone(primaryStatus, approved);

  const loadApplicationStatus = useCallback(async (): Promise<void> => {
    setIsCheckingStatus(true);
    setErrorMessage(null);

    const startedAt = Date.now();

    try {
      const result = await authApiGet<ApiPartnerApplicationStatus>(
        API_ROUTES.apiPartner.applicationStatus,
      );
      const elapsed = Date.now() - startedAt;

      if (elapsed < MINIMUM_STATUS_LOADING_MS) {
        await delay(MINIMUM_STATUS_LOADING_MS - elapsed);
      }

      setApplication(result);
    } catch (error) {
      const elapsed = Date.now() - startedAt;

      if (elapsed < MINIMUM_STATUS_LOADING_MS) {
        await delay(MINIMUM_STATUS_LOADING_MS - elapsed);
      }

      if (
        isAsanchaApiError(error) &&
        (error.code === "not_found" || error.statusCode === 404)
      ) {
        router.replace("/api-partner/apply");
        return;
      }

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "We could not check your application status. Please try again.",
      );
    } finally {
      setIsCheckingStatus(false);
    }
  }, [router]);

  useEffect(() => {
    queueMicrotask(() => {
      void loadApplicationStatus();
    });
  }, [loadApplicationStatus]);

  return (
    <main className="relative min-h-screen bg-[var(--background)] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.08em] text-[var(--primary)]">
              API partner dashboard
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              Partner access overview
            </h1>
            <p className="mt-4 max-w-3xl leading-7 text-[var(--muted-foreground)]">
              Track your application state and manage API access once your
              partner account is approved.
            </p>
          </div>

          {application ? (
            <span
              className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-bold capitalize ${statusTone}`}
            >
              {normalizeStatus(primaryStatus)}
            </span>
          ) : null}
        </div>

        {errorMessage ? (
          <section className="mt-8 rounded-[var(--asancha-radius-lg)] border border-red-200 bg-red-50 p-5 text-sm font-semibold text-red-800">
            {errorMessage}
          </section>
        ) : null}

        {!approved && application ? (
          <section className="mt-8 rounded-[var(--asancha-radius-xl)] border border-orange-200 bg-orange-50 p-6 shadow-sm">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex gap-4">
                <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-700">
                  <Clock3 aria-hidden="true" size={21} />
                </span>
                <div>
                  <h2 className="text-2xl font-bold text-orange-950">
                    Application review in progress
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-orange-900">
                    {application.safeUserMessage ||
                      "Your API partner application is not approved yet. Check back here for the latest status or contact Asancha if you need help."}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  isLoading={isCheckingStatus}
                  loadingLabel="Checking"
                  onClick={() => void loadApplicationStatus()}
                >
                  <RefreshCcw aria-hidden="true" size={16} />
                  Check application status
                </Button>
                <Link
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--asancha-radius-md)] border border-orange-300 bg-white px-5 py-2 text-sm font-bold text-orange-900 hover:bg-orange-100"
                  href="/contact"
                >
                  <LifeBuoy aria-hidden="true" size={16} />
                  Contact support
                </Link>
              </div>
            </div>
          </section>
        ) : null}

        {approved ? (
          <section className="mt-8 rounded-[var(--asancha-radius-xl)] border border-green-200 bg-green-50 p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700">
                <CheckCircle2 aria-hidden="true" size={21} />
              </span>
              <div>
                <h2 className="text-2xl font-bold text-green-950">
                  API access approved
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-green-900">
                  {application?.safeUserMessage ||
                    "Your API partner application is approved. You can now manage approved access, scopes, keys, usage, and webhooks."}
                </p>
              </div>
            </div>
          </section>
        ) : null}

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Client",
              description:
                "Review client environment, approved scopes, and safe access details.",
              icon: ShieldCheck,
              href: "/api-partner/client",
              locked: !approved,
            },
            {
              title: "API keys",
              description:
                "Create and revoke API keys once partner access is approved.",
              icon: KeyRound,
              href: "/api-partner/keys",
              locked: !approved,
            },
            {
              title: "Webhooks",
              description:
                "Configure webhook endpoints for approved partner events.",
              icon: Webhook,
              href: "/api-partner/webhooks",
              locked: !approved,
            },
          ].map((item) => (
            <article
              className="rounded-[var(--asancha-radius-lg)] border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm"
              key={item.title}
            >
              <item.icon
                aria-hidden="true"
                className="text-[var(--primary)]"
                size={22}
              />
              <h2 className="mt-4 text-lg font-bold">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                {item.description}
              </p>
              {item.locked ? (
                <span className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[var(--muted-foreground)]">
                  <AlertCircle aria-hidden="true" size={14} />
                  Available after approval
                </span>
              ) : (
                <Link
                  className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[var(--primary)] hover:text-[var(--primary-hover)]"
                  href={item.href}
                >
                  Open
                  <ExternalLink aria-hidden="true" size={14} />
                </Link>
              )}
            </article>
          ))}
        </section>

        {application ? (
          <section className="mt-8 rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
            <h2 className="text-xl font-bold">Application summary</h2>
            <dl className="mt-5 grid gap-3 text-sm md:grid-cols-2">
              {[
                ["Company", application.apiPartner?.companyName ?? application.name],
                ["Environment", application.environment],
                ["Billing email", application.billingEmail],
                [
                  "Scopes",
                  (
                    application.apiPartner?.scopes ??
                    application.defaultScopes ??
                    []
                  ).join(", "),
                ],
                ["Business contact", application.apiPartner?.businessContact?.email],
                ["Technical contact", application.apiPartner?.technicalContact?.email],
              ].map(([label, value]) => (
                <div
                  className="rounded-[var(--asancha-radius-md)] bg-[var(--muted)] p-4"
                  key={label}
                >
                  <dt className="font-bold">{label}</dt>
                  <dd className="mt-1 text-[var(--muted-foreground)]">
                    {value || "Not available"}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}
      </div>

      {isCheckingStatus ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 px-4 backdrop-blur-sm">
          <section
            aria-live="polite"
            className="w-full max-w-md rounded-[var(--asancha-radius-xl)] border border-white/20 bg-[var(--card)] p-6 text-center shadow-2xl"
          >
            <Loader2
              aria-hidden="true"
              className="mx-auto animate-spin text-[var(--primary)]"
              size={34}
            />
            <h2 className="mt-5 text-xl font-bold">
              Checking application status
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
              We are confirming whether your API partner application exists and
              whether partner access has been approved.
            </p>
          </section>
        </div>
      ) : null}
    </main>
  );
}
