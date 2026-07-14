// File: app/dashboard/property-sourcer/performance/page.tsx

import type { Metadata } from "next";

import { PropertySourcerPerformancePage } from "../../_components/property-sourcer-performance-page";

export const metadata: Metadata = {
    title: "Sourcer Performance",
};

export default function SourcerPerformancePage() {
    return (
        <PropertySourcerPerformancePage
            view="overview"
        />
    );
}