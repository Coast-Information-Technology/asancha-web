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
import { BadgeCheck, LifeBuoy, SearchCheck, Workflow } from "lucide-react";

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
          <p className={styles.kicker}>Your Asancha account</p>
          <h1 className={styles.headline}>
            Start with the right property workspace.
          </h1>
          <p className={styles.copy}>
            Sign in or create an account to access your workspace and the tools
            that match how you use Asancha.
          </p>

          <div className={styles.signalGrid}>
            <div className={styles.signalItem}>
              <span aria-hidden="true" className={styles.signalIcon}>
                <SearchCheck size={16} strokeWidth={2.5} />
              </span>
              <div>
                <p className={styles.signalTitle}>Find opportunities</p>
                <p className={styles.signalCopy}>
                  Browse public property previews and save the ones you want
                  to revisit.
                </p>
              </div>
            </div>

            <div className={styles.signalItem}>
              <span aria-hidden="true" className={styles.signalIcon}>
                <Workflow size={16} strokeWidth={2.5} />
              </span>
              <div>
                <p className={styles.signalTitle}>Work by role</p>
                <p className={styles.signalCopy}>
                  Continue as an investor, owner, agent, sourcer, or service
                  provider.
                </p>
              </div>
            </div>

            <div className={styles.signalItem}>
              <span aria-hidden="true" className={styles.signalIcon}>
                <BadgeCheck size={16} strokeWidth={2.5} />
              </span>
              <div>
                <p className={styles.signalTitle}>Build trust</p>
                <p className={styles.signalCopy}>
                  Complete profile, policy, document, and verification steps as
                  your account grows.
                </p>
              </div>
            </div>

            <div className={styles.signalItem}>
              <span aria-hidden="true" className={styles.signalIcon}>
                <LifeBuoy size={16} strokeWidth={2.5} />
              </span>
              <div>
                <p className={styles.signalTitle}>Get support</p>
                <p className={styles.signalCopy}>
                  Get help with access, verification, account recovery, and
                  general questions.
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
