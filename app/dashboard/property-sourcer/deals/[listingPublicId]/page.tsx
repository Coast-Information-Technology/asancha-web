// File: app/dashboard/property-sourcer/deals/[listingPublicId]/page.tsx

/**
 * Asancha Sourcer Deal Detail Route
 *
 * Purpose:
 * Displays a sourcer-owned deal using its public listing identifier.
 */

import type { Metadata } from "next";

import { PropertySourcerDealDetailPage } from "../../../_components/property-sourcer-deal-detail-page";

export const metadata: Metadata = {
    title: "Deal Details",
};

export interface SourcerDealDetailRouteProps {
    params: Promise<{
        listingPublicId: string;
    }>;
}

export default async function SourcerDealDetailRoute({
    params,
}: SourcerDealDetailRouteProps) {
    const { listingPublicId } = await params;

    return (
        <PropertySourcerDealDetailPage
            listingPublicId={listingPublicId}
        />
    );
}