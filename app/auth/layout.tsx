// File: app/auth/layout.tsx

/**
 * Asancha Auth Layout
 *
 * Purpose:
 * Provides a focused authentication layout for Asancha Web Public.
 *
 * Main responsibilities:
 * - Keep auth pages separate from public marketing pages
 * - Provide a simple accessible auth shell
 * - Link users safely back to the public website
 * - Avoid admin/staff navigation or staff login assumptions
 *
 * Important Asancha Web Public rule:
 * Public users must not register as staff.
 * Guest is anonymous only.
 * API partner access is controlled and separate from ordinary signup.
 *
 * Security note:
 * This layout must not expose backend URLs, admin/staff URLs, tokens,
 * API keys, private KYC notes, internal admin notes, or ObjectIds.
 */

import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, LifeBuoy, LockKeyhole, Workflow } from "lucide-react";

import styles from "./auth-layout.module.css";

interface AuthLayoutProps {
  children: React.ReactNode;
}

/**
 * Renders the auth layout shell.
 */
export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link className={styles.brandLink} href="/">
            <Image
              alt="Asancha logo"
              className={styles.brandLogo}
              height={80}
              priority
              src="/logo.png"
              width={80}
            />
          </Link>

          <nav aria-label="Authentication support" className={styles.headerNav}>
            <Link className={styles.headerLink} href="/">
              Home
            </Link>
            <Link className={styles.headerLink} href="/support">
              Help
            </Link>
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        <section
          aria-label="Asancha account access"
          className={styles.contextPanel}
        >
          <p className={styles.kicker}>Public user access</p>
          <h1 className={styles.headline}>
            A clearer account path for property work.
          </h1>
          <p className={styles.copy}>
            Sign in, create an account, verify details, and continue into the
            right Asancha workspace with focused steps and safe account
            handling.
          </p>

          <div className={styles.signalGrid}>
            <div className={styles.signalItem}>
              <span aria-hidden="true" className={styles.signalIcon}>
                <LockKeyhole size={16} strokeWidth={2.5} />
              </span>
              <div>
                <p className={styles.signalTitle}>Secure session handoff</p>
                <p className={styles.signalCopy}>
                  Authentication remains backend-controlled with no exposed
                  token values in the browser UI.
                </p>
              </div>
            </div>

            <div className={styles.signalItem}>
              <span aria-hidden="true" className={styles.signalIcon}>
                <Workflow size={16} strokeWidth={2.5} />
              </span>
              <div>
                <p className={styles.signalTitle}>Role-aware onboarding</p>
                <p className={styles.signalCopy}>
                  Each account can continue into investor, owner, agent,
                  sourcer, or service-provider workflows.
                </p>
              </div>
            </div>

            <div className={styles.signalItem}>
              <span aria-hidden="true" className={styles.signalIcon}>
                <BadgeCheck size={16} strokeWidth={2.5} />
              </span>
              <div>
                <p className={styles.signalTitle}>Verification ready</p>
                <p className={styles.signalCopy}>
                  Email, profile, document, and policy steps stay visible
                  without exposing private review details.
                </p>
              </div>
            </div>

            <div className={styles.signalItem}>
              <span aria-hidden="true" className={styles.signalIcon}>
                <LifeBuoy size={16} strokeWidth={2.5} />
              </span>
              <div>
                <p className={styles.signalTitle}>Support is close</p>
                <p className={styles.signalCopy}>
                  Recovery, verification, and access-state pages keep safe
                  routes back to support.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className={styles.formPanel}>{children}</div>
      </main>
    </div>
  );
}
