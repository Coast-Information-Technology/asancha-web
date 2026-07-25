"use client";

// File: app/api-partner/_components/api-partner-views.tsx

import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Building2,
  Copy,
  KeyRound,
  RadioTower,
  ServerCog,
  ShieldCheck,
  X,
  UserRoundCog,
  type LucideIcon,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/src/components/ui/button/button";
import { isAsanchaApiError } from "@/src/lib/api/api-error";
import { API_ROUTES } from "@/src/lib/api/api-routes";
import { authApiGet, authApiPatch, authApiPost } from "@/src/lib/api/auth-fetch";

import styles from "./api-partner.module.css";

interface ApplicationStatus {
  applicationStatus?: string;
  partnerStatus?: string;
  clientPublicId?: string;
  status?: string;
  name?: string;
  environment?: string;
  billingEmail?: string;
  defaultScopes?: string[];
  safeUserMessage?: string | null;
  apiPartner?: {
    companyName?: string;
    businessContact?: {
      email?: string;
    };
    technicalContact?: {
      email?: string;
    };
    scopes?: string[];
  };
}

interface ApiClientKeyResult {
  apiClientPublicId: string;
  keyPublicId: string;
  clientPublicId: string;
  partnerPublicId: string;
  name: string;
  keyPrefix: string;
  scopes: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
  rawApiKey: string;
}

interface ApiPartnerProfile {
  partnerPublicId: string;
  email: string;
  companyName: string;
  contactName: string;
  phoneNumber: string | null;
  website: string | null;
  useCase: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiPartnerUsageSummary {
  period: string;
  approvedPlan: string;
  monthlyLimit: number;
  usedCalls: number;
  remainingCalls: number;
  lastUsedAt: string | null;
  byScope: Array<{
    scope?: string;
    usedCalls?: number;
    calls?: number;
    count?: number;
  }>;
}

interface ApiClientSummary {
  apiClientPublicId: string;
  name: string;
  keyPrefix: string;
  scopes: string[];
  status: string;
  createdAt: string;
  lastUsedAt: string | null;
  revokedAt: string | null;
}

const MINIMUM_STATUS_LOADING_MS = 3000;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function normalizeStatus(value: string | null | undefined): string {
  return value?.replaceAll("_", " ") ?? "pending review";
}

function isApprovedStatus(application: ApplicationStatus | null): boolean {
  return [
    application?.applicationStatus,
    application?.partnerStatus,
    application?.status,
  ].some(
    (status) =>
      status === "active" || status === "approved" || status === "completed",
  );
}

function getPrimaryStatus(application: ApplicationStatus | null): string {
  return (
    application?.applicationStatus ??
    application?.partnerStatus ??
    application?.status ??
    "pending_review"
  );
}

function StatusBadge({ status }: { status: string }) {
  const approved = ["active", "approved", "completed"].includes(status);
  const rejected = ["rejected", "cancelled", "withdrawn"].includes(status);
  const className = approved
    ? styles.badgeSuccess
    : rejected
      ? styles.badgeDanger
      : styles.badgeWarning;

  return (
    <span className={`${styles.badge} ${className}`}>
      {normalizeStatus(status)}
    </span>
  );
}

function formatDate(value: string | null | undefined): string {
  if (!value) return "Not available";

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getSafeMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

function getUsagePercent(usedCalls: number, monthlyLimit: number): number {
  if (monthlyLimit <= 0) {
    return 0;
  }

  return Math.min(100, Math.round((usedCalls / monthlyLimit) * 100));
}

function ScopePills({ scopes }: { scopes: string[] }) {
  if (scopes.length === 0) {
    return <span className={styles.muted}>Not available</span>;
  }

  return (
    <div className={styles.scopeGrid}>
      {scopes.map((scope) => (
        <span className={styles.scopePill} key={scope}>
          {scope}
        </span>
      ))}
    </div>
  );
}

function SecretKeyModal({
  metadata,
  onClose,
  rawApiKey,
  title,
}: {
  metadata?: React.ReactNode;
  onClose: () => void;
  rawApiKey: string;
  title: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copyKey(): Promise<void> {
    await navigator.clipboard.writeText(rawApiKey);
    setCopied(true);
  }

  return (
    <div
      aria-labelledby="api-key-reveal-heading"
      aria-modal="true"
      className={styles.modalBackdrop}
      role="dialog"
    >
      <div className={styles.secretModal}>
        <div className={styles.modalHeader}>
          <div>
            <p className={styles.eyebrow}>One-time key reveal</p>
            <h2 id="api-key-reveal-heading">{title}</h2>
          </div>
          <button
            aria-label="Close API key modal"
            className={styles.iconButton}
            onClick={onClose}
            type="button"
          >
            <X aria-hidden="true" size={18} strokeWidth={2.5} />
          </button>
        </div>

        <p className={styles.muted}>
          Copy this key now and store it in your secure secrets manager. Once
          this modal is closed, the complete key cannot be shown again.
        </p>

        <pre className={styles.secret}>{rawApiKey}</pre>

        {metadata ? <div className={styles.modalMeta}>{metadata}</div> : null}

        <div className={styles.secretActions}>
          <Button onClick={() => void copyKey()} type="button">
            {copied ? (
              <BadgeCheck aria-hidden="true" size={18} strokeWidth={2.5} />
            ) : (
              <Copy aria-hidden="true" size={18} strokeWidth={2.5} />
            )}
            {copied ? "Copied" : "Copy API key"}
          </Button>
          <Button onClick={onClose} type="button" variant="secondary">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  actionHref,
  actionLabel,
  icon: Icon,
  label,
  tone,
  value,
}: {
  actionHref?: string;
  actionLabel?: string;
  icon: LucideIcon;
  label: string;
  tone: string;
  value: string;
}) {
  return (
    <div className={styles.statCard}>
      <div className={styles.row}>
        <span>{label}</span>
        <Icon aria-hidden="true" size={20} />
      </div>
      <strong className={styles.metric}>{value}</strong>
      <p className={styles.muted}>{tone}</p>
      {actionHref && actionLabel ? (
        <Link className={styles.buttonSecondary} href={actionHref}>
          {actionLabel}
          <ArrowRight aria-hidden="true" size={16} />
        </Link>
      ) : null}
    </div>
  );
}

function useAsyncResource<TResource>(
  loader: () => Promise<TResource>,
  fallbackMessage: string,
) {
  const [data, setData] = useState<TResource | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      setData(await loader());
    } catch (error) {
      setData(null);
      setErrorMessage(getSafeMessage(error, fallbackMessage));
    } finally {
      setIsLoading(false);
    }
  }, [fallbackMessage, loader]);

