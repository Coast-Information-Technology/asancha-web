// File: app/api-partner/page.tsx

/**
 * Purpose:
 * Introduces the controlled Asancha API partner programme.
 */

import Link from "next/link";
import { API_PARTNER_ROUTES } from "@/src/features/api-partner/constants/api-partner.constants";
import { PageHeader } from "./_components/api-partner-views";
import styles from "./_components/api-partner.module.css";

export default function ApiPartnerPage() {
  return (
    <div className={styles.page}>
      <PageHeader
        title="Build with Asancha"
        subtitle="Apply for controlled access to approved property, listing, intelligence, recommendation, and webhook capabilities."
        actions={
          <>
            <Link className={styles.button} href={API_PARTNER_ROUTES.apply}>Apply for API access</Link>
            <Link className={styles.buttonSecondary} href={API_PARTNER_ROUTES.applicationStatus}>Check application status</Link>
          </>
        }
      />
      <div className={styles.grid}>
        <div className={styles.card}><h2>Controlled access</h2><p className={styles.muted}>Every application, app, scope, key, plan, and environment remains subject to Asancha approval.</p></div>
        <div className={styles.card}><h2>Partner-safe documentation</h2><p className={styles.muted}>Approved partners receive documentation separated from internal, staff, admin, and worker APIs.</p></div>
        <div className={styles.card}><h2>Secure credentials</h2><p className={styles.muted}>API keys are shown once, stored securely by Asancha, and tracked using safe prefixes only.</p></div>
      </div>
      <div className={styles.notice}>API Partner is not an ordinary public signup role. API keys become available only after application approval, app activation, scope assignment, and any required subscription or payment checks.</div>
    </div>
  );
}
