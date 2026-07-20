// File: app/documents/upload/page.tsx

/**
 * Asancha Document Upload Route
 *
 * Purpose:
 * Uploads an authenticated user document for an approved related business
 * record.
 *
 * Security notes:
 * - Client validation is not authoritative.
 * - Backend file, ownership, relationship, and visibility checks remain final.
 */

import type {
    Metadata,
} from "next";

import { DocumentUploadPageClient } from "../_components/document-upload-page-client";

export const metadata: Metadata = {
    title: "Upload Document | Asancha",

    description:
        "Upload a protected document for your Asancha profile or related record.",
};

export default function DocumentUploadPage() {
    return <DocumentUploadPageClient />;
}