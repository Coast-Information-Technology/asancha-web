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
 * Builds the public FAQs page graph with visible FAQ content and breadcrumbs.
 */
export function createFaqsPageJsonLd(
  items: readonly FaqJsonLdItemInput[],
): JsonLdData {
  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/faqs`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq-page`,
        url: pageUrl,
        name: "Frequently Asked Questions | Asancha",
        headline: "Frequently Asked Questions",
        description:
          "Answers about Asancha property browsing, accounts, onboarding, verification, property submissions, payments, reservations, professional services, API Partner access, privacy, and support.",
        isPartOf: {
          "@id": `${siteUrl}/#website`,
        },
        about: {
          "@id": `${siteUrl}/#organization`,
        },
        breadcrumb: {
          "@id": `${pageUrl}#breadcrumb`,
        },
        inLanguage: "en-GB",
        mainEntity: items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${siteUrl}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "FAQs",
            item: pageUrl,
          },
        ],
      },
    ],
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
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Asancha",
        url: `${siteUrl}/`,
        logo: {
          "@type": "ImageObject",
          "@id": `${siteUrl}/#logo`,
          url: `${siteUrl}/images/brand/asancha-logo.png`,
          contentUrl: `${siteUrl}/images/brand/asancha-logo.png`,
          caption: "Asancha",
        },
        image: {
          "@id": `${siteUrl}/#logo`,
        },
        description:
          "Asancha is a UK-focused AI-powered property intelligence and property sourcing company helping investors and property professionals discover, understand, submit, and manage property opportunities.",
        email: "info@asancha.co.uk",
        telephone: "+44 7404 799254",
        address: {
          "@type": "PostalAddress",
          streetAddress: "28 Bedford Road",
          addressLocality: "Rushden",
          addressRegion: "Northamptonshire",
          postalCode: "NN10 0NB",
          addressCountry: "GB",
        },
        areaServed: {
          "@type": "Country",
          name: "United Kingdom",
        },
        contactPoint: [
          {
            "@type": "ContactPoint",
            "@id": `${siteUrl}/contact#general-contact`,
            contactType: "general enquiries",
            telephone: "+44 7404 799254",
            email: "info@asancha.co.uk",
            availableLanguage: ["English"],
            areaServed: {
              "@type": "Country",
              name: "United Kingdom",
            },
            url: `${siteUrl}/contact`,
          },
          {
            "@type": "ContactPoint",
            "@id": `${siteUrl}/contact#customer-support`,
            contactType: "customer support",
            telephone: "+44 7404 799254",
            email: "info@asancha.co.uk",
            availableLanguage: ["English"],
            areaServed: {
              "@type": "Country",
              name: "United Kingdom",
            },
            url: `${siteUrl}/support`,
          },
        ],
      },
      {
        "@type": "ContactPage",
        "@id": `${siteUrl}/contact#webpage`,
        url: `${siteUrl}/contact`,
        name: "Contact Asancha | Property Sourcing and Platform Enquiries",
        headline: "Let's Talk About Your Property Goals",
        description:
          "Contact Asancha about UK property sourcing, property submissions, investor requirements, professional services, account support, or approved API partnerships.",
        isPartOf: {
          "@id": `${siteUrl}/#website`,
        },
        about: {
          "@id": `${siteUrl}/#organization`,
        },
        mainEntity: {
          "@id": `${siteUrl}/#organization`,
        },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/og/asancha-contact-og.jpg`,
          width: 1200,
          height: 630,
        },
        breadcrumb: {
          "@id": `${siteUrl}/contact#breadcrumb`,
        },
        inLanguage: "en-GB",
        potentialAction: [
          {
            "@type": "CommunicateAction",
            name: "Send an enquiry to Asancha",
            target: {
              "@type": "EntryPoint",
              urlTemplate: `${siteUrl}/contact`,
              actionPlatform: [
                "https://schema.org/DesktopWebPlatform",
                "https://schema.org/MobileWebPlatform",
              ],
            },
          },
          {
            "@type": "RegisterAction",
            name: "Create an Asancha account",
            target: {
              "@type": "EntryPoint",
              urlTemplate: `${siteUrl}/auth/sign-up`,
            },
          },
        ],
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${siteUrl}/contact#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${siteUrl}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Contact",
            item: `${siteUrl}/contact`,
          },
        ],
      },
    ],
  };
}

