// File: app/dashboard/property-agent/company/contacts/page.tsx

import type { Metadata } from "next";

import { PropertyAgentCompanyContactsPage } from "../../../_components/property-agent-company-contacts-page";

export const metadata: Metadata = {
    title: "Company Contacts",
};

export default function AgentCompanyContactsPage() {
    return (
        <PropertyAgentCompanyContactsPage />
    );
}