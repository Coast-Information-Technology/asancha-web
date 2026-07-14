// File: app/dashboard/property-sourcer/compliance/declarations/page.tsx

/**
 * Asancha Sourcer Compliance Declaration Route
 *
 * Purpose:
 * Displays and accepts the current sourcer compliance declaration.
 */

import type { Metadata } from "next";

import { PropertySourcerPolicyPage } from "../../../_components/property-sourcer-policy-page";

export const metadata: Metadata = {
    title: "Sourcer Compliance Declaration",
};

export default function SourcerComplianceDeclarationPage() {
    return (
        <PropertySourcerPolicyPage
            policyKey="sourcer_compliance_declaration"
        />
    );
}