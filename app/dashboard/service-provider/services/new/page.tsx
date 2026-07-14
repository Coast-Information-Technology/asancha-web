// File: app/dashboard/service-provider/services/new/page.tsx

/**
 * Asancha New Provider Service Route
 *
 * Purpose:
 * Creates a service draft under the active service-provider profile.
 *
 * Security notes:
 * - Creating a service does not approve or publish it.
 */

import type { Metadata } from "next";

import { ServiceProviderServiceForm } from "../../../_components/service-provider-service-form";

export const metadata: Metadata = {
    title: "Add Service",
};

export default function NewProviderServicePage() {
    return <ServiceProviderServiceForm />;
}