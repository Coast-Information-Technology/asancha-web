// File: app/dashboard/property-sourcer/performance/conversions/page.tsx

import type { Metadata } from "next";

import { PropertySourcerPerformancePage } from "../../../_components/property-sourcer-performance-page";

export const metadata: Metadata = {
    title: "Deal Conversions",
};

export default function SourcerPerformanceConversionsPage() {
    return (
        <PropertySourcerPerformancePage
            view="conversions"
        />
    );
}