  useEffect(() => {
    queueMicrotask(() => {
      void load();
    });
  }, [load]);

  return {
    data,
    errorMessage,
    isLoading,
    reload: load,
    setData,
  };
}

export function PageHeader({
  actions,
  subtitle,
  title,
}: {
  actions?: React.ReactNode;
  subtitle: string;
  title: string;
}) {
  return (
    <header className={styles.pageHeader}>
      <div>
        <p className={styles.eyebrow}>API partner console</p>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>
      {actions ? <div className={styles.actions}>{actions}</div> : null}
    </header>
  );
}

export function PageLoading() {
  return (
    <div className={styles.page}>
      <div className={styles.skeleton} />
      <div className={styles.skeleton} />
    </div>
  );
}

export function ErrorState({
  message,
  retry,
}: {
  message: string;
  retry?: () => void;
}) {
  return (
    <div className={styles.page}>
      <div className={styles.noticeDanger}>{message}</div>
      {retry ? (
        <Button onClick={retry} type="button">
          Try again
        </Button>
      ) : null}
    </div>
  );
}

export function EmptyState({
  actionHref,
  actionLabel,
  message,
  title,
}: {
  actionHref?: string;
  actionLabel?: string;
  message: string;
  title: string;
}) {
  return (
    <div className={styles.empty}>
      <h2>{title}</h2>
      <p className={styles.muted}>{message}</p>
      {actionHref && actionLabel ? (
        <Link className={styles.button} href={actionHref}>
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}

export function LockedState({
  href,
  nextAction,
  reason,
  title,
}: {
  href: string;
  nextAction: string;
  reason: string;
  title: string;
}) {
  return (
    <div className={styles.card}>
      <h2>{title}</h2>
      <p className={styles.muted}>{reason}</p>
      <Link className={styles.buttonSecondary} href={href}>
        {nextAction}
      </Link>
    </div>
  );
}

function ApplicationSummary({
  application,
}: {
  application: ApplicationStatus;
}) {
  const scopes =
    application.apiPartner?.scopes ?? application.defaultScopes ?? [];

  return (
    <div className={styles.card}>
      <h2>Application summary</h2>
      <div className={styles.row}>
        <strong>Company</strong>
        <span>
          {application.apiPartner?.companyName ??
            application.name ??
            "Not available"}
        </span>
      </div>
      <div className={styles.row}>
        <strong>Environment</strong>
        <span>{application.environment ?? "Not available"}</span>
      </div>
      <div className={styles.row}>
        <strong>Billing email</strong>
        <span>{application.billingEmail ?? "Not available"}</span>
      </div>
      <div className={styles.row}>
        <strong>Scopes</strong>
        <ScopePills scopes={scopes} />
      </div>
    </div>
  );
}

function useApplicationStatus() {
  const [application, setApplication] = useState<ApplicationStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await authApiGet<ApplicationStatus>(
        API_ROUTES.apiPartner.applicationStatus,
      );

      setApplication(result);
    } catch (error) {
      setApplication(null);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "We could not check your application status.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void load();
    });
  }, [load]);

  return {
    application,
    errorMessage,
    isLoading,
    reload: load,
  };
}