/**
 * Builds AboutPage JSON-LD for the public about page.
 */
export function createAboutPageJsonLd(): JsonLdData {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Asancha",
        url: `${siteUrl}/`,
        logo: {
          "@type": "ImageObject",
          "@id": `${siteUrl}/#logo`,
          url: `${siteUrl}/images/brand/asancha-logo.png`,
          contentUrl: `${siteUrl}/images/brand/asancha-logo.png`,
          caption: "Asancha",
        },
        image: {
          "@id": `${siteUrl}/#logo`,
        },
        description:
          "Asancha is a UK-focused AI-powered property intelligence and property sourcing company helping investors and property professionals discover, understand, submit, and manage property opportunities.",
        areaServed: {
          "@type": "Country",
          name: "United Kingdom",
        },
        knowsAbout: [
          "Property sourcing",
          "Property intelligence",
          "Property investment opportunities",
          "Property matching",
          "Property opportunity analysis",
          "Property verification",
          "Property technology",
          "UK property market",
        ],
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "customer support",
            availableLanguage: ["English"],
            url: `${siteUrl}/support`,
          },
        ],
      },
      {
        "@type": "AboutPage",
        "@id": `${siteUrl}/about#webpage`,
        url: `${siteUrl}/about`,
        name: "About Asancha | AI Property Intelligence and Property Sourcing",
        headline: "Building a More Intelligent Way to Source Property",
        description:
          "Learn how Asancha combines AI-powered property intelligence, structured property sourcing, verification workflows, and personalised opportunity matching across the UK property market.",
        isPartOf: {
          "@id": `${siteUrl}/#website`,
        },
        about: {
          "@id": `${siteUrl}/#organization`,
        },
        mainEntity: {
          "@id": `${siteUrl}/#property-sourcing-service`,
        },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/og/asancha-about-og.jpg`,
          width: 1200,
          height: 630,
        },
        breadcrumb: {
          "@id": `${siteUrl}/about#breadcrumb`,
        },
        inLanguage: "en-GB",
        potentialAction: [
          {
            "@type": "RegisterAction",
            name: "Create an Asancha account",
            target: {
              "@type": "EntryPoint",
              urlTemplate: `${siteUrl}/auth/sign-up`,
            },
          },
          {
            "@type": "ViewAction",
            name: "Explore property opportunities",
            target: {
              "@type": "EntryPoint",
              urlTemplate: `${siteUrl}/marketplace`,
            },
          },
        ],
      },
      {
        "@type": "Service",
        "@id": `${siteUrl}/#property-sourcing-service`,
        name: "AI-Powered Property Intelligence and Property Sourcing",
        description:
          "Structured UK property sourcing supported by property intelligence, personalised opportunity matching, verification workflows, and AI-assisted insights.",
        provider: {
          "@id": `${siteUrl}/#organization`,
        },
        areaServed: {
          "@type": "Country",
          name: "United Kingdom",
        },
        serviceType: [
          "Property sourcing",
          "Property intelligence",
          "Property opportunity matching",
          "Property opportunity analysis",
          "Property submission and review",
        ],
        audience: [
          {
            "@type": "Audience",
            audienceType: "Property investors",
          },
          {
            "@type": "Audience",
            audienceType: "Property owners",
          },
          {
            "@type": "Audience",
            audienceType: "Property agents",
          },
          {
            "@type": "Audience",
            audienceType: "Property sourcers",
          },
          {
            "@type": "Audience",
            audienceType: "Property service providers",
          },
          {
            "@type": "Audience",
            audienceType: "Property technology API partners",
          },
        ],
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${siteUrl}/about#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${siteUrl}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "About",
            item: `${siteUrl}/about`,
          },
        ],
      },
    ],
  };
}

/**
 * Builds HowTo-oriented JSON-LD for the public how-it-works page.
 */
