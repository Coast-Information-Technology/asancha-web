// File: app/dashboard/property-sourcer/deals/new/page.tsx

/**
 * Asancha New Sourcer Deal Route
 *
 * Purpose:
 * Creates an investment-focused deal draft.
 *
 * Security notes:
 * - Creating a draft does not approve or publish the deal.
 */

import type { Metadata } from "next";

import { PropertySourcerDealForm } from "../../../_components/property-sourcer-deal-form";

export const metadata: Metadata = {
    title: "Submit Deal",
};

export default function NewSourcerDealPage() {
    return (
        <PropertySourcerDealForm mode="create" />
    );
}