// File: app/dashboard/property-sourcer/bookings/page.tsx

import type { Metadata } from "next";

import { PropertySourcerCollectionPage } from "../../_components/property-sourcer-collection-page";
import { PROPERTY_SOURCER_COLLECTION_CONFIG } from "../../_config/property-sourcer-dashboard.config";

export const metadata: Metadata = {
    title: "Property Sourcer Bookings",
};

export default function SourcerBookingsPage() {
    return (
        <PropertySourcerCollectionPage
            config={
                PROPERTY_SOURCER_COLLECTION_CONFIG.bookings
            }
        />
    );
}