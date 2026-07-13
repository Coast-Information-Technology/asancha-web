// File: app/dashboard/property-owner/properties/[propertyPublicId]/page.tsx

/**
 * Asancha Property Owner Property Detail Route
 *
 * Purpose:
 * Displays one owner-scoped property using its public identifier.
 *
 * Security notes:
 * - MongoDB ObjectIds must never be used in this route.
 */

import type { Metadata } from "next";

import { PropertyOwnerPropertyDetailPage } from "../../../_components/property-owner-property-detail-page";

export const metadata: Metadata = {
    title: "Property Details",
};

export interface PropertyDetailPageProps {
    params: Promise<{
        propertyPublicId: string;
    }>;
}

export default async function PropertyDetailPage({
    params,
}: PropertyDetailPageProps) {
    const { propertyPublicId } = await params;

    return (
        <PropertyOwnerPropertyDetailPage
            propertyPublicId={propertyPublicId}
        />
    );
}