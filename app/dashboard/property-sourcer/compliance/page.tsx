// File: app/dashboard/property-sourcer/compliance/page.tsx

/**
 * Asancha Property Sourcer Compliance Route
 *
 * Purpose:
 * Displays compliance, policy, verification, fee, and payout readiness.
 */

import type { Metadata } from "next";

import { PropertySourcerCompliancePage } from "../../_components/property-sourcer-compliance-page";

export const metadata: Metadata = {
    title: "Sourcer Compliance",
};

export default function SourcerCompliancePage() {
    return <PropertySourcerCompliancePage />;
}