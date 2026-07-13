// File: app/dashboard/property-owner/properties/new/page.tsx

/**
 * Asancha Add Property Route
 *
 * Purpose:
 * Creates a new property under the active property-owner profile.
 *
 * Security notes:
 * - Creating a property does not approve or publish it.
 */

import type { Metadata } from "next";

import { PropertyOwnerPropertyForm } from "../../../_components/property-owner-property-form";

export const metadata: Metadata = {
    title: "Add Property",
};

export default function NewPropertyPage() {
    return (
        <PropertyOwnerPropertyForm mode="create" />
    );
}