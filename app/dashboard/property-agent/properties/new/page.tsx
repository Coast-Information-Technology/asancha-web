// File: app/dashboard/property-agent/properties/new/page.tsx

import type { Metadata } from "next";

import { PropertyAgentPropertyForm } from "../../../_components/property-agent-property-form";

export const metadata: Metadata = {
    title: "Add Represented Property",
};

export default function NewAgentPropertyPage() {
    return <PropertyAgentPropertyForm />;
}