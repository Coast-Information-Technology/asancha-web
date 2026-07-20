// File: app/documents/page.tsx

/**
 * Asancha Documents Route
 *
 * Purpose:
 * Displays required, submitted, approved, on-hold, rejected, and
 * replacement-required documents for the authenticated active profile.
 *
 * Security notes:
 * - Document access remains backend-authorised.
 * - Sensitive document metadata and storage locations must not be exposed.
 */

import type {
    Metadata,
} from "next";

import { DocumentsPageClient } from "./_components/documents-page-client";

export const metadata: Metadata = {
    title: "Documents | Asancha",

    description:
        "Review your required and submitted Asancha verification documents.",
};

export default function DocumentsPage() {
    return <DocumentsPageClient />;
}