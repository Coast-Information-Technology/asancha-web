// File: app/dashboard/property-sourcer/performance/views/page.tsx

import type { Metadata } from "next";

import { PropertySourcerPerformancePage } from "../../../_components/property-sourcer-performance-page";

export const metadata: Metadata = {
    title: "Deal Views",
};

export default function SourcerPerformanceViewsPage() {
    return (
        <PropertySourcerPerformancePage
            view="views"
        />
    );
}