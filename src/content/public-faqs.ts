// File: src/content/public-faqs.ts

export type PublicFaqCategory =
  | "getting-started"
  | "marketplace"
  | "accounts-and-roles"
  | "onboarding-and-profiles"
  | "verification-and-documents"
  | "property-submissions"
  | "investor-access"
  | "bookings-and-reservations"
  | "payments-and-pricing"
  | "property-professionals"
  | "api-partners"
  | "privacy-and-security"
  | "support-and-complaints";

export interface PublicFaqCategoryMeta {
  id: PublicFaqCategory;
  label: string;
}

export interface PublicFaqItem {
  id: string;
  category: PublicFaqCategory;
  question: string;
  answer: string;
  isPublic: boolean;
  sortOrder: number;
}

export const publicFaqCategories: readonly PublicFaqCategoryMeta[] = [
  { id: "getting-started", label: "Getting Started" },
  { id: "marketplace", label: "Marketplace" },
  { id: "accounts-and-roles", label: "Accounts and Roles" },
  { id: "onboarding-and-profiles", label: "Onboarding and Profiles" },
  { id: "verification-and-documents", label: "Verification and Documents" },
  { id: "property-submissions", label: "Property Submissions" },
  { id: "investor-access", label: "Investors and Property Access" },
  { id: "bookings-and-reservations", label: "Bookings and Reservations" },
  { id: "payments-and-pricing", label: "Payments and Pricing" },
  { id: "property-professionals", label: "Property Professionals" },
  { id: "api-partners", label: "API Partners" },
  { id: "privacy-and-security", label: "Privacy and Security" },
  { id: "support-and-complaints", label: "Support and Complaints" },
] as const;

