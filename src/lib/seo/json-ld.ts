// File: src/lib/seo/json-ld.ts

/**
 * Asancha JSON-LD Builders
 *
 * Purpose:
 * Provides reusable structured-data builders for Asancha Web Public SEO.
 *
 * Main responsibilities:
 * - Build safe public JSON-LD objects
 * - Keep homepage, public page, FAQ, marketplace, contact, legal, and listing
 *   structured data consistent
 * - Prevent accidental exposure of private backend or user data in SEO markup
 *
 * Important Asancha Web Public rule:
 * Structured data must represent visible public page content only.
 * Do not include private deal packs, private documents, restricted listing data,
 * internal notes, staff/admin data, payment provider payloads, API keys,
 * webhook secrets, MongoDB ObjectIds, or private backend URLs.
 *
 * SEO note:
 * Use JSON-LD selectively:
 * - Organization and WebSite on the homepage
 * - WebPage and BreadcrumbList on standard public pages
 * - FAQPage on FAQs only
 * - CollectionPage on marketplace listing index
 * - ContactPage on contact page
 * - Safe public listing preview schema only when data is public-safe
 */

import { appConfig } from "@/src/lib/env/env";

export type JsonLdPrimitive = string | number | boolean | null;

export type JsonLdValue = JsonLdPrimitive | JsonLdData | readonly JsonLdValue[];

export interface JsonLdData {
  readonly [key: string]: JsonLdValue;
}

export interface BreadcrumbItemInput {
  name: string;
  path: string;
}

export interface WebPageJsonLdInput {
  path: string;
  name: string;
  description: string;
  pageType?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage";
}

export interface FaqJsonLdItemInput {
  question: string;
  answer: string;
}

export interface PublicListingPreviewJsonLdInput {
  slug: string;
  name: string;
  description: string;
  location?: string;
  category?: string;
}

const ORGANIZATION_ID = "#organization";
const WEBSITE_ID = "#website";

/**
 * Returns the canonical public app URL with no trailing slash.
 */
export function getSiteUrl(): string {
  return appConfig.appUrl.replace(/\/+$/, "");
}

/**
 * Creates an absolute public URL from an internal path.
 */
export function createAbsoluteUrl(path: string): string {
  const siteUrl = getSiteUrl();

  if (path === "/") {
    return siteUrl;
  }

  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Removes undefined, null, and empty string values from a JSON-LD object.
 */
function compactJsonLdObject<
  TData extends Record<string, JsonLdValue | undefined>,
>(data: TData): JsonLdData {
  return Object.entries(data).reduce<JsonLdData>((result, [key, value]) => {
    if (value === undefined || value === null || value === "") {
      return result;
    }

    return {
      ...result,
      [key]: value,
    };
  }, {});
}

/**
 * Builds Organization JSON-LD for the Asancha public homepage.
 */
export function createOrganizationJsonLd(): JsonLdData {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/${ORGANIZATION_ID}`,
    name: appConfig.name,
    url: siteUrl,
    description:
      "Asancha is a UK-focused property platform for investors, property owners, property agents, property sourcers, service providers, and approved API partners.",
  };
}

/**
 * Builds WebSite JSON-LD for the Asancha public homepage.
 */
export function createWebsiteJsonLd(): JsonLdData {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/${WEBSITE_ID}`,
    name: appConfig.name,
    url: siteUrl,
    publisher: {
      "@id": `${siteUrl}/${ORGANIZATION_ID}`,
    },
    inLanguage: "en-GB",
  };
}

/**
 * Builds WebPage-style JSON-LD for a public Asancha page.
 */
export function createWebPageJsonLd({
  description,
  name,
  pageType = "WebPage",
  path,
}: WebPageJsonLdInput): JsonLdData {
  const absoluteUrl = createAbsoluteUrl(path);
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": pageType,
    "@id": `${absoluteUrl}#webpage`,
    url: absoluteUrl,
    name,
    description,
    isPartOf: {
      "@id": `${siteUrl}/${WEBSITE_ID}`,
    },
    about: {
      "@id": `${siteUrl}/${ORGANIZATION_ID}`,
    },
    inLanguage: "en-GB",
  };
}

/**
 * Builds BreadcrumbList JSON-LD for public Asancha pages.
 */
export function createBreadcrumbJsonLd(
  items: readonly BreadcrumbItemInput[],
): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: createAbsoluteUrl(item.path),
    })),
  };
}

/**
 * Builds FAQPage JSON-LD.
 *
 * Use this only on the FAQ page where the same questions and answers are
 * visible to users.
 */
export function createFaqPageJsonLd(
  items: readonly FaqJsonLdItemInput[],
): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

/**
 * Builds CollectionPage JSON-LD for the public marketplace page.
 */
export function createMarketplaceCollectionJsonLd(): JsonLdData {
  return createWebPageJsonLd({
    pageType: "CollectionPage",
    path: "/marketplace",
    name: "Asancha Marketplace",
    description:
      "Browse safe public property previews on Asancha before continuing into account, verification, reservation, booking, or payment workflows.",
  });
}

/**
 * Builds ContactPage JSON-LD for the public contact page.
 */
export function createContactPageJsonLd(): JsonLdData {
  return createWebPageJsonLd({
    pageType: "ContactPage",
    path: "/contact",
    name: "Contact Asancha",
    description:
      "Contact Asancha for public marketplace, role setup, property workflow, service provider, or API partner enquiries.",
  });
}

/**
 * Builds safe public listing preview JSON-LD.
 *
 * This intentionally avoids price, full address, seller identity, private deal
 * content, payment data, documents, internal notes, and restricted identifiers.
 */
export function createPublicListingPreviewJsonLd({
  category,
  description,
  location,
  name,
  slug,
}: PublicListingPreviewJsonLdInput): JsonLdData {
  return compactJsonLdObject({
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "@id": `${createAbsoluteUrl(`/marketplace/${slug}`)}#listing`,
    url: createAbsoluteUrl(`/marketplace/${slug}`),
    name,
    description,
    category,
    areaServed: location
      ? {
          "@type": "Place",
          name: location,
        }
      : undefined,
    provider: {
      "@id": `${getSiteUrl()}/${ORGANIZATION_ID}`,
    },
  });
}

/**
 * Builds a standard public page JSON-LD bundle.
 */
export function createPublicPageJsonLdBundle(input: {
  path: string;
  name: string;
  description: string;
  breadcrumbs: readonly BreadcrumbItemInput[];
  pageType?: WebPageJsonLdInput["pageType"];
}): readonly JsonLdData[] {
  return [
    createWebPageJsonLd({
      path: input.path,
      name: input.name,
      description: input.description,
      pageType: input.pageType,
    }),
    createBreadcrumbJsonLd(input.breadcrumbs),
  ];
}

/**
 * Builds the homepage JSON-LD bundle.
 */
export function createHomePageJsonLdBundle(): readonly JsonLdData[] {
  return [
    createOrganizationJsonLd(),
    createWebsiteJsonLd(),
    createWebPageJsonLd({
      path: "/",
      name: "Asancha",
      description:
        "Asancha is a UK-focused property platform for investors, property owners, property agents, property sourcers, service providers, and approved API partners.",
    }),
  ];
}