export function createHowItWorksPageJsonLd(): JsonLdData {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${siteUrl}/how-it-works#webpage`,
        url: `${siteUrl}/how-it-works`,
        name: "How Asancha Works | Property Sourcing and AI Intelligence",
        headline:
          "A Clearer Way to Discover and Progress Property Opportunities",
        description:
          "Learn how Asancha helps users create profiles, define property goals, discover opportunities, complete verification, access AI-powered insights, and progress through structured property workflows.",
        isPartOf: {
          "@id": `${siteUrl}/#website`,
        },
        about: {
          "@id": `${siteUrl}/#organization`,
        },
        mainEntity: {
          "@id": `${siteUrl}/how-it-works#process`,
        },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/og/asancha-how-it-works-og.jpg`,
          width: 1200,
          height: 630,
        },
        breadcrumb: {
          "@id": `${siteUrl}/how-it-works#breadcrumb`,
        },
        inLanguage: "en-GB",
        potentialAction: [
          {
            "@type": "RegisterAction",
            name: "Create an Asancha account",
            target: {
              "@type": "EntryPoint",
              urlTemplate: `${siteUrl}/auth/sign-up`,
            },
          },
          {
            "@type": "ViewAction",
            name: "Explore property opportunities",
            target: {
              "@type": "EntryPoint",
              urlTemplate: `${siteUrl}/marketplace`,
            },
          },
        ],
      },
      {
        "@type": "HowTo",
        "@id": `${siteUrl}/how-it-works#process`,
        name: "How to Get Started With Asancha",
        description:
          "Create an account, complete your profile, define your property requirements, discover opportunities, complete required verification, and access eligible property actions.",
        supply: [
          {
            "@type": "HowToSupply",
            name: "A valid email address",
          },
          {
            "@type": "HowToSupply",
            name: "Role-specific profile information",
          },
          {
            "@type": "HowToSupply",
            name: "Required supporting documents where applicable",
          },
        ],
        step: [
          {
            "@type": "HowToStep",
            position: 1,
            name: "Choose your property role",
            text: "Choose whether you are joining as an investor, property owner, property agent, property sourcer, or service provider.",
            url: `${siteUrl}/auth/sign-up`,
          },
          {
            "@type": "HowToStep",
            position: 2,
            name: "Create your account",
            text: "Enter your account details and accept the required account-level policies.",
            url: `${siteUrl}/auth/sign-up`,
          },
          {
            "@type": "HowToStep",
            position: 3,
            name: "Verify your email",
            text: "Confirm control of the email address used to create your account.",
            url: `${siteUrl}/verify-email`,
          },
          {
            "@type": "HowToStep",
            position: 4,
            name: "Complete your profile",
            text: "Complete your general profile and the onboarding requirements for your selected property role.",
            url: `${siteUrl}/onboarding`,
          },
          {
            "@type": "HowToStep",
            position: 5,
            name: "Discover relevant opportunities",
            text: "Browse available properties and receive opportunities relevant to your profile and preferences.",
            url: `${siteUrl}/marketplace`,
          },
          {
            "@type": "HowToStep",
            position: 6,
            name: "Take the next approved action",
            text: "Save properties, access eligible deal information, book meetings, communicate, make required payments, or begin an approved reservation.",
            url: `${siteUrl}/dashboard`,
          },
        ],
      },
      {
        "@type": "Service",
        "@id": `${siteUrl}/#property-sourcing-service`,
        name: "AI-Powered Property Intelligence and Property Sourcing",
        description:
          "Structured UK property sourcing supported by property intelligence, personalised opportunity matching, verification workflows, and AI-assisted insights.",
        provider: {
          "@id": `${siteUrl}/#organization`,
        },
        areaServed: {
          "@type": "Country",
          name: "United Kingdom",
        },
        serviceType: [
          "Property sourcing",
          "Property intelligence",
          "Property opportunity matching",
          "Property opportunity analysis",
          "Property submission and review",
        ],
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${siteUrl}/how-it-works#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${siteUrl}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "How It Works",
            item: `${siteUrl}/how-it-works`,
          },
        ],
      },
    ],
  };
}