export const publicFaqs: readonly PublicFaqItem[] = [
  {
    id: "what-is-asancha",
    category: "getting-started",
    question: "What is Asancha?",
    answer:
      "Asancha is a UK-focused property sourcing and property intelligence platform. It helps investors, property owners, property agents, property sourcers, service providers, and approved API Partners manage relevant property workflows through structured information, controlled access, and digital tools.",
    isPublic: true,
    sortOrder: 10,
  },
  {
    id: "is-asancha-an-ordinary-listing-website",
    category: "getting-started",
    question: "Is Asancha an ordinary property-listing website?",
    answer:
      "No. Asancha includes public property discovery, but it is designed as a broader property sourcing and intelligence platform with role-specific profiles, property submissions, verification, matching, AI-supported recommendations, documents, enquiries, bookings, payments, reservations, professional services, and API integrations where supported.",
    isPublic: true,
    sortOrder: 20,
  },
  {
    id: "can-i-use-asancha-without-an-account",
    category: "getting-started",
    question: "Can I use Asancha without creating an account?",
    answer:
      "Yes. Guests can browse public pages and approved safe property previews. An account may be required to save, compare, enquire, book, submit property, access restricted information, complete a reservation, or use role-specific tools.",
    isPublic: true,
    sortOrder: 30,
  },
  {
    id: "how-do-i-get-started",
    category: "getting-started",
    question: "How do I get started?",
    answer:
      "You can explore the public Marketplace, create an account, choose the relevant role, verify your email, complete your general profile, complete role-specific onboarding, and use the dashboard features available to your current status.",
    isPublic: true,
    sortOrder: 40,
  },
  {
    id: "can-guests-browse-marketplace",
    category: "marketplace",
    question: "Can guests browse the Marketplace?",
    answer:
      "Yes. Guests can browse approved safe property previews without creating an account.",
    isPublic: true,
    sortOrder: 50,
  },
  {
    id: "what-information-can-guests-see",
    category: "marketplace",
    question: "What information can guests see?",
    answer:
      "Public property information may include property title, general location, public images, property type, approved asking price, bedrooms, bathrooms, tenure where approved, occupancy where safe, property condition, opportunity type, selected investment indicators, and availability status.",
    isPublic: true,
    sortOrder: 60,
  },
  {
    id: "will-full-address-show-publicly",
    category: "marketplace",
    question: "Will the full property address be shown publicly?",
    answer:
      "Not necessarily. Where the address is restricted, the Marketplace should show only a safe general location, such as the town, city, area, or postcode district.",
    isPublic: true,
    sortOrder: 70,
  },
  {
    id: "are-properties-guaranteed-available",
    category: "marketplace",
    question: "Are Marketplace properties guaranteed to remain available?",
    answer:
      "No. Availability can change at any time. The current property record remains the authoritative source of status.",
    isPublic: true,
    sortOrder: 80,
  },
  {
    id: "which-roles-can-register",
    category: "accounts-and-roles",
    question: "Which roles can register on Asancha?",
    answer:
      "Public account roles may include investor, property owner, property agent, property sourcer, service provider, and API Partner. Guests do not create authenticated guest accounts.",
    isPublic: true,
    sortOrder: 90,
  },
  {
    id: "can-one-account-have-more-than-one-profile",
    category: "accounts-and-roles",
    question: "Can one account have more than one profile?",
    answer:
      "Where supported, yes. The same person may use more than one supported profile, and each profile may have separate onboarding, documents, verification, and permissions.",
    isPublic: true,
    sortOrder: 100,
  },
  {
    id: "what-is-active-profile",
    category: "accounts-and-roles",
    question: "What is an active profile?",
    answer:
      "The active profile determines which role-specific dashboard, actions, and permissions are currently in use. Switching profiles does not remove the requirements attached to each profile.",
    isPublic: true,
    sortOrder: 110,
  },
  {
    id: "can-staff-register-publicly",
    category: "accounts-and-roles",
    question: "Can staff accounts be created through public registration?",
    answer:
      "No. Customer-care, admin, and super-admin accounts should follow controlled staff-management processes.",
    isPublic: true,
    sortOrder: 120,
  },
  {
    id: "why-complete-onboarding",
    category: "onboarding-and-profiles",
    question: "Why do I need to complete onboarding?",
    answer:
      "Onboarding helps Asancha understand who you are, your role, your goals, your property activity, which features may be relevant, and which checks or documents may be required.",
    isPublic: true,
    sortOrder: 130,
  },
  {
    id: "does-dashboard-access-mean-onboarding-complete",
    category: "onboarding-and-profiles",
    question: "Does dashboard access mean onboarding is complete?",
    answer:
      "No. Users may receive dashboard access while onboarding, verification, or document review is still pending. Sensitive actions remain restricted until the relevant requirements are complete.",
    isPublic: true,
    sortOrder: 140,
  },
  {
    id: "can-i-edit-profile-later",
    category: "onboarding-and-profiles",
    question: "Can I edit my profile later?",
    answer:
      "Yes, where permitted. Some changes may trigger another review, especially where they affect identity, company, professional, payment, or verification information.",
    isPublic: true,
    sortOrder: 150,
  },
  {
    id: "why-request-verification",
    category: "verification-and-documents",
    question: "Why does Asancha request verification?",
    answer:
      "Verification helps protect users, properties, payments, and sensitive information. It may help confirm identity, address, company registration, authority to represent, ownership, proof of funds, qualifications, insurance, and compliance information.",
    isPublic: true,
    sortOrder: 160,
  },
  {
    id: "does-uploading-document-mean-approved",
    category: "verification-and-documents",
    question: "Does uploading a document mean it has been approved?",
    answer:
      "No. An uploaded document may still be pending, under review, approved, rejected, on hold, expired, or replacement required.",
    isPublic: true,
    sortOrder: 170,
  },
  {
    id: "will-documents-be-public",
    category: "verification-and-documents",
    question: "Will my documents be visible publicly?",
    answer:
      "No. Sensitive identity, ownership, financial, professional, compliance, and property documents should remain restricted.",
    isPublic: true,
    sortOrder: 180,
  },
  {
    id: "who-can-submit-property",
    category: "property-submissions",
    question: "Who can submit a property?",
    answer:
      "Depending on the circumstances, a property may be submitted by a property owner, an authorised property agent, an authorised property sourcer, or another approved representative.",
    isPublic: true,
    sortOrder: 190,
  },
  {
    id: "can-i-submit-property-i-do-not-own",
    category: "property-submissions",
    question: "Can I submit a property I do not own?",
    answer:
      "Only where you have lawful authority to represent the owner or present the opportunity. Evidence of authority may be required.",
    isPublic: true,
    sortOrder: 200,
  },
  {
    id: "does-submitting-property-mean-published",
    category: "property-submissions",
    question: "Does submitting a property mean it will be published?",
    answer:
      "No. A property may require complete information, supporting documents, ownership or authority review, corrections, policy acceptance, payment, or administrative approval before publication.",
    isPublic: true,
    sortOrder: 210,
  },
  {
    id: "will-private-owner-info-appear",
    category: "property-submissions",
    question: "Will private owner information appear on the listing?",
    answer:
      "No. Private owner details, authority documents, payment records, tenancy information, and internal review records must not appear publicly.",
    isPublic: true,
    sortOrder: 220,
  },
  {
    id: "how-do-recommendations-work",
    category: "investor-access",
    question: "How do investor recommendations work?",
    answer:
      "Signed-in investors may receive recommendations based on preferred locations, budget, property type, strategy, occupancy preference, refurbishment appetite, yield preference, return preference, funding readiness, and purchase timeline.",
    isPublic: true,
    sortOrder: 230,
  },
  {
    id: "does-ai-mean-suitable",
    category: "investor-access",
    question: "Does an AI recommendation mean a property is suitable for me?",
    answer:
      "No. AI-supported recommendations are decision-support tools. They do not replace independent legal, financial, survey, valuation, tax, planning, or investment advice.",
    isPublic: true,
    sortOrder: 240,
  },
  {
    id: "are-yield-and-return-guaranteed",
    category: "investor-access",
    question: "Are yield and return figures guaranteed?",
    answer:
      "No. Yield and return figures are indicators based on available information and assumptions. They are not guaranteed outcomes.",
    isPublic: true,
    sortOrder: 250,
  },
  {
    id: "can-everyone-access-deal-pack",
    category: "investor-access",
    question: "Can everyone access a deal pack?",
    answer:
      "No. Access may require an account, completed profile, relevant role, verification, proof of funds, payment, and property-specific approval.",
    isPublic: true,
    sortOrder: 260,
  },
  {
    id: "does-enquiry-reserve-property",
    category: "bookings-and-reservations",
    question: "Does submitting an enquiry reserve the property?",
    answer:
      "No. An enquiry does not reserve the property or create a binding offer.",
    isPublic: true,
    sortOrder: 270,
  },
  {
    id: "can-i-request-viewing",
    category: "bookings-and-reservations",
    question: "Can I request a property viewing?",
    answer:
      "Where supported, eligible users may request a viewing. The request is not confirmed until the platform shows a confirmed status.",
    isPublic: true,
    sortOrder: 280,
  },
  {
    id: "what-is-property-reservation",
    category: "bookings-and-reservations",
    question: "What is a property reservation?",
    answer:
      "A reservation is a structured process through which an eligible user may temporarily secure an approved property opportunity subject to the relevant rules.",
    isPublic: true,
    sortOrder: 290,
  },
  {
    id: "does-reservation-guarantee-completion",
    category: "bookings-and-reservations",
    question: "Does a reservation guarantee completion?",
    answer:
      "No. A reservation does not guarantee finance approval, legal approval, survey outcome, exchange, or completion.",
    isPublic: true,
    sortOrder: 300,
  },
  {
    id: "can-i-browse-for-free",
    category: "payments-and-pricing",
    question: "Can I browse properties for free?",
    answer:
      "Yes. Guests can browse approved safe property previews without paying.",
    isPublic: true,
    sortOrder: 310,
  },
  {
    id: "what-fees-may-apply",
    category: "payments-and-pricing",
    question: "What kinds of fees may apply?",
    answer:
      "Possible fees include investor subscriptions, property listing fees, priority listing fees, fast-track review fees, sourcer subscriptions, service provider subscriptions, API subscriptions, deal-pack fees, reservation fees, booking fees, completion or success fees, and professional service fees.",
    isPublic: true,
    sortOrder: 320,
  },
  {
    id: "is-bank-alert-enough",
    category: "payments-and-pricing",
    question: "Is a bank alert enough to confirm payment?",
    answer:
      "No. The Asancha payment record remains the authoritative source of payment status.",
    isPublic: true,
    sortOrder: 330,
  },
  {
    id: "does-payment-approve-property",
    category: "payments-and-pricing",
    question: "Does payment automatically approve a property or service?",
    answer:
      "No. Payment does not automatically approve a property, listing, deal pack, reservation, App, subscription, booking, or production access.",
    isPublic: true,
    sortOrder: 340,
  },
  {
    id: "what-is-property-agent-profile",
    category: "property-professionals",
    question: "What is a Property Agent profile?",
    answer:
      "A Property Agent profile is for individuals or companies authorised to represent property owners, landlords, vendors, or developers.",
    isPublic: true,
    sortOrder: 350,
  },
  {
    id: "what-is-property-sourcer-profile",
    category: "property-professionals",
    question: "What is a Property Sourcer profile?",
    answer:
      "A Property Sourcer profile is for individuals or companies presenting investment-focused property opportunities to relevant investors.",
    isPublic: true,
    sortOrder: 360,
  },
  {
    id: "what-is-service-provider-profile",
    category: "property-professionals",
    question: "What is a Service Provider profile?",
    answer:
      "A Service Provider profile is for approved professionals and businesses offering property-related services such as surveying, valuation, legal support, finance support, refurbishment, property management, architecture, planning, accounting, insurance, photography, and other approved property services.",
    isPublic: true,
    sortOrder: 370,
  },
  {
    id: "does-professional-profile-verify-qualifications",
    category: "property-professionals",
    question: "Does creating a professional profile verify my qualifications?",
    answer:
      "No. Qualifications, registrations, insurance, memberships, and company information may require review.",
    isPublic: true,
    sortOrder: 380,
  },
  {
    id: "what-is-api-partner",
    category: "api-partners",
    question: "What is an API Partner?",
    answer:
      "An API Partner is an approved organisation that connects one or more Apps to selected Asancha property services.",
    isPublic: true,
    sortOrder: 390,
  },
  {
    id: "what-is-api-app",
    category: "api-partners",
    question: "What is an API App?",
    answer:
      "An API App represents the product, platform, website, service, or internal system connecting to Asancha.",
    isPublic: true,
    sortOrder: 400,
  },
  {
    id: "is-api-partner-application-public",
    category: "api-partners",
    question: "Is the API Partner application public?",
    answer:
      "No. You must create an API Partner account, verify your email, sign in, and enter the protected partner dashboard before starting the application.",
    isPublic: true,
    sortOrder: 410,
  },
  {
    id: "can-anyone-create-api-key",
    category: "api-partners",
    question: "Can anyone create an API key?",
    answer:
      "No. API keys become available only after the relevant App and access requirements are approved.",
    isPublic: true,
    sortOrder: 420,
  },
  {
    id: "can-app-access-all-data",
    category: "api-partners",
    question: "Can an App access all Asancha data?",
    answer:
      "No. Each App receives only the approved scopes and data required for its authorised purpose.",
    isPublic: true,
    sortOrder: 430,
  },
  {
    id: "how-protect-sensitive-info",
    category: "privacy-and-security",
    question: "How does Asancha protect sensitive information?",
    answer:
      "Asancha should use role-based access, authentication, permissions, restricted data projections, audit records, secure document handling, and other appropriate controls.",
    isPublic: true,
    sortOrder: 440,
  },
  {
    id: "are-passwords-visible",
    category: "privacy-and-security",
    question: "Are passwords visible to Asancha staff?",
    answer:
      "Passwords should be securely stored and not available as readable text to staff.",
    isPublic: true,
    sortOrder: 450,
  },
  {
    id: "should-i-send-password-or-api-key",
    category: "privacy-and-security",
    question: "Should I send my password or API key to support?",
    answer:
      "No. Do not send passwords, complete API keys, webhook secrets, authentication tokens, or full payment-card information.",
    isPublic: true,
    sortOrder: 460,
  },
  {
    id: "how-contact-support",
    category: "support-and-complaints",
    question: "How do I contact Asancha support?",
    answer:
      "Use the public support route. Registered users may also have access to support from their dashboard.",
    isPublic: true,
    sortOrder: 470,
  },
  {
    id: "what-include-in-support-request",
    category: "support-and-complaints",
    question: "What information should I include in a support request?",
    answer:
      "Include a clear description of the issue, relevant public reference, property or App reference where appropriate, approximate date and time, safe error message, and the action you were trying to complete. Do not include passwords, complete API keys, or unnecessary private data.",
    isPublic: true,
    sortOrder: 480,
  },
  {
    id: "can-support-approve-immediately",
    category: "support-and-complaints",
    question: "Can support approve a property or payment immediately?",
    answer:
      "Support may investigate and assist, but approval should follow the authorised property, verification, payment, and administrative process.",
    isPublic: true,
    sortOrder: 490,
  },
] as const;

export function getVisiblePublicFaqs(): readonly PublicFaqItem[] {
  return publicFaqs
    .filter((faq) => faq.isPublic)
    .toSorted((first, second) => first.sortOrder - second.sortOrder);
}
