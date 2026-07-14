// File: app/dashboard/property-sourcer/deals/[listingPublicId]/edit/page.tsx

/**
 * Asancha Edit Sourcer Deal Route
 *
 * Purpose:
 * Updates an editable deal using its public listing identifier.
 *
 * Security notes:
 * - Backend lifecycle rules determine whether editing is allowed.
 */

import type { Metadata } from "next";

import { PropertySourcerDealForm } from "../../../../_components/property-sourcer-deal-form";

export const metadata: Metadata = {
    title: "Edit Deal",
};

export interface EditSourcerDealRouteProps {
    params: Promise<{
        listingPublicId: string;
    }>;
}

export default async function EditSourcerDealRoute({
    params,
}: EditSourcerDealRouteProps) {
    const { listingPublicId } = await params;

    return (
        <PropertySourcerDealForm
            mode="edit"
            listingPublicId={listingPublicId}
        />
    );
}