function createSolutionPageJsonLd(input: {
  path: string;
  name: string;
  headline: string;
  description: string;
  imagePath: string;
  audienceType: string;
  serviceName: string;
  serviceDescription: string;
  serviceType: readonly string[];
  primaryActionName: string;
  primaryActionPath: string;
  secondaryActionName: string;
  secondaryActionPath: string;
  breadcrumbName: string;
}): JsonLdData {
  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}${input.path}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: input.name,
        headline: input.headline,
        description: input.description,
        isPartOf: {
          "@id": `${siteUrl}/#website`,
        },
        about: {
          "@id": `${siteUrl}/#organization`,
        },
        mainEntity: {
          "@id": `${pageUrl}#service`,
        },
        audience: {
          "@id": `${pageUrl}#audience`,
        },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: `${siteUrl}${input.imagePath}`,
          width: 1200,
          height: 630,
        },
        breadcrumb: {
          "@id": `${pageUrl}#breadcrumb`,
        },
        inLanguage: "en-GB",
        potentialAction: [
          {
            "@type": "RegisterAction",
            name: input.primaryActionName,
            target: {
              "@type": "EntryPoint",
              urlTemplate: `${siteUrl}${input.primaryActionPath}`,
            },
          },
          {
            "@type": "ViewAction",
            name: input.secondaryActionName,
            target: {
              "@type": "EntryPoint",
              urlTemplate: `${siteUrl}${input.secondaryActionPath}`,
            },
          },
        ],
      },
      {
        "@type": "Service",
        "@id": `${pageUrl}#service`,
        name: input.serviceName,
        description: input.serviceDescription,
        provider: {
          "@id": `${siteUrl}/#organization`,
        },
        areaServed: {
          "@type": "Country",
          name: "United Kingdom",
        },
        serviceType: input.serviceType,
        audience: {
          "@id": `${pageUrl}#audience`,
        },
        offers: {
          "@type": "Offer",
          url: `${siteUrl}${input.primaryActionPath}`,
          availability: "https://schema.org/OnlineOnly",
          description: input.description,
        },
      },
      {
        "@type": "Audience",
        "@id": `${pageUrl}#audience`,
        audienceType: input.audienceType,
        geographicArea: {
          "@type": "Country",
          name: "United Kingdom",
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${siteUrl}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: input.breadcrumbName,
            item: pageUrl,
          },
        ],
      },
    ],
  };
}

export function createInvestorSolutionsPageJsonLd(): JsonLdData {
  return createSolutionPageJsonLd({
    path: "/solutions/investors",
    name: "Property Investment Solutions | AI Property Sourcing | Asancha",
    headline: "Find Property Opportunities That Match Your Investment Goals",
    description:
      "Create an Asancha investor profile to discover UK property opportunities, receive AI-powered recommendations, compare properties, complete verification, and access eligible deal information.",
    imagePath: "/images/og/asancha-investors-og.jpg",
    audienceType: "Property investors seeking UK property opportunities",
    serviceName: "Property Investment Sourcing and Intelligence",
    serviceDescription:
      "A structured property sourcing and intelligence service that helps investors define their criteria, discover relevant UK property opportunities, receive AI-powered recommendations, and progress through verified property workflows.",
    serviceType: [
      "Property sourcing for investors",
      "Property opportunity matching",
      "AI-powered property intelligence",
      "Property comparison",
      "Investor profile management",
      "Property reservation support",
    ],
    primaryActionName: "Create an investor account",
    primaryActionPath: "/auth/sign-up",
    secondaryActionName: "Explore property opportunities",
    secondaryActionPath: "/marketplace",
    breadcrumbName: "For Investors",
  });
}

export function createPropertyOwnerSolutionsPageJsonLd(): JsonLdData {
  return createSolutionPageJsonLd({
    path: "/solutions/property-owners",
    name: "Property Owner Solutions | Submit and Manage Property | Asancha",
    headline: "Present Your Property Through a More Structured Process",
    description:
      "Create an Asancha property-owner account to submit property, provide ownership documents, track review, manage listings, and present approved opportunities to relevant UK buyers.",
    imagePath: "/images/og/asancha-property-owners-og.jpg",
    audienceType:
      "UK property owners seeking to submit, present, and manage property opportunities",
    serviceName: "Property Submission and Listing Management",
    serviceDescription:
      "A structured service for UK property owners to submit property information, provide ownership evidence, track review, manage publication, and present approved opportunities to relevant buyers.",
    serviceType: [
      "Property submission",
      "Property listing management",
      "Ownership and authority review",
      "Property opportunity presentation",
      "Investor opportunity matching",
      "Property enquiry and reservation support",
    ],
    primaryActionName: "Create a property owner account",
    primaryActionPath: "/auth/sign-up",
    secondaryActionName: "Submit a property",
    secondaryActionPath: "/dashboard/properties/new",
    breadcrumbName: "For Property Owners",
  });
}

