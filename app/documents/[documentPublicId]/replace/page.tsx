// File: app/documents/[documentPublicId]/replace/page.tsx

/**
 * Asancha Document Replacement Route
 *
 * Purpose:
 * Uploads a replacement for an eligible document while preserving review and
 * version history.
 *
 * Security notes:
 * - MongoDB ObjectIds must never appear in this route.
 * - Replacement eligibility and document ownership remain backend-controlled.
 * - A replacement creates a new document version; it must not silently erase
 *   the previous review record.
 */

import type {
    Metadata,
} from "next";

import { DocumentReplacePageClient } from "../../_components/document-replace-page-client";

export const metadata: Metadata = {
    title: "Replace Document | Asancha",
};

export interface DocumentReplaceRouteProps {
    params: Promise<{
        documentPublicId: string;
    }>;
}

export default async function DocumentReplacePage({
    params,
}: DocumentReplaceRouteProps) {
    const { documentPublicId } =
        await params;

    return (
        <DocumentReplacePageClient
            documentPublicId={
                documentPublicId
            }
        />
    );
}