// File: src/components/seo/json-ld.tsx

/**
 * Asancha JSON-LD Component
 *
 * Purpose:
 * Provides a safe reusable JSON-LD script component for Asancha Web Public.
 *
 * Main responsibilities:
 * - Render structured data for public SEO pages
 * - Escape unsafe characters before injecting JSON into a script tag
 * - Keep JSON-LD usage consistent across public pages
 *
 * Important Asancha Web Public rule:
 * JSON-LD must describe visible public page content only.
 * Do not include private listing data, private user data, internal review notes,
 * payment data, verification data, API keys, webhook secrets, ObjectIds,
 * backend URLs, admin/staff URLs, or non-public platform details.
 *
 * SEO note:
 * JSON-LD should be used where it adds real search value, such as
 * Organization, WebSite, WebPage, BreadcrumbList, CollectionPage, ContactPage,
 * FAQPage, and safe public listing previews.
 *
 * Security note:
 * This component escapes characters that can prematurely close script tags.
 */

import type { JsonLdData } from "@/src/lib/seo/json-ld";

interface JsonLdProps {
  data: JsonLdData | readonly JsonLdData[];
  id?: string;
}

/**
 * Escapes JSON-LD content before rendering it inside a script tag.
 */
function stringifyJsonLd(data: JsonLdProps["data"]): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

/**
 * Renders JSON-LD structured data for public Asancha pages.
 */
export function JsonLd({ data, id }: JsonLdProps) {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: stringifyJsonLd(data),
      }}
      id={id}
      type="application/ld+json"
    />
  );
}
