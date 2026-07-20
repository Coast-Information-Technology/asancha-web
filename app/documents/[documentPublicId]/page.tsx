// File: app/documents/[documentPublicId]/page.tsx

/**
 * Asancha Document Detail Route
 *
 * Purpose:
 * Displays one authorised document using its public identifier.
 *
 * Security notes:
 * - MongoDB ObjectIds must never appear in this route.
 * - Backend ownership and document-view policy remain authoritative.
 * - Unauthorised access must not reveal document details.
 */

import type {
    Metadata,
} from "next";

import { DocumentDetailPageClient } from "../_components/document-detail-page-client";

export const metadata: Metadata = {
    title: "Document Details | Asancha",
};

export interface DocumentDetailRouteProps {
    params: Promise<{
        documentPublicId: string;
    }>;
}

export default async function DocumentDetailPage({
    params,
}: DocumentDetailRouteProps) {
    const { documentPublicId } =
        await params;

    return (
        <DocumentDetailPageClient
            documentPublicId={
                documentPublicId
            }
        />
    );
}