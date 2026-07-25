// File: app/api-partner/_components/api-partner-states.tsx

/**
 * Purpose:
 * Provides consistent loading, empty, locked, and error states.
 */

import Link from "next/link";

import styles from "./api-partner.module.css";

export function PageLoading() {
  return (
    <div className={styles.grid} aria-label="Loading">
      <div className={styles.skeleton} />
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
    <div className={styles.empty} role="alert">
      <h2>We could not load this page</h2>
      <p className={styles.muted}>{message}</p>
      {retry ? (
        <button className={styles.button} type="button" onClick={retry}>
          Try again
        </button>
      ) : null}
    </div>
  );
}

export function EmptyState({
  title,
  message,
  actionHref,
  actionLabel,
}: {
  title: string;
  message: string;
  actionHref?: string;
  actionLabel?: string;
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
  title,
  reason,
  nextAction,
  href,
}: {
  title: string;
  reason: string;
  nextAction: string;
  href: string;
}) {
  return (
    <div className={styles.empty}>
      <span className={styles.badgeWarning}>Locked</span>
      <h2>{title}</h2>
      <p className={styles.muted}>{reason}</p>
      <p>{nextAction}</p>
      <Link className={styles.button} href={href}>
        Continue
      </Link>
    </div>
  );
}