export function ApplicationStatusView() {
  const query = useApplicationStatus();

  if (query.isLoading) return <PageLoading />;
  if (query.errorMessage) {
    return <ErrorState message={query.errorMessage} retry={query.reload} />;
  }
  if (!query.application) {
    return (
      <EmptyState
        actionHref="/api-partner/apply"
        actionLabel="Start application"
        message="Submit an application to request controlled access to Asancha APIs."
        title="No API partner application"
      />
    );
  }

  const status = getPrimaryStatus(query.application);

  return (
    <div className={styles.page}>
      <PageHeader
        title="Application status"
        subtitle="Track the review of your API partner application and next steps."
        actions={<StatusBadge status={status} />}
      />
      {query.application.safeUserMessage ? (
        <div className={styles.noticeWarning}>
          {query.application.safeUserMessage}
        </div>
      ) : null}
      <ApplicationSummary application={query.application} />
      <div className={styles.actions}>
        <Button onClick={() => void query.reload()} type="button">
          Check application status
        </Button>
        <Link className={styles.buttonSecondary} href="/contact">
          Contact support
        </Link>
      </div>
    </div>
  );
}

export function DashboardView() {
  const router = useRouter();
  const [application, setApplication] = useState<ApplicationStatus | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [profile, setProfile] = useState<ApiPartnerProfile | null>(null);
  const [usage, setUsage] = useState<ApiPartnerUsageSummary | null>(null);
  const [clients, setClients] = useState<ApiClientSummary[]>([]);

  const loadStatus = useCallback(async () => {
    setIsChecking(true);
    setErrorMessage(null);

    const startedAt = Date.now();

    try {
      const result = await authApiGet<ApplicationStatus>(
        API_ROUTES.apiPartner.applicationStatus,
      );
      const [profileResult, usageResult, clientsResult] = await Promise.all([
        authApiGet<ApiPartnerProfile>(API_ROUTES.apiPartner.me).catch(
          () => null,
        ),
        authApiGet<ApiPartnerUsageSummary>(
          API_ROUTES.apiPartner.usageMe,
        ).catch(() => null),
        authApiGet<ApiClientSummary[]>(
          API_ROUTES.apiPartner.apiClientsMe,
        ).catch(() => []),
      ]);
      const elapsed = Date.now() - startedAt;

      if (elapsed < MINIMUM_STATUS_LOADING_MS) {
        await delay(MINIMUM_STATUS_LOADING_MS - elapsed);
      }

      setApplication(result);
      setProfile(profileResult);
      setUsage(usageResult);
      setClients(clientsResult);
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
          : "We could not check your application status.",
      );
    } finally {
      setIsChecking(false);
    }
  }, [router]);

  useEffect(() => {
    queueMicrotask(() => {
      void loadStatus();
    });
  }, [loadStatus]);

  const approved = isApprovedStatus(application);
  const status = getPrimaryStatus(application);
  const usageText = usage
    ? `${usage.usedCalls.toLocaleString()} / ${usage.monthlyLimit.toLocaleString()}`
    : "Not available";
  const usagePercent = usage
    ? getUsagePercent(usage.usedCalls, usage.monthlyLimit)
    : 0;

  return (
    <div className={styles.page}>
      <PageHeader
        title="API partner dashboard"
        subtitle="Track your application and manage API access after approval."
        actions={application ? <StatusBadge status={status} /> : null}
      />

      {errorMessage ? <div className={styles.noticeDanger}>{errorMessage}</div> : null}

      <section className={styles.heroPanel}>
        <div className={styles.heroContent}>
          <StatusBadge status={status} />
          <h2 className={styles.heroTitle}>
            {approved
              ? "Your partner workspace is active and ready for integration work."
              : "Your API partner access is being reviewed."}
          </h2>
          <p className={styles.muted}>
            {application?.safeUserMessage ||
              (approved
                ? "Manage your client profile, API keys, and usage from this console."
                : "Track the application status here and return when access is approved.")}
          </p>
          <div className={styles.actions}>
            <Button
              isLoading={isChecking}
              loadingLabel="Checking"
              onClick={() => void loadStatus()}
              type="button"
            >
              Check application status
            </Button>
            <Link className={styles.buttonSecondary} href="/contact">
              Contact support
            </Link>
          </div>
        </div>
        <div className={styles.heroMeta}>
          <div className={styles.heroMetric}>
            <span>Company</span>
            <strong>
              {profile?.companyName ??
                application?.apiPartner?.companyName ??
                application?.name ??
                "Not available"}
            </strong>
          </div>
          <div className={styles.heroMetric}>
            <span>Monthly usage</span>
            <strong>{usageText}</strong>
            <div className={styles.progress}>
              <div
                className={styles.progressValue}
                style={{ width: `${usagePercent}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {application ? <ApplicationSummary application={application} /> : null}

      {profile ? (
        <section className={styles.gridTwo}>
          <div className={styles.card}>
            <h2>{profile.companyName}</h2>
            <div className={styles.row}>
              <strong>Contact</strong>
              <span>{profile.contactName}</span>
            </div>
            <div className={styles.row}>
              <strong>Email</strong>
              <span>{profile.email}</span>
            </div>
            <div className={styles.row}>
              <strong>Status</strong>
              <StatusBadge status={profile.status} />
            </div>
          </div>
          <div className={styles.card}>
            <h2>Integration readiness</h2>
            <div className={styles.row}>
              <strong>Application</strong>
              <StatusBadge status={status} />
            </div>
            <div className={styles.row}>
              <strong>Active clients</strong>
              <span>{clients.filter((client) => client.status === "active").length}</span>
            </div>
            <div className={styles.row}>
              <strong>Last API activity</strong>
              <span>{formatDate(usage?.lastUsedAt)}</span>
            </div>
          </div>
        </section>
      ) : null}

      <div className={styles.grid}>
        <StatCard
          actionHref={approved ? "/api-partner/client" : undefined}
          actionLabel="Open client"
          icon={ServerCog}
          label="Client"
          tone="Partner profile and contact details."
          value={profile?.status ? normalizeStatus(profile.status) : "Pending"}
        />
        <StatCard
          actionHref={approved ? "/api-partner/keys" : undefined}
          actionLabel="Manage keys"
          icon={KeyRound}
          label="API keys"
          tone="Active and revoked API client keys."
          value={clients.length.toLocaleString()}
        />
        <StatCard
          actionHref={approved ? "/api-partner/usage" : undefined}
          actionLabel="View usage"
          icon={Activity}
          label="Usage"
          tone="Current monthly request volume."
          value={usageText}
        />
      </div>

      {!approved ? (
        <div className={styles.actions}>
          <Button
            isLoading={isChecking}
            loadingLabel="Checking"
            onClick={() => void loadStatus()}
            type="button"
          >
            Check application status
          </Button>
          <Link className={styles.buttonSecondary} href="/contact">
            Contact support
          </Link>
        </div>
      ) : null}

      {isChecking ? (
        <div className={styles.mobilePanel}>
          <section className={styles.mobileNav} aria-live="polite">
            <div className={styles.skeleton} />
            <h2>Checking application status</h2>
            <p className={styles.muted}>
              We are confirming your API partner application and access status.
            </p>
          </section>
        </div>
      ) : null}
    </div>
  );
}

function PlaceholderView({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className={styles.page}>
      <PageHeader title={title} subtitle={subtitle} />
      <LockedState
        href="/api-partner/dashboard"
        nextAction="Return to dashboard"
        reason="This workspace area depends on approved API partner access and matching service endpoints."
        title="Available after approval"
      />
    </div>
  );
}

function ApiPartnerProfileForm({
  onSaved,
  profile,
}: {
  onSaved: (profile: ApiPartnerProfile) => void;
  profile: ApiPartnerProfile;
}) {
  const [form, setForm] = useState({
    contactName: profile.contactName,
    phoneNumber: profile.phoneNumber ?? "",
    website: profile.website ?? "",
    useCase: profile.useCase,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  async function saveProfile(): Promise<void> {
    setIsSaving(true);
    setSaveMessage(null);

    try {
      const updatedProfile = await authApiPatch<
        ApiPartnerProfile,
        {
          contactName: string;
          phoneNumber: string;
          website: string;
          useCase: string;
        }
      >(API_ROUTES.apiPartner.me, {
        contactName: form.contactName.trim(),
        phoneNumber: form.phoneNumber.trim(),
        website: form.website.trim(),
        useCase: form.useCase.trim(),
      });

      onSaved(updatedProfile);
      setSaveMessage("API partner profile updated.");
    } catch (error) {
      setSaveMessage(
        getSafeMessage(error, "We could not update your API partner profile."),
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className={styles.card}>
      <h2>Editable profile</h2>
      <label className={styles.field}>
        <span className={styles.label}>Contact name</span>
        <input
          className={styles.input}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              contactName: event.target.value,
            }))
          }
          value={form.contactName}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>Phone number</span>
        <input
          className={styles.input}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              phoneNumber: event.target.value,
            }))
          }
          value={form.phoneNumber}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>Website</span>
        <input
          className={styles.input}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              website: event.target.value,
            }))
          }
          value={form.website}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>Use case</span>
        <textarea
          className={styles.textarea}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              useCase: event.target.value,
            }))
          }
          value={form.useCase}
        />
      </label>

      {saveMessage ? <div className={styles.notice}>{saveMessage}</div> : null}

      <Button
        isLoading={isSaving}
        loadingLabel="Saving"
        onClick={() => void saveProfile()}
        type="button"
      >
        Save profile
      </Button>
    </div>
  );
}

export function ApplyView() {
  return (
    <PlaceholderView
      title="Apply for API access"
      subtitle="Use the dedicated application form to submit your API partner application."
    />
  );
}

export function ClientView() {
  const profileQuery = useAsyncResource(
    useCallback(
      () => authApiGet<ApiPartnerProfile>(API_ROUTES.apiPartner.me),
      [],
    ),
    "We could not load your API partner profile.",
  );

  if (profileQuery.isLoading) return <PageLoading />;
  if (profileQuery.errorMessage) {
    return (
      <ErrorState
        message={profileQuery.errorMessage}
        retry={profileQuery.reload}
      />
    );
  }
  if (!profileQuery.data) {
    return (
      <EmptyState
        message="No API partner profile is available."
        title="Profile unavailable"
      />
    );
  }

  return (
    <div className={styles.page}>
      <PageHeader
        title="Client"
        subtitle="View and update your API partner profile details."
        actions={<StatusBadge status={profileQuery.data.status} />}
      />

      <section className={styles.heroPanel}>
        <div className={styles.heroContent}>
          <StatusBadge status={profileQuery.data.status} />
          <h2 className={styles.heroTitle}>{profileQuery.data.companyName}</h2>
          <p className={styles.muted}>{profileQuery.data.useCase}</p>
        </div>
        <div className={styles.heroMeta}>
          <div className={styles.heroMetric}>
            <span>Contact</span>
            <strong>{profileQuery.data.contactName}</strong>
          </div>
          <div className={styles.heroMetric}>
            <span>Created</span>
            <strong>{formatDate(profileQuery.data.createdAt)}</strong>
          </div>
        </div>
      </section>

      <div className={styles.grid}>
        <StatCard
          icon={Building2}
          label="Partner ID"
          tone="Public identifier for this partner profile."
          value={profileQuery.data.partnerPublicId.slice(0, 8)}
        />
        <StatCard
          icon={UserRoundCog}
          label="Contact email"
          tone="Main account email for this partner."
          value={profileQuery.data.email}
        />
        <StatCard
          icon={BadgeCheck}
          label="Profile status"
          tone="Current partner account standing."
          value={normalizeStatus(profileQuery.data.status)}
        />
      </div>

      <ApiPartnerProfileForm
        key={profileQuery.data.partnerPublicId}
        onSaved={profileQuery.setData}
        profile={profileQuery.data}
      />
    </div>
  );
}

export function KeysView() {
  const clientsQuery = useAsyncResource(
    useCallback(
      () => authApiGet<ApiClientSummary[]>(API_ROUTES.apiPartner.apiClientsMe),
      [],
    ),
    "We could not load your API clients.",
  );
  const [isRotating, setIsRotating] = useState(false);
  const [rotationReason, setRotationReason] = useState("");
  const [rawApiKey, setRawApiKey] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [selectedClientId, setSelectedClientId] = useState("");

  if (clientsQuery.isLoading) return <PageLoading />;
  if (clientsQuery.errorMessage) {
    return (
      <ErrorState
        message={clientsQuery.errorMessage}
        retry={clientsQuery.reload}
      />
    );
  }

  const clients = clientsQuery.data ?? [];
  const activeClients = clients.filter((client) => client.status === "active");
  const revokedClients = clients.filter((client) => client.status === "revoked");
  const selectedClient =
    clients.find((client) => client.apiClientPublicId === selectedClientId) ??
    activeClients[0] ??
    clients[0] ??
    null;

  async function rotateKey(): Promise<void> {
    if (!selectedClient) {
      setActionError("No API App is available for key rotation.");
      return;
    }

    setIsRotating(true);
    setActionError(null);
    setRawApiKey(null);

    try {
      const result = await authApiPost<
        ApiClientKeyResult,
        { reason: string }
      >(
        API_ROUTES.apiPartner.rotateApiClientKey(
          selectedClient.apiClientPublicId,
        ),
        {
        reason:
          rotationReason.trim() ||
          "Routine API key rotation requested from the partner dashboard.",
        },
      );

      setRawApiKey(result.rawApiKey);
      setRotationReason("");
      await clientsQuery.reload();
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "We could not rotate the API key.",
      );
    } finally {
      setIsRotating(false);
    }
  }

  return (
    <div className={styles.page}>
      <PageHeader
        title="API keys"
        subtitle="Create and rotate partner API keys. Raw keys are shown once after creation or rotation."
        actions={
          <Link className={styles.button} href="/api-partner/keys/new">
            <KeyRound aria-hidden="true" size={18} />
            Create key
          </Link>
        }
      />

      <div className={styles.grid}>
        <StatCard
          actionHref="/api-partner/keys/new"
          actionLabel="Create key"
          icon={KeyRound}
          label="Total Apps"
          tone="All API Apps created by this partner account."
          value={clients.length.toLocaleString()}
        />
        <StatCard
          icon={ShieldCheck}
          label="Active keys"
          tone="Keys currently allowed for API requests."
          value={activeClients.length.toLocaleString()}
        />
        <StatCard
          icon={RadioTower}
          label="Revoked keys"
          tone="Keys that can no longer be used."
          value={revokedClients.length.toLocaleString()}
        />
      </div>

      {clients.length === 0 ? (
        <EmptyState
          actionHref="/api-partner/keys/new"
          actionLabel="Create API key"
          message="No API Apps have been created yet."
          title="No API Apps"
        />
      ) : (
        <div className={styles.card}>
          <h2>API Apps</h2>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Prefix</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Last used</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client.apiClientPublicId}>
                    <td>{client.name}</td>
                    <td>{client.keyPrefix}</td>
                    <td>
                      <StatusBadge status={client.status} />
                    </td>
                    <td>{formatDate(client.createdAt)}</td>
                    <td>{formatDate(client.lastUsedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <label className={styles.field}>
            <span className={styles.label}>App to rotate</span>
            <select
              className={styles.select}
              onChange={(event) => setSelectedClientId(event.target.value)}
              value={selectedClient?.apiClientPublicId ?? ""}
            >
              {clients.map((client) => (
                <option
                  key={client.apiClientPublicId}
                  value={client.apiClientPublicId}
                >
                  {client.name} ({client.status})
                </option>
              ))}
            </select>
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Rotation reason</span>
            <textarea
              className={styles.textarea}
              onChange={(event) => setRotationReason(event.target.value)}
              placeholder="Routine key rotation after internal security review."
              value={rotationReason}
            />
          </label>

          {actionError ? (
            <div className={styles.noticeDanger}>{actionError}</div>
          ) : null}

          {rawApiKey ? (
            <SecretKeyModal
              rawApiKey={rawApiKey}
              title="New API key generated"
              onClose={() => setRawApiKey(null)}
              metadata={
                selectedClient ? (
                  <>
                    <div className={styles.row}>
                      <strong>App</strong>
                      <span>{selectedClient.name}</span>
                    </div>
                    <div className={styles.row}>
                      <strong>Prefix</strong>
                      <span>{selectedClient.keyPrefix}</span>
                    </div>
                  </>
                ) : null
              }
            />
          ) : null}

          <Button
            disabled={!selectedClient}
            isLoading={isRotating}
            loadingLabel="Rotating"
            onClick={() => void rotateKey()}
            type="button"
          >
            <KeyRound aria-hidden="true" size={18} />
            Rotate API key
          </Button>
        </div>
      )}
    </div>
  );
}

export function NewKeyView() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [requestedScopes, setRequestedScopes] = useState<string[]>([
    "sandbox:read",
  ]);
  const [rawApiKey, setRawApiKey] = useState<string | null>(null);
  const [createdKey, setCreatedKey] = useState<ApiClientKeyResult | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function toggleScope(scope: string, checked: boolean): void {
    setRequestedScopes((current) => {
      const next = new Set(current);

      if (checked) next.add(scope);
      else next.delete(scope);

      return Array.from(next);
    });
  }

  async function createKey(): Promise<void> {
    if (name.trim().length < 2) {
      setErrorMessage("Enter a name for this API key.");
      return;
    }

    if (requestedScopes.length === 0) {
      setErrorMessage("Select at least one scope.");
      return;
    }

    setIsCreating(true);
    setErrorMessage(null);
    setRawApiKey(null);

    try {
      const result = await authApiPost<
        ApiClientKeyResult,
        { name: string; requestedScopes: string[] }
      >(API_ROUTES.apiPartner.apiClients, {
        name: name.trim(),
        requestedScopes,
      });

      setCreatedKey(result);
      setRawApiKey(result.rawApiKey);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "We could not create the API key.",
      );
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <div className={styles.page}>
      <PageHeader
        title="Create API key"
        subtitle="Create a named API App key with requested partner scopes."
      />

      <section className={styles.heroPanel}>
        <div className={styles.heroContent}>
          <StatusBadge status="active" />
          <h2 className={styles.heroTitle}>
            Create a scoped key for your integration environment.
          </h2>
          <p className={styles.muted}>
            Raw keys are only shown once. Store the generated value in your
            secure secrets manager before leaving this page.
          </p>
        </div>
        <div className={styles.heroMeta}>
          <div className={styles.heroMetric}>
            <span>Default environment</span>
            <strong>Sandbox</strong>
          </div>
          <div className={styles.heroMetric}>
            <span>Selected scopes</span>
            <strong>{requestedScopes.length}</strong>
          </div>
        </div>
      </section>

      <div className={styles.card}>
        <label className={styles.field}>
          <span className={styles.label}>Key name</span>
          <input
            className={styles.input}
            onChange={(event) => setName(event.target.value)}
            placeholder="PropBridge Sandbox Key"
            value={name}
          />
        </label>

        <fieldset className={styles.card}>
          <legend className={styles.label}>Requested scopes</legend>
          <div className={styles.checkboxList}>
            {[
              "sandbox:read",
              "properties:read",
              "listings:read",
              "marketplace:read",
            ].map((scope) => (
              <label className={styles.checkboxRow} key={scope}>
                <input
                  checked={requestedScopes.includes(scope)}
                  onChange={(event) => toggleScope(scope, event.target.checked)}
                  type="checkbox"
                />
                <span>{scope}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {errorMessage ? (
          <div className={styles.noticeDanger}>{errorMessage}</div>
        ) : null}

        {rawApiKey && createdKey ? (
          <SecretKeyModal
            rawApiKey={rawApiKey}
            title="API key created"
            onClose={() => setRawApiKey(null)}
            metadata={
              <>
                <div className={styles.row}>
                  <strong>Key prefix</strong>
                  <span>{createdKey.keyPrefix}</span>
                </div>
                <div className={styles.row}>
                  <strong>Status</strong>
                  <StatusBadge status={createdKey.status} />
                </div>
              </>
            }
          />
        ) : null}

        <div className={styles.actions}>
          <Button
            isLoading={isCreating}
            loadingLabel="Creating"
            onClick={() => void createKey()}
            type="button"
          >
            <KeyRound aria-hidden="true" size={18} />
            Create API key
          </Button>
          {createdKey ? (
            <Button
              onClick={() => router.push("/api-partner/keys")}
              type="button"
              variant="secondary"
            >
              Back to keys
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function KeyActivityView() {
  return <PlaceholderView title="Key activity" subtitle="Review safe API key activity." />;
}

export function UsageView() {
  const usageQuery = useAsyncResource(
    useCallback(
      () =>
        authApiGet<ApiPartnerUsageSummary>(API_ROUTES.apiPartner.usageMe),
      [],
    ),
    "We could not load your API usage.",
  );

  if (usageQuery.isLoading) return <PageLoading />;
  if (usageQuery.errorMessage) {
    return <ErrorState message={usageQuery.errorMessage} retry={usageQuery.reload} />;
  }
  if (!usageQuery.data) {
    return (
      <EmptyState
        message="No API usage summary is available yet."
        title="Usage unavailable"
      />
    );
  }

  const usage = usageQuery.data;
  const usagePercent = getUsagePercent(usage.usedCalls, usage.monthlyLimit);

  return (
    <div className={styles.page}>
      <PageHeader
        title="Usage"
        subtitle="Review current API usage for the active billing period."
        actions={<StatusBadge status={usage.approvedPlan} />}
      />

      <section className={styles.heroPanel}>
        <div className={styles.heroContent}>
          <StatusBadge status={usage.approvedPlan} />
          <h2 className={styles.heroTitle}>
            {usage.remainingCalls.toLocaleString()} calls remaining this month.
          </h2>
          <p className={styles.muted}>
            Usage is tracked against your approved plan for the current billing
            period. Last activity: {formatDate(usage.lastUsedAt)}.
          </p>
          <div className={styles.progress}>
            <div
              className={styles.progressValue}
              style={{ width: `${usagePercent}%` }}
            />
          </div>
        </div>
        <div className={styles.heroMeta}>
          <div className={styles.heroMetric}>
            <span>Plan</span>
            <strong>{normalizeStatus(usage.approvedPlan)}</strong>
          </div>
          <div className={styles.heroMetric}>
            <span>Used</span>
            <strong>{usagePercent}%</strong>
          </div>
        </div>
      </section>

      <div className={styles.grid}>
        <StatCard
          icon={BarChart3}
          label="Monthly limit"
          tone="Approved request allowance."
          value={usage.monthlyLimit.toLocaleString()}
        />
        <StatCard
          icon={Activity}
          label="Used calls"
          tone="Requests counted this period."
          value={usage.usedCalls.toLocaleString()}
        />
        <StatCard
          icon={BadgeCheck}
          label="Remaining"
          tone="Available calls before the next reset."
          value={usage.remainingCalls.toLocaleString()}
        />
      </div>

      <div className={styles.card}>
        <h2>{normalizeStatus(usage.period)}</h2>
        <div className={styles.progress}>
          <div
            className={styles.progressValue}
            style={{ width: `${usagePercent}%` }}
          />
        </div>
        <p className={styles.muted}>
          Last used: {formatDate(usage.lastUsedAt)}
        </p>
      </div>

      <div className={styles.card}>
        <h2>Usage by scope</h2>
        {usage.byScope.length ? (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Scope</th>
                  <th>Calls</th>
                </tr>
              </thead>
              <tbody>
                {usage.byScope.map((item) => (
                  <tr key={item.scope ?? "unknown"}>
                    <td>{item.scope ?? "Unknown"}</td>
                    <td>
                      {(
                        item.usedCalls ??
                        item.calls ??
                        item.count ??
                        0
                      ).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className={styles.muted}>No scoped usage has been recorded yet.</p>
        )}
      </div>
    </div>
  );
}

export function WebhooksView() {
  return <PlaceholderView title="Webhooks" subtitle="Manage approved webhook endpoints." />;
}

export function NewWebhookView() {
  return <PlaceholderView title="Add webhook" subtitle="Add webhooks after approval." />;
}

export function WebhookDeliveriesView() {
  return <PlaceholderView title="Webhook deliveries" subtitle="Review webhook delivery status." />;
}

export function WebhookDetailView() {
  const params = useParams<{ webhookPublicId?: string }>();

  return (
    <PlaceholderView
      title="Webhook endpoint"
      subtitle={`Review webhook ${params.webhookPublicId ?? "details"}.`}
    />
  );
}

export function DocsView() {
  return <PlaceholderView title="Documentation" subtitle="Read partner-safe API documentation." />;
}

export function BillingView() {
  return <PlaceholderView title="Billing" subtitle="Review API partner billing details." />;
}

export function PaymentsView() {
  return <PlaceholderView title="Payments" subtitle="Review API partner payment references." />;
}

export function SupportView() {
  return <PlaceholderView title="Support" subtitle="Contact Asancha about API partner access." />;
}