export function createPropertyAgentSolutionsPageJsonLd(): JsonLdData {
  return createSolutionPageJsonLd({
    path: "/solutions/property-agents",
    name: "Property Agent Solutions | Manage Client Properties | Asancha",
    headline: "Manage Property Opportunities With Greater Structure",
    description:
      "Create an Asancha property-agent account to manage client authority, submit UK properties, track listing reviews, coordinate enquiries, and present approved opportunities to relevant investors.",
    imagePath: "/images/og/asancha-property-agents-og.jpg",
    audienceType:
      "UK property agents representing owners, landlords, vendors, or developers",
    serviceName: "Property Agent Listing and Client Property Management",
    serviceDescription:
      "A structured service for UK property agents to manage client authority, submit and organise properties, track listing review, coordinate enquiries, and present approved opportunities to relevant investors.",
    serviceType: [
      "Property-agent profile management",
      "Client authority management",
      "Property submission",
      "Property listing management",
      "Property opportunity matching",
      "Property enquiry coordination",
      "Property booking and reservation support",
    ],
    primaryActionName: "Create a property agent account",
    primaryActionPath: "/auth/sign-up",
    secondaryActionName: "Submit a client property",
    secondaryActionPath: "/dashboard/properties/new",
    breadcrumbName: "For Property Agents",
  });
}

export function createPropertySourcerSolutionsPageJsonLd(): JsonLdData {
  return createSolutionPageJsonLd({
    path: "/solutions/property-sourcers",
    name: "Property Sourcer Solutions | Present Investment Deals | Asancha",
    headline:
      "Present Investment-Focused Property Opportunities With Greater Structure",
    description:
      "Create an Asancha property-sourcer account to submit UK investment opportunities, disclose sourcing fees, provide supporting deal information, and connect approved deals with relevant investors.",
    imagePath: "/images/og/asancha-property-sourcers-og.jpg",
    audienceType:
      "UK property sourcers presenting investment-focused property opportunities",
    serviceName:
      "Property Sourcing Opportunity Submission and Investor Matching",
    serviceDescription:
      "A structured service for UK property sourcers to submit investment-focused opportunities, disclose sourcing information, provide supporting evidence, and connect approved deals with relevant investors.",
    serviceType: [
      "Property-sourcer profile management",
      "Investment-property opportunity submission",
      "Property deal presentation",
      "Sourcing-fee disclosure",
      "Property opportunity review",
      "Investor-opportunity matching",
      "Property booking and reservation support",
    ],
    primaryActionName: "Create a property sourcer account",
    primaryActionPath: "/auth/sign-up",
    secondaryActionName: "Submit a property opportunity",
    secondaryActionPath: "/dashboard/properties/new",
    breadcrumbName: "For Property Sourcers",
  });
}

export function createServiceProviderSolutionsPageJsonLd(): JsonLdData {
  return createSolutionPageJsonLd({
    path: "/solutions/service-providers",
    name: "Property Service Provider Solutions | Join Asancha",
    headline: "Connect Your Property Services With Relevant Opportunities",
    description:
      "Create an Asancha service-provider profile to present approved property services, provide qualifications, receive relevant enquiries, manage bookings, and support UK property opportunities.",
    imagePath: "/images/og/asancha-service-providers-og.jpg",
    audienceType:
      "Property professionals and service businesses supporting UK property users and opportunities",
    serviceName: "Property Service Provider Profile and Enquiry Platform",
    serviceDescription:
      "A structured platform service for property professionals and service businesses to present approved services, provide qualifications, receive relevant enquiries, manage bookings, and support UK property opportunities.",
    serviceType: [
      "Property service provider profile management",
      "Professional document and qualification review",
      "Property service enquiry management",
      "Property service booking coordination",
      "Property-linked professional communication",
      "Service quote and payment workflow support",
    ],
    primaryActionName: "Create a service provider account",
    primaryActionPath: "/auth/sign-up",
    secondaryActionName: "List property services",
    secondaryActionPath: "/dashboard/services",
    breadcrumbName: "For Service Providers",
  });
}

