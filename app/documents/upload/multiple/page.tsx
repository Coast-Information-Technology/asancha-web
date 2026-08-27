// File: app/documents/upload/multiple/page.tsx

import type { Metadata } from "next";

import { PropertyDocumentUploadPageClient } from "../../_components/property-document-upload-page-client";

export const metadata: Metadata = {
    title: "Upload Multiple Documents | Asancha",
    description:
        "Upload multiple protected property documents to Asancha.",
};

export default function MultipleDocumentUploadPage() {
    return (
        <PropertyDocumentUploadPageClient mode="multiple" />
    );
}
