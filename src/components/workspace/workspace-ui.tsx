"use client";

import Link from "next/link";
import {
  Children,
  cloneElement,
  Fragment,
  isValidElement,
  useId,
  type ReactNode,
  type ReactElement,
} from "react";
import { useDashboardState } from "@/app/dashboard/_components/dashboard-state-context";

export const buttonClass =
  "inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground! transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";
export const secondaryClass =
  "inline-flex min-h-11 items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50";
export const inputClass =
  "min-h-11 w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus-visible:outline-2 focus-visible:outline-primary";
export const panelClass = "rounded-xl border border-border bg-card p-5 sm:p-6";

export function label(value: string | null | undefined) {
  return value
    ? value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "Not available";
}
export function dateLabel(value: string | null | undefined) {
  if (!value) return "Not available";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Not available"
    : date.toLocaleString("en-GB");
}
export function money(value: number, currency = "GBP") {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency }).format(
    value,
  );
}
/** Restrict backend-provided action links to app-relative paths. */
export function appPath(value: string | null | undefined): string | null {
  return value &&
    /^\/(?!\/)/.test(value) &&
    !/[\\\u0000-\u0020]/.test(value) &&
    !value.includes("://")
    ? value
    : null;
}
export function WorkspaceGate({ children }: { children: ReactNode }) {
  const { dashboardState, isLoading, errorMessage } = useDashboardState();
  if (isLoading)
    return (
      <div className="p-6">
        <Loading />
      </div>
    );
  if (!dashboardState)
    return (
      <div className="p-6">
        <Feedback
          error={
            errorMessage ??
            "Your workspace could not be loaded. Refresh the page to try again."
          }
        />
      </div>
    );
  return (
    <Fragment
      key={
        dashboardState.activeBusinessProfile?.profilePublicId ??
        dashboardState.activeBusinessProfileType ??
        "account"
      }
    >
      {children}
    </Fragment>
  );
}
export function WorkspacePage({
  title,
  description,
  back,
  actions,
  children,
}: {
  title: string;
  description?: string;
  back?: { href: string; label: string };
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:py-8">
      {back && (
        <Link
          href={back.href}
          className="text-sm font-semibold text-primary! hover:underline"
        >
          ← {back.label}
        </Link>
      )}
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-6">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold text-foreground">{title}</h1>
          {description && (
            <p className="mt-3 leading-7 text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        {actions}
      </header>
      {children}
    </main>
  );
}
export function Feedback({
  error,
  success,
}: {
  error?: string | null;
  success?: string | null;
}) {
  return (
    <>
      {error && (
        <p
          role="alert"
          className="rounded-lg border border-destructive bg-card p-4 text-sm text-destructive"
        >
          {error}
        </p>
      )}
      {success && (
        <p
          role="status"
          className="rounded-lg border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-900"
        >
          {success}
        </p>
      )}
    </>
  );
}
export function Loading() {
  return (
    <p role="status" className="py-6 text-muted-foreground">
      Loading your workspace…
    </p>
  );
}
export function Empty({ children }: { children: ReactNode }) {
  return (
    <div className={`${panelClass} text-muted-foreground`}>{children}</div>
  );
}
export function Status({ value }: { value: string }) {
  const color = ["approved", "paid", "read", "resolved"].includes(value)
    ? "border-emerald-200 bg-emerald-50 text-emerald-900"
    : ["rejected", "failed", "blocked"].includes(value)
      ? "border-red-200 bg-red-50 text-red-900"
      : "border-border bg-muted text-foreground";
  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${color}`}
    >
      {label(value)}
    </span>
  );
}
export function Field({
  label: title,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  const generatedId = useId();
  const control = Children.toArray(children).find(
    (child) =>
      isValidElement(child) &&
      typeof child.type === "string" &&
      ["input", "select", "textarea"].includes(child.type),
  ) as ReactElement<{ id?: string }> | undefined;
  const id = control?.props.id ?? generatedId;
  return (
    <div className="grid gap-2 text-sm font-semibold">
      <label htmlFor={id}>{title}</label>
      {Children.map(children, (child) =>
        isValidElement(child) &&
        typeof child.type === "string" &&
        ["input", "select", "textarea"].includes(child.type)
          ? cloneElement(child as ReactElement<{ id?: string }>, { id })
          : child,
      )}
    </div>
  );
}
export function Confirm({
  name,
  children,
  required = true,
}: {
  name: string;
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <label className="flex items-start gap-3 text-sm leading-6">
      <input
        className="mt-1 size-4 shrink-0 accent-primary"
        name={name}
        type="checkbox"
        required={required}
      />
      {children}
    </label>
  );
}
export function Pagination({
  pagination,
  onPage,
  busy,
}: {
  pagination: {
    page: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  } | null;
  onPage: (page: number) => void;
  busy?: boolean;
}) {
  if (!pagination || pagination.totalPages < 2) return null;
  return (
    <nav aria-label="Pagination" className="flex flex-wrap items-center gap-4">
      <button
        type="button"
        className={secondaryClass}
        disabled={busy || !pagination.hasPreviousPage}
        onClick={() => onPage(pagination.page - 1)}
      >
        Previous
      </button>
      <span className="text-sm">
        Page {pagination.page} of {pagination.totalPages}
      </span>
      <button
        type="button"
        className={secondaryClass}
        disabled={busy || !pagination.hasNextPage}
        onClick={() => onPage(pagination.page + 1)}
      >
        Next
      </button>
    </nav>
  );
}
export function ResourceLink({
  href,
  children,
}: {
  href: string | null | undefined;
  children: ReactNode;
}) {
  const safePath = appPath(href);
  return safePath ? (
    <Link
      href={safePath}
      className="font-semibold text-primary! hover:underline"
    >
      {children}
    </Link>
  ) : null;
}
export function AllowedActions({
  actions,
}: {
  actions: readonly {
    action: string;
    allowed: boolean;
    reason: string | null;
    actionLabel: string | null;
    actionPath: string | null;
  }[];
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {actions.map((action) =>
        action.allowed ? (
          <ResourceLink key={action.action} href={action.actionPath}>
            {action.actionLabel ?? label(action.action)}
          </ResourceLink>
        ) : action.reason ? (
          <p className="text-sm text-muted-foreground" key={action.action}>
            {action.actionLabel ?? label(action.action)}: {action.reason}
          </p>
        ) : null,
      )}
    </div>
  );
}