export function createApiPartnersPageJsonLd(): JsonLdData {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${siteUrl}/api-partners#webpage`,
        url: `${siteUrl}/api-partners`,
        name: "Property Intelligence API Partnerships | Asancha",
        headline: "Bring Property Intelligence Into Your App",
        description:
          "Apply to become an Asancha API Partner and connect approved Apps to selected UK property sourcing, property intelligence, usage, and webhook capabilities.",
        isPartOf: {
          "@id": `${siteUrl}/#website`,
        },
        about: {
          "@id": `${siteUrl}/#organization`,
        },
        mainEntity: {
          "@id": `${siteUrl}/api-partners#api`,
        },
        audience: {
          "@id": `${siteUrl}/api-partners#audience`,
        },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/og/asancha-api-partners-og.jpg`,
          width: 1200,
          height: 630,
        },
        breadcrumb: {
          "@id": `${siteUrl}/api-partners#breadcrumb`,
        },
        inLanguage: "en-GB",
        potentialAction: [
          {
            "@type": "ApplyAction",
            name: "Apply for Asancha API access",
            target: {
              "@type": "EntryPoint",
              urlTemplate: `${siteUrl}/api-partner/apply`,
            },
          },
          {
            "@type": "ViewAction",
            name: "Check API Partner application status",
            target: {
              "@type": "EntryPoint",
              urlTemplate: `${siteUrl}/api-partner/application-status`,
            },
          },
        ],
      },
      {
        "@type": "WebAPI",
        "@id": `${siteUrl}/api-partners#api`,
        name: "Asancha Property Intelligence API",
        description:
          "Controlled API access for approved organisations connecting registered Apps to selected Asancha property sourcing, property information, property intelligence, usage, and webhook capabilities.",
        provider: {
          "@id": `${siteUrl}/#organization`,
        },
        documentation: `${siteUrl}/api-partners`,
        termsOfService: `${siteUrl}/legal/platform-rules`,
        serviceType: [
          "Property sourcing API",
          "Property information API",
          "Property intelligence API",
          "Property opportunity matching API",
          "Property webhook services",
        ],
        areaServed: {
          "@type": "Country",
          name: "United Kingdom",
        },
        audience: {
          "@id": `${siteUrl}/api-partners#audience`,
        },
        offers: {
          "@type": "Offer",
          url: `${siteUrl}/api-partner/apply`,
          availability: "https://schema.org/OnlineOnly",
          description:
            "API access is available to approved organisations and registered Apps, subject to application review, approved scopes, subscription status, security requirements, rate limits, and acceptable-use terms.",
        },
      },
      {
        "@type": "Service",
        "@id": `${siteUrl}/api-partners#partner-service`,
        name: "Asancha API Partner Programme",
        description:
          "A managed programme for organisations applying to connect approved Apps to selected Asancha property sourcing and property intelligence capabilities.",
        provider: {
          "@id": `${siteUrl}/#organization`,
        },
        areaServed: {
          "@type": "Country",
          name: "United Kingdom",
        },
        serviceType: [
          "API Partner application review",
          "API App management",
          "Scoped API key access",
          "App usage monitoring",
          "Webhook management",
          "API subscription and billing",
          "Integration support",
        ],
        audience: {
          "@id": `${siteUrl}/api-partners#audience`,
        },
      },
      {
        "@type": "Audience",
        "@id": `${siteUrl}/api-partners#audience`,
        audienceType:
          "Property technology companies, property platforms, data businesses, and enterprise teams seeking approved property API integrations",
        geographicArea: {
          "@type": "Country",
          name: "United Kingdom",
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${siteUrl}/api-partners#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${siteUrl}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "API Partners",
            item: `${siteUrl}/api-partners`,
          },
        ],
      },
    ],
  };
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
export function createHomePageJsonLdBundle(): JsonLdData {
  const siteUrl = getSiteUrl();
  const homepageUrl = `${siteUrl}/`;
  const logoUrl = `${siteUrl}/images/brand/asancha-logo.png`;
  const imageUrl = `${siteUrl}/images/og/asancha-homepage-og.jpg`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${homepageUrl}#organization`,
        name: "Asancha",
        url: homepageUrl,
        logo: {
          "@type": "ImageObject",
          "@id": `${homepageUrl}#logo`,
          url: logoUrl,
          contentUrl: logoUrl,
          caption: "Asancha",
        },
        image: {
          "@id": `${homepageUrl}#logo`,
        },
        description:
          "Asancha is a UK-focused AI-powered property intelligence and property sourcing company helping investors and property professionals discover, understand, submit, and manage property opportunities.",
        areaServed: {
          "@type": "Country",
          name: "United Kingdom",
        },
        knowsAbout: [
          "Property sourcing",
          "Property intelligence",
          "Property investment opportunities",
          "Property matching",
          "Property analysis",
          "Property verification",
          "Property technology",
          "UK property market",
        ],
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "customer support",
            availableLanguage: ["English"],
            url: `${siteUrl}/support`,
          },
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${homepageUrl}#website`,
        url: homepageUrl,
        name: "Asancha",
        description:
          "AI-powered property intelligence and property sourcing across the United Kingdom.",
        publisher: {
          "@id": `${homepageUrl}#organization`,
        },
        inLanguage: "en-GB",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${siteUrl}/marketplace?search={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "WebPage",
        "@id": `${homepageUrl}#webpage`,
        url: homepageUrl,
        name: "Asancha | AI-Powered Property Intelligence and Property Sourcing",
        headline: "Find Better Property Opportunities With Greater Intelligence",
        description:
          "Create an Asancha account to discover UK property opportunities supported by structured property sourcing, personalised matching, verification workflows, and AI-powered property intelligence.",
        isPartOf: {
          "@id": `${homepageUrl}#website`,
        },
        about: {
          "@id": `${homepageUrl}#organization`,
        },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: imageUrl,
          width: 1200,
          height: 630,
        },
        breadcrumb: {
          "@id": `${homepageUrl}#breadcrumb`,
        },
        mainEntity: {
          "@id": `${homepageUrl}#property-sourcing-service`,
        },
        inLanguage: "en-GB",
        potentialAction: [
          {
            "@type": "RegisterAction",
            name: "Create an Asancha account",
            target: {
              "@type": "EntryPoint",
              urlTemplate: `${siteUrl}/auth/sign-up`,
            },
          },
          {
            "@type": "ViewAction",
            name: "Explore property opportunities",
            target: {
              "@type": "EntryPoint",
              urlTemplate: `${siteUrl}/marketplace`,
            },
          },
        ],
      },
      {
        "@type": "Service",
        "@id": `${homepageUrl}#property-sourcing-service`,
        name: "AI-Powered Property Intelligence and Property Sourcing",
        description:
          "Structured UK property sourcing supported by property intelligence, personalised opportunity matching, verification workflows, and AI-assisted insights.",
        provider: {
          "@id": `${homepageUrl}#organization`,
        },
        areaServed: {
          "@type": "Country",
          name: "United Kingdom",
        },
        serviceType: [
          "Property sourcing",
          "Property intelligence",
          "Property opportunity matching",
          "Property opportunity analysis",
          "Property submission and review",
        ],
        audience: [
          {
            "@type": "Audience",
            audienceType: "Property investors",
          },
          {
            "@type": "Audience",
            audienceType: "Property owners",
          },
          {
            "@type": "Audience",
            audienceType: "Property agents",
          },
          {
            "@type": "Audience",
            audienceType: "Property sourcers",
          },
          {
            "@type": "Audience",
            audienceType: "Property service providers",
          },
          {
            "@type": "Audience",
            audienceType: "Property technology API partners",
          },
        ],
        offers: {
          "@type": "Offer",
          url: `${siteUrl}/auth/sign-up`,
          availability: "https://schema.org/OnlineOnly",
          description:
            "Create an account to access role-specific property sourcing, property intelligence, and platform features.",
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${homepageUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: homepageUrl,
          },
        ],
      },
    ],
  };
}
