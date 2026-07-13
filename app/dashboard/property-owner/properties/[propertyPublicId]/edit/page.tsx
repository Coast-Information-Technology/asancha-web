// File: app/dashboard/property-owner/properties/[propertyPublicId]/edit/page.tsx

/**
 * Asancha Edit Owner Property Route
 *
 * Purpose:
 * Updates an editable property using its public identifier.
 *
 * Security notes:
 * - Backend lifecycle and ownership checks determine whether edits are allowed.
 */

import type { Metadata } from "next";

import { PropertyOwnerPropertyForm } from "../../../../_components/property-owner-property-form";

export const metadata: Metadata = {
    title: "Edit Property",
};

export interface EditPropertyPageProps {
    params: Promise<{
        propertyPublicId: string;
    }>;
}

export default async function EditPropertyPage({
    params,
}: EditPropertyPageProps) {
    const { propertyPublicId } = await params;

    return (
        <PropertyOwnerPropertyForm
            mode="edit"
            propertyPublicId={propertyPublicId}
        />
    );
}