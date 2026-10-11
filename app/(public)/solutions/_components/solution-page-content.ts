import type { SolutionPageExperienceProps } from "./solution-page-experience";

import { DUMMY_MARKETPLACE_LISTINGS } from "@/src/features/marketplace/constants/marketplace-dummy-data";

const dummyNote =
  "Illustrative marketplace data for this preview. This component is ready to receive live marketplace API data.";

export const investorPageContent = {
  eyebrow: "For property investors",
  title: "Find Property Opportunities That Match Your Investment Goals",
  description:
    "Explore structured UK property opportunities, compare the information that matters and understand why an opportunity may align with your criteria.",
  primaryAction: { label: "Explore Properties", href: "/marketplace" },
  secondaryAction: { label: "Create Investor Profile", href: "/auth/sign-up" },
  trustIndicators: [
    "Structured opportunities",
    "Explainable matching",
    "Controlled deal access",
    "Investor workspace",
  ],
  sections: [
    {
      kind: "listings",
      eyebrow: "Sourced opportunities",
      heading: "See the product, not just the promise.",
      description:
        "Published opportunities appear early so you can understand what Asancha helps you discover.",
      items: DUMMY_MARKETPLACE_LISTINGS.slice(0, 3),
      action: { label: "View All Properties", href: "/marketplace" },
      note: "Public-safe preview data from the current marketplace data source. Calculations and estimates are labelled on each card and do not guarantee outcomes.",
    },
    {
      kind: "steps",
      eyebrow: "How it works",
      heading: "A simpler route from criteria to action.",
      description:
        "Account and verification checks remain in the workflow without dominating the public journey.",
      items: [
        {
          title: "Tell Us",
          description:
            "Create your investor profile and define locations, budget, strategy and readiness.",
        },
        {
          title: "Discover & Evaluate",
          description:
            "Explore, save and compare structured opportunities with relevant match context.",
        },
        {
          title: "Verify & Progress",
          description:
            "Complete the checks required for protected information and approved next actions.",
        },
      ],
    },
    {
      kind: "cards",
      eyebrow: "Why Asancha",
      heading: "A more structured way to source property.",
      description:
        "Focus on relevant opportunities with clearer information and connected next steps.",
      items: [
        {
          title: "Relevant Discovery",
          description:
            "Use your goals and preferences to focus property discovery.",
          icon: "search",
        },
        {
          title: "Clearer Information",
          description:
            "Review consistent property, price, occupancy and strategy details.",
          icon: "sliders",
        },
        {
          title: "Explainable Matching",
          description:
            "See the criteria that align and the information still requiring review.",
          icon: "sparkles",
        },
        {
          title: "Controlled Progression",
          description:
            "Access sensitive information only when the correct conditions are met.",
          icon: "shield",
        },
      ],
    },
    {
      kind: "comparison",
      eyebrow: "Personalised match",
      heading: "Understand why an opportunity may fit.",
      description:
        "Matching is advisory: it explains alignment without guaranteeing suitability or returns.",
      columns: [
        {
          title: "Your criteria",
          items: [
            { label: "Budget", value: "Up to £200k" },
            { label: "Location", value: "Manchester" },
            { label: "Strategy", value: "Buy-to-let" },
            { label: "Min. yield", value: "6.5%" },
          ],
        },
        {
          title: "Example opportunity",
          badge: "Strong alignment",
          items: [
            { label: "Price", value: "£185k" },
            { label: "Location", value: "Manchester" },
            { label: "Strategy", value: "Buy-to-let" },
            { label: "Gross yield", value: "7.5%" },
          ],
        },
        {
          title: "Review further",
          items: [
            { label: "Condition", value: "More detail needed" },
            { label: "Tenure", value: "Leasehold" },
            { label: "Funding", value: "Check eligibility" },
            { label: "Deal pack", value: "Controlled" },
          ],
        },
      ],
    },
    {
      kind: "comparison",
      eyebrow: "Compare",
      heading: "Compare opportunities side by side.",
      description:
        "Bring price, yield, strategy and status into one readable view.",
      columns: [
        {
          title: "Manchester",
          items: [
            { label: "Price", value: "£185k" },
            { label: "Gross yield", value: "7.5%" },
            { label: "Status", value: "Published" },
          ],
        },
        {
          title: "Leeds",
          items: [
            { label: "Price", value: "£210k" },
            { label: "Gross yield", value: "6.8%" },
            { label: "Status", value: "Published" },
          ],
        },
        {
          title: "Nottingham",
          items: [
            { label: "Price", value: "£195k" },
            { label: "Gross yield", value: "7.2%" },
            { label: "Status", value: "Review details" },
          ],
        },
      ],
    },
    {
      kind: "workspace",
      eyebrow: "Investor workspace",
      heading: "Keep opportunities and next steps together.",
      description:
        "Save, compare and track activity without confusing interest with reservation or completion.",
      stats: [
        { label: "Saved", value: "8" },
        { label: "New matches", value: "3" },
        { label: "Comparisons", value: "2" },
        { label: "Actions", value: "1" },
      ],
      tabs: ["Matches", "Saved", "Comparisons", "Alerts"],
      items: [
        {
          title: "Manchester buy-to-let",
          meta: "Matched on location, budget and yield",
          status: "New match",
        },
        {
          title: "Leeds refurbishment",
          meta: "Saved for later review",
          status: "Saved",
        },
      ],
    },
    {
      kind: "split",
      eyebrow: "Verification & trust",
      heading: "Clear access boundaries at every stage.",
      description:
        "Public discovery remains useful while private deal information stays controlled.",
      leftTitle: "Available in public previews",
      leftItems: [
        "General location and property type",
        "Approved headline figures",
        "Publication status",
        "Safe opportunity summary",
      ],
      rightTitle: "Controlled information",
      rightItems: [
        "Full deal packs and documents",
        "Seller or tenant information",
        "Payment and reservation records",
        "Restricted analysis and conversations",
      ],
    },
  ],
  faqs: [
    {
      question: "Can I browse before creating an account?",
      answer:
        "Yes. Public visitors can browse safe property previews; protected information and actions may require an account and further checks.",
    },
    {
      question: "Does Asancha guarantee returns?",
      answer:
        "No. Calculations, comparisons and matching support your review but are not financial, legal or investment advice.",
    },
    {
      question: "Does saving reserve a property?",
      answer:
        "No. Saving is a workspace action. Reservation is separate and is confirmed only when the platform shows that status.",
    },
  ],
  finalCtaHeading: "Start exploring relevant opportunities.",
  finalCtaDescription:
    "Browse public opportunities now and create a profile when you are ready to personalise your experience.",
} satisfies SolutionPageExperienceProps;

export const ownerPageContent = {
  eyebrow: "For property owners",
  title: "List Your Property and Reach Relevant Buyers & Investors",
  description:
    "Present your property through a structured, secure process while keeping sensitive ownership and deal information controlled.",
  primaryAction: {
    label: "List My Property",
    href: "/dashboard/property-owner/properties/new",
  },
  secondaryAction: { label: "See How It Works", href: "/how-it-works" },
  trustIndicators: [
    "Controlled publication",
    "Relevant investor reach",
    "Protected information",
    "Visible progress",
  ],
  sections: [
    {
      kind: "steps",
      eyebrow: "A simple owner journey",
      heading: "From property submission to approved progression.",
      description:
        "The platform guides you through the required information and checks.",
      items: [
        {
          title: "Submit",
          description:
            "Create your account and add the property information you have.",
        },
        {
          title: "Review & Approve",
          description:
            "Provide ownership or authority evidence and respond to review requests.",
        },
        {
          title: "Reach Buyers",
          description:
            "Approved opportunities can be shown to relevant investors and professionals.",
        },
        {
          title: "Progress",
          description:
            "Track interest, actions and permitted next steps from your workspace.",
        },
      ],
    },
    {
      kind: "showcase",
      eyebrow: "Your listing",
      heading: "See what an approved opportunity can look like.",
      description:
        "Structured presentation helps buyers understand the opportunity without exposing protected information.",
      label: "Example public listing",
      title: "2-bed apartment · Birmingham",
      badge: "Published",
      metrics: [
        { label: "Asking price", value: "£220,000" },
        { label: "Property type", value: "Apartment" },
        { label: "Bedrooms", value: "2" },
        { label: "Status", value: "Available" },
      ],
      details: [
        "Approved property summary",
        "Selected images and features",
        "Safe location context",
        "Clear route to enquire",
      ],
      note: dummyNote,
      image: {
        src: "/auth-bg.avif",
        alt: "Illustrative public property opportunity preview",
      },
      action: {
        label: "View Property",
        href: "/marketplace/manchester-bmv-terrace-near-ancoats",
      },
    },
    {
      kind: "cards",
      eyebrow: "Why list through Asancha",
      heading: "More control over how your property is presented.",
      description:
        "Reach a relevant audience while keeping the process organised.",
      items: [
        {
          title: "Relevant Audience",
          description:
            "Present approved opportunities to investors and property professionals.",
          icon: "users",
        },
        {
          title: "Information Control",
          description: "Separate safe public details from protected records.",
          icon: "lock",
        },
        {
          title: "Organised Listing",
          description:
            "Keep property information and supporting documents together.",
          icon: "building",
        },
        {
          title: "Visible Progress",
          description:
            "See review status, action requests and permitted next steps.",
          icon: "check",
        },
      ],
    },
    {
      kind: "split",
      eyebrow: "Information control",
      heading: "Public where useful. Protected where necessary.",
      description:
        "Visibility follows listing status, privacy requirements and approved access rules.",
      leftTitle: "May be shown publicly",
      leftItems: [
        "General location",
        "Property type and bedrooms",
        "Approved images and summary",
        "Headline price information",
      ],
      rightTitle: "Kept controlled",
      rightItems: [
        "Ownership documents",
        "Full address where restricted",
        "Private contact details",
        "Protected deal and payment records",
      ],
    },
    {
      kind: "checklist",
      eyebrow: "Prepare your listing",
      heading: "What you’ll need.",
      description:
        "Start with what you have and complete required information as the journey progresses.",
      items: [
        "Property type and location",
        "Bedrooms, tenure and occupancy",
        "Asking price and rental information",
        "Photos and description",
        "Ownership or authority information",
        "Relevant supporting documents",
      ],
    },
    {
      kind: "workspace",
      eyebrow: "Owner workspace",
      heading: "Track status and know what happens next.",
      description: "A submission is not automatically published or verified.",
      stats: [
        { label: "Properties", value: "1" },
        { label: "Published", value: "0" },
        { label: "Enquiries", value: "2" },
        { label: "Actions", value: "1" },
      ],
      tabs: ["Properties", "Enquiries", "Documents", "Messages"],
      items: [
        {
          title: "Birmingham apartment",
          meta: "Draft → Submitted → Under review → Published → Progressing",
          status: "Action required",
          actions: ["Edit listing", "Upload documents"],
        },
        {
          title: "Approved listing activity",
          meta: "Permitted activity becomes available as the listing progresses.",
          status: "Illustrative",
          actions: ["View enquiries", "Messages"],
        },
      ],
    },
    {
      kind: "route",
      eyebrow: "Choose the right route",
      heading: "Are you the owner or acting professionally?",
      description:
        "The correct role keeps authority, onboarding and workspace actions clear.",
      routes: [
        {
          title: "I own the property",
          description:
            "Use the Property Owner route for property you own or control directly.",
          href: "/dashboard/property-owner/properties/new",
          action: "List as an owner",
        },
        {
          title: "I represent the owner",
          description:
            "Agents and sourcers should use the route that matches their professional relationship.",
          href: "/solutions/property-agents",
          action: "Compare professional routes",
        },
      ],
    },
  ],
  faqs: [
    {
      question: "Does submitting guarantee publication?",
      answer:
        "No. Review, documents, corrections or verification may be required before publication.",
    },
    {
      question: "Will my full address appear publicly?",
      answer:
        "Not necessarily. Address visibility follows the approved listing and privacy rules.",
    },
    {
      question: "Does Asancha guarantee a buyer?",
      answer:
        "No. Asancha supports discovery and progression but cannot guarantee interest, an offer or completion.",
    },
  ],
  finalCtaHeading: "Ready to list your property?",
  finalCtaDescription:
    "Start your listing and provide the required information at the appropriate stage.",
} satisfies SolutionPageExperienceProps;

export const agentPageContent = {
  eyebrow: "For property agents",
  title: "Manage Client Properties and Reach Relevant Investors",
  description:
    "Manage authorised client stock, control listing information and progress enquiries through one structured agent workspace.",
  primaryAction: { label: "Join as a Property Agent", href: "/auth/sign-up" },
  secondaryAction: {
    label: "See How It Works",
    href: "/how-it-works",
  },
  trustIndicators: [
    "Multi-property management",
    "Client authority",
    "Controlled visibility",
    "Listing status",
  ],
  sections: [
    {
      kind: "steps",
      eyebrow: "Agent journey",
      heading: "Four stages from representation to progression.",
      description: "Operational checks stay behind a clear commercial journey.",
      items: [
        {
          title: "Set Up Your Agency",
          description:
            "Create the correct profile and provide relevant company information.",
        },
        {
          title: "Add Client Stock",
          description:
            "Add represented properties with the appropriate authority information.",
        },
        {
          title: "Publish & Reach Investors",
          description:
            "Submit complete listings for review and approved visibility.",
        },
        {
          title: "Manage & Progress",
          description:
            "Track enquiries, conversations, documents and next actions.",
        },
      ],
    },
    {
      kind: "workspace",
      eyebrow: "Agent workspace",
      heading: "Manage client stock at a glance.",
      description:
        "Give multi-property management the visual prominence it deserves.",
      stats: [
        { label: "Properties", value: "18" },
        { label: "Published", value: "11" },
        { label: "Under review", value: "4" },
        { label: "Action required", value: "3" },
      ],
      tabs: ["Properties", "Listings", "Enquiries", "Documents"],
      items: [
        {
          title: "Park Road, Leeds",
          meta: "Client authority recorded",
          status: "Published",
        },
        {
          title: "King Street, Manchester",
          meta: "Missing supporting information",
          status: "Action required",
        },
      ],
    },
    {
      kind: "showcase",
      eyebrow: "Client stock",
      heading: "Show approved property information clearly.",
      description:
        "Investors see a structured public opportunity while client and authority records remain controlled.",
      label: "Example investor view",
      title: "4-bed HMO · Leeds",
      badge: "Published",
      metrics: [
        { label: "Asking price", value: "£310,000" },
        { label: "Gross yield", value: "7.1%" },
        { label: "Occupancy", value: "Tenanted" },
        { label: "Agent", value: "Approved" },
      ],
      details: [
        "Approved images",
        "Headline investment information",
        "Agency contact route",
        "Controlled supporting documents",
      ],
      note: dummyNote,
      image: {
        src: "/auth-bg.avif",
        alt: "Illustrative agent-managed public property listing",
      },
      action: {
        label: "View Property",
        href: "/marketplace/manchester-bmv-terrace-near-ancoats",
      },
    },
    {
      kind: "cards",
      eyebrow: "Why agents use Asancha",
      heading: "A clearer route from client instruction to investor discovery.",
      description:
        "Organise stock, protect information and keep listing activity visible.",
      items: [
        {
          title: "Manage More Stock",
          description:
            "Keep multiple client properties in one role-specific workspace.",
          icon: "building",
        },
        {
          title: "Reach Relevant Investors",
          description:
            "Present approved stock through Asancha’s property discovery journey.",
          icon: "users",
        },
        {
          title: "Control Information",
          description:
            "Separate public listing content from client and authority records.",
          icon: "lock",
        },
        {
          title: "Track Review",
          description:
            "See publication, correction and progression states clearly.",
          icon: "check",
        },
      ],
    },
    {
      kind: "comparison",
      eyebrow: "Investor discovery",
      heading: "Show why approved client stock may be relevant.",
      description:
        "Discovery uses stated investor criteria as decision support and never guarantees a buyer, viewing, offer or completion.",
      columns: [
        {
          title: "Investor criteria",
          items: [
            { label: "Location", value: "Leeds" },
            { label: "Budget", value: "Up to £350k" },
            { label: "Strategy", value: "HMO" },
          ],
        },
        {
          title: "Client listing",
          badge: "Potentially relevant",
          items: [
            { label: "Location", value: "Leeds" },
            { label: "Asking price", value: "£310k" },
            { label: "Strategy", value: "HMO" },
          ],
        },
        {
          title: "Important boundary",
          items: [
            { label: "Match type", value: "Advisory" },
            { label: "Buyer", value: "Not guaranteed" },
            { label: "Due diligence", value: "Still required" },
          ],
        },
      ],
    },
    {
      kind: "split",
      eyebrow: "Authority & control",
      heading: "Represent client stock with clear boundaries.",
      description:
        "Authority evidence supports trust but does not automatically verify every property claim.",
      leftTitle: "Investor-facing information",
      leftItems: [
        "Approved listing summary",
        "Selected images and features",
        "Headline investment figures",
        "Platform enquiry route",
      ],
      rightTitle: "Controlled records",
      rightItems: [
        "Agency agreements",
        "Private client instructions",
        "Ownership and identity evidence",
        "Restricted documents and conversations",
      ],
    },
    {
      kind: "timeline",
      eyebrow: "Listing review",
      heading: "Make correction and approval status obvious.",
      description:
        "Agents should always understand the affected section and next required action.",
      items: [
        "Draft",
        "Submitted",
        "Under review",
        "Correction required",
        "Approved",
        "Published",
      ],
    },
    {
      kind: "route",
      eyebrow: "Agent or sourcer?",
      heading: "Choose the role that matches the relationship.",
      description:
        "Agents represent client property; sourcers package investment opportunities and disclose their sourcing model.",
      routes: [
        {
          title: "Property Agent",
          description:
            "Choose this route when managing and marketing property under client authority.",
          href: "/auth/sign-up",
          action: "Join as an agent",
        },
        {
          title: "Property Sourcer",
          description:
            "Choose this route when sourcing and packaging investment-focused opportunities.",
          href: "/solutions/property-sourcers",
          action: "Explore the sourcer route",
        },
      ],
    },
  ],
  faqs: [
    {
      question: "Do I need authority before submitting client property?",
      answer:
        "Yes. You must have lawful authority and may be asked for supporting evidence.",
    },
    {
      question: "Does submission guarantee publication?",
      answer: "No. Listings may require review, correction and approval.",
    },
    {
      question: "Can I manage properties for several clients?",
      answer:
        "Yes, subject to the applicable profile, authority and listing rules.",
    },
  ],
  finalCtaHeading: "Bring your client stock into one workspace.",
  finalCtaDescription:
    "Create an agent account and begin the correct company and authority journey.",
} satisfies SolutionPageExperienceProps;

export const sourcerPageContent = {
  eyebrow: "For property sourcers",
  title: "Get Your Property Opportunities in Front of Relevant Investors",
  description:
    "Package investment-focused opportunities, disclose sourcing fees and manage reviewed deals from one sourcer workspace.",
  primaryAction: { label: "Join as a Property Sourcer", href: "/auth/sign-up" },
  secondaryAction: { label: "See How It Works", href: "/how-it-works" },
  trustIndicators: [
    "Structured deal presentation",
    "Investor alignment",
    "Transparent fees",
    "Protected information",
  ],
  sections: [
    {
      kind: "steps",
      eyebrow: "Sourcer journey",
      heading: "From sourced opportunity to investor progression.",
      description:
        "Lead with the commercial workflow while keeping compliance checks clear.",
      items: [
        {
          title: "Create Your Profile",
          description:
            "Tell Asancha about your sourcing activity and relevant business information.",
        },
        {
          title: "Package the Deal",
          description:
            "Add consistent property, financial, strategy and sourcing-fee information.",
        },
        {
          title: "Submit for Review",
          description:
            "Provide relevant authority and supporting information for review.",
        },
        {
          title: "Reach & Progress",
          description:
            "Manage approved visibility, investor interest and next actions.",
        },
      ],
    },
    {
      kind: "showcase",
      eyebrow: "Deal preview",
      heading: "Show what a professionally packaged deal looks like.",
      description:
        "Make key information comparable without representing estimates as verified facts.",
      label: "Example sourced opportunity",
      title: "Refurbishment opportunity · Nottingham",
      badge: "Illustrative",
      metrics: [
        { label: "Purchase price", value: "£160,000" },
        { label: "Refurb estimate", value: "£22,000" },
        { label: "Gross yield", value: "7.5%" },
        { label: "Sourcing fee", value: "£3,000" },
      ],
      details: [
        "Strategy and condition summary",
        "Known costs separated from estimates",
        "Authority status visible",
        "Protected deal pack access",
      ],
      note: dummyNote,
      image: {
        src: "/auth-bg.avif",
        alt: "Illustrative sourced property deal preview",
      },
      action: {
        label: "View Example Property",
        href: "/marketplace/leeds-light-refurb-semi-detached",
      },
    },
    {
      kind: "cards",
      eyebrow: "Why Asancha",
      heading: "Present deals with more clarity and control.",
      description:
        "Support discovery without promising investor demand or completion.",
      items: [
        {
          title: "Consistent Presentation",
          description:
            "Package opportunities using comparable property and deal information.",
          icon: "clipboard",
        },
        {
          title: "Relevant Discovery",
          description:
            "Help opportunities reach investors whose criteria may align.",
          icon: "users",
        },
        {
          title: "Transparent Fees",
          description: "Make the sourcing-fee model and known costs clear.",
          icon: "briefcase",
        },
        {
          title: "Visible Progress",
          description:
            "Track review, corrections, publication and investor activity.",
          icon: "check",
        },
      ],
    },
    {
      kind: "comparison",
      eyebrow: "Investor alignment",
      heading: "Make matching tangible without guaranteeing demand.",
      description:
        "Show criteria alignment, uncertainty and information that needs further review.",
      columns: [
        {
          title: "Investor criteria",
          items: [
            { label: "Budget", value: "£200k" },
            { label: "Strategy", value: "Refurbishment" },
            { label: "Min. yield", value: "6.5%" },
          ],
        },
        {
          title: "Submitted deal",
          badge: "Potential match",
          items: [
            { label: "Total known cost", value: "£185k" },
            { label: "Strategy", value: "Refurbishment" },
            { label: "Gross yield", value: "7.5% est." },
          ],
        },
        {
          title: "Review",
          items: [
            { label: "Authority", value: "In review" },
            { label: "Costs", value: "Confirm estimates" },
            { label: "Demand", value: "Not guaranteed" },
          ],
        },
      ],
    },
    {
      kind: "workspace",
      eyebrow: "Sourcer workspace",
      heading: "Manage multiple opportunities visibly.",
      description:
        "See deals, review states and investor activity without losing fee or document context.",
      stats: [
        { label: "Active deals", value: "12" },
        { label: "Under review", value: "3" },
        { label: "Published", value: "7" },
        { label: "Action required", value: "2" },
      ],
      tabs: ["Deals", "Deal packs", "Enquiries", "Performance"],
      items: [
        {
          title: "Nottingham refurbishment",
          meta: "Fee disclosed · documents attached",
          status: "Under review",
        },
        {
          title: "Liverpool buy-to-let",
          meta: "Published to eligible investors",
          status: "Published",
        },
      ],
    },
    {
      kind: "comparison",
      eyebrow: "Transparent sourcing fees",
      heading: "Keep each money flow clear and separate.",
      description:
        "Deal-specific sourcing fees are disclosed separately from the property price, platform charges and any reservation-related payment.",
      columns: [
        {
          title: "Property price",
          items: [
            { label: "Example asking price", value: "£160,000" },
            { label: "Information type", value: "Property fact" },
          ],
        },
        {
          title: "Sourcing fee",
          badge: "Disclosed separately",
          items: [
            { label: "Example fee", value: "£3,000" },
            { label: "Payee / timing", value: "Deal-specific terms" },
          ],
        },
        {
          title: "Other payments",
          items: [
            { label: "Platform charges", value: "Separate where applicable" },
            { label: "Reservation payment", value: "Not a purchase" },
          ],
        },
      ],
    },
    {
      kind: "cards",
      eyebrow: "Trust & verification",
      heading: "Professional checks support trust without overclaiming.",
      description:
        "Sourcer, authority, document and opportunity review are separate controls; approval of one does not automatically verify every deal statement.",
      items: [
        {
          title: "Professional Profile",
          description:
            "Complete the identity and business checks relevant to the sourcer role.",
          icon: "agent",
        },
        {
          title: "Authority Evidence",
          description:
            "Provide lawful authority information where the submitted opportunity requires it.",
          icon: "document",
        },
        {
          title: "Opportunity Review",
          description:
            "Submission, approval, publication and verification remain distinct states.",
          icon: "search",
        },
        {
          title: "Advisory Matching",
          description:
            "Matching supports discovery and does not guarantee investor demand or suitability.",
          icon: "shield",
        },
      ],
    },
    {
      kind: "split",
      eyebrow: "Protected information",
      heading: "Show enough to inform, not enough to expose.",
      description:
        "Deal visibility follows role, verification and workflow rules.",
      leftTitle: "Public / approved preview",
      leftItems: [
        "General location and strategy",
        "Approved price and yield indicators",
        "Sourcing-fee disclosure",
        "Safe deal summary",
      ],
      rightTitle: "Controlled",
      rightItems: [
        "Seller details",
        "Authority agreements",
        "Protected deal packs",
        "Payment, reservation and private notes",
      ],
    },
    {
      kind: "route",
      eyebrow: "Sourcer or agent?",
      heading: "Use the route that reflects your work.",
      description:
        "The distinction keeps authority, fees and onboarding expectations clear.",
      routes: [
        {
          title: "Property Sourcer",
          description:
            "Source and package investment opportunities, including transparent sourcing fees.",
          href: "/auth/sign-up",
          action: "Join as a sourcer",
        },
        {
          title: "Property Agent",
          description:
            "Represent property owners or vendors under client authority.",
          href: "/solutions/property-agents",
          action: "Explore the agent route",
        },
      ],
    },
  ],
  faqs: [
    {
      question: "Does submission automatically publish a deal?",
      answer:
        "No. Submission, review, approval and publication are separate states.",
    },
    {
      question: "Can investors see my sourcing fee?",
      answer:
        "Approved fee information should be disclosed clearly wherever the applicable workflow requires it.",
    },
    {
      question: "Does Asancha guarantee investor interest?",
      answer:
        "No. Matching and discovery do not guarantee demand, sale or completion.",
    },
  ],
  finalCtaHeading: "Package and present your next opportunity.",
  finalCtaDescription:
    "Create the correct sourcer profile and begin submitting structured deals.",
} satisfies SolutionPageExperienceProps;

export const providerPageContent = {
  eyebrow: "For property service providers",
  title:
    "Connect Your Property Services with Relevant Clients and Opportunities",
  description:
    "Create a professional profile, list your services and connect with relevant property needs across the Asancha journey.",
  primaryAction: { label: "Join as a Service Provider", href: "/auth/sign-up" },
  secondaryAction: {
    label: "Explore Service Categories",
    href: "#solution-section-1",
  },
  trustIndicators: [
    "Professional profile",
    "Property-linked enquiries",
    "Bookings & communication",
    "Controlled information",
  ],
  sections: [
    {
      kind: "steps",
      eyebrow: "Provider journey",
      heading: "A simple route from expertise to relevant work.",
      description:
        "Professional checks support the journey without obscuring the core value.",
      items: [
        {
          title: "Create Your Profile",
          description:
            "Describe your services, coverage and relevant business information.",
        },
        {
          title: "Complete Relevant Checks",
          description:
            "Provide category-specific qualifications, registrations or insurance where needed.",
        },
        {
          title: "Connect with Property Needs",
          description:
            "Receive or respond to eligible, property-linked enquiries.",
        },
        {
          title: "Manage Enquiries & Work",
          description:
            "Coordinate quotes, bookings, messages, documents and enabled payment actions.",
        },
      ],
    },
    {
      kind: "cards",
      eyebrow: "Service categories",
      heading: "Offer expertise across the property journey.",
      description:
        "The production taxonomy and evidence requirements remain category-specific.",
      items: [
        {
          title: "Legal & Conveyancing",
          description: "Conveyancing, contracts, title and lease support.",
          icon: "document",
        },
        {
          title: "Finance & Funding",
          description:
            "Mortgage, bridging, development finance and funding readiness.",
          icon: "briefcase",
        },
        {
          title: "Survey & Valuation",
          description: "Survey, valuation, inspection and condition services.",
          icon: "search",
        },
        {
          title: "Construction & Refurbishment",
          description: "Refurbishment, construction and planning support.",
          icon: "building",
        },
        {
          title: "Property Management",
          description: "Property operations, management and related services.",
          icon: "building",
        },
        {
          title: "Tax & Accounting",
          description: "Property-related tax and accounting support.",
          icon: "briefcase",
        },
        {
          title: "Photography & Floor Plans",
          description: "Approved property marketing and visual services.",
          icon: "document",
        },
      ],
    },
    {
      kind: "showcase",
      eyebrow: "Professional presence",
      heading: "Show providers what they are building.",
      description:
        "A structured profile makes service, coverage, availability and approved evidence easy to understand.",
      label: "Example provider profile",
      title: "Northampton Property Surveys Ltd",
      badge: "New enquiries accepted",
      metrics: [
        { label: "Service", value: "Surveys" },
        { label: "Coverage", value: "Northants" },
        { label: "Availability", value: "Available" },
        { label: "Evidence", value: "Approved" },
      ],
      details: [
        "Building surveys and inspections",
        "Selected surrounding areas",
        "Platform contact route",
        "Only approved status labels shown",
      ],
      note: "Illustrative provider profile. Status wording must map to the approved production verification scope before release.",
    },
    {
      kind: "showcase",
      eyebrow: "Property-linked enquiry",
      heading: "Connect expertise to a real property need.",
      description:
        "Relevant property context makes an enquiry more useful than an isolated message.",
      label: "Example service request",
      title: "Building survey · 3-bed house, Manchester",
      badge: "New enquiry",
      metrics: [
        { label: "Timing", value: "Within 7 days" },
        { label: "Requested by", value: "Eligible user" },
      ],
      details: [
        "Permitted property context",
        "Clear service requirement",
        "Respond or request information",
        "Private details remain controlled",
      ],
      note: "Illustrative property-linked enquiry. Private address, user and document information remains controlled.",
    },
    {
      kind: "cards",
      eyebrow: "Why Asancha",
      heading: "Why offer your services through Asancha?",
      description:
        "Become part of the professional support layer around property sourcing.",
      items: [
        {
          title: "Relevant Enquiries",
          description: "Connect where service, location and eligibility align.",
          icon: "search",
        },
        {
          title: "Professional Presence",
          description:
            "Present services and approved professional information clearly.",
          icon: "agent",
        },
        {
          title: "Property Context",
          description: "Receive permitted context connected to the request.",
          icon: "building",
        },
        {
          title: "Connected Workflow",
          description: "Manage enquiries, bookings and next steps together.",
          icon: "booking",
        },
      ],
    },
    {
      kind: "workspace",
      eyebrow: "Provider workspace",
      heading: "Manage enquiries and work in one place.",
      description:
        "Illustrative figures demonstrate supported workspace areas. Payment-aware actions remain secondary to enquiries and bookings.",
      stats: [
        { label: "New enquiries", value: "6" },
        { label: "Bookings", value: "3" },
        { label: "Active jobs", value: "4" },
        { label: "Action required", value: "1" },
      ],
      tabs: ["Enquiries", "Bookings", "Quotes", "Messages", "Documents"],
      items: [
        {
          title: "Building survey · Manchester",
          meta: "Requested within 7 days",
          status: "New enquiry",
        },
        {
          title: "Valuation · Leeds",
          meta: "Quote awaiting response",
          status: "Pending",
        },
      ],
    },
    {
      kind: "cards",
      eyebrow: "Professional verification",
      heading: "Build trust with evidence relevant to the service category.",
      description:
        "Requirements can include identity, company information, qualifications, licences, registrations or insurance. Asancha does not replace professional regulators or insurers.",
      items: [
        {
          title: "Category-Specific Checks",
          description:
            "Evidence requirements follow the selected service category rather than one generic badge.",
          icon: "clipboard",
        },
        {
          title: "Scoped Status Wording",
          description:
            "Only display approval language supported by the evidence actually reviewed.",
          icon: "check",
        },
        {
          title: "Actionable Review",
          description:
            "Providers can see when evidence is under review or requires correction.",
          icon: "document",
        },
        {
          title: "Ongoing Responsibility",
          description:
            "Provider approval does not verify every quote, deliverable or professional opinion.",
          icon: "shield",
        },
      ],
    },
    {
      kind: "split",
      eyebrow: "Public vs protected",
      heading:
        "Present professional information without exposing private evidence.",
      description:
        "Approval does not replace a regulator, professional body, licence issuer or insurer.",
      leftTitle: "May appear on the profile",
      leftItems: [
        "Service category and description",
        "Coverage and general availability",
        "Approved credential wording",
        "Permitted pricing guidance",
      ],
      rightTitle: "Protected",
      rightItems: [
        "Identity and address evidence",
        "Restricted certificates",
        "Private booking and client details",
        "Payment evidence and conversations",
      ],
    },
    {
      kind: "split",
      eyebrow: "Payment-aware workflows",
      heading: "Keep payments in their proper supporting role.",
      description:
        "Where enabled, payment-related actions follow booking, access and secure review rules. Uploading proof does not approve a payment.",
      leftTitle: "May be available in the workflow",
      leftItems: [
        "Service fee or quote reference",
        "Payment reference status",
        "Permitted proof submission",
        "Booking-linked payment context",
      ],
      rightTitle: "Important boundaries",
      rightItems: [
        "Payment proof is not payment approval",
        "Platform and provider fees remain distinct",
        "Property or reservation money flows remain separate",
        "Frontend status never overrides secure checks",
      ],
    },
  ],
  faqs: [
    {
      question: "Does creating an account approve my services?",
      answer:
        "No. Provider and service-category review remain separate from account creation.",
    },
    {
      question: "How do property-linked enquiries work?",
      answer:
        "Eligible requests can include only the property context you are permitted to access.",
    },
    {
      question: "Can I set my coverage area and availability?",
      answer:
        "Yes. Provider profiles support service-area and availability information, subject to the approved profile and category workflow.",
    },
    {
      question: "Can I provide quotes or pricing guidance?",
      answer:
        "Where enabled, providers can use permitted quote or pricing workflows. Any displayed guidance must remain accurate and follow the applicable category rules.",
    },
    {
      question: "How do bookings and payment references work?",
      answer:
        "Bookings, messages and payment-aware actions are separate workflow states. A payment reference or uploaded proof does not itself approve a payment.",
    },
    {
      question: "Does Asancha guarantee bookings or revenue?",
      answer:
        "No. The platform supports discovery and workflow but cannot guarantee enquiries, work or revenue.",
    },
  ],
  finalCtaHeading: "Bring your services into the property journey.",
  finalCtaDescription:
    "Create your service-provider profile and complete the checks relevant to your categories.",
} satisfies SolutionPageExperienceProps;

export const apiPartnerPageContent = {
  eyebrow: "Asancha API partnerships",
  title: "Connect Your Platform to Asancha Property Sourcing Capabilities",
  description:
    "Apply to integrate approved Asancha property sourcing and intelligence capabilities into your product or internal system, with App-specific permissions and controlled access.",
  primaryAction: { label: "Apply for API Access", href: "/api-partner/apply" },
  secondaryAction: {
    label: "Explore Integration Use Cases",
    href: "#solution-section-3",
  },
  utilityAction: {
    label: "Check Application Status",
    href: "/api-partner/application-status",
  },
  trustIndicators: [
    "Scoped access",
    "App-level controls",
    "Usage monitoring",
    "Webhooks",
  ],
  sections: [
    {
      kind: "cards",
      eyebrow: "API capabilities",
      heading: "Build property features without recreating the whole workflow.",
      description:
        "Public capability families represent approved integration areas; access remains App- and scope-specific.",
      items: [
        {
          title: "Property Discovery",
          description:
            "Use approved property and listing data in discovery experiences.",
          icon: "search",
        },
        {
          title: "Property Intelligence",
          description:
            "Use approved calculations, indicators or intelligence outputs.",
          icon: "sparkles",
        },
        {
          title: "Recommendations",
          description:
            "Receive matching-related outputs where supported and approved.",
          icon: "sliders",
        },
        {
          title: "Property Events",
          description:
            "React to approved listing and App events through webhooks.",
          icon: "key",
        },
      ],
    },
    {
      kind: "workspace",
      eyebrow: "API App workspace",
      heading: "Manage each approved integration separately.",
      description:
        "Illustrative App-level view. It never displays full credentials, private endpoints or internal error traces.",
      stats: [
        { label: "Apps", value: "2" },
        { label: "Requests", value: "12.4k" },
        { label: "Webhook delivery", value: "99.2%" },
        { label: "Actions", value: "1" },
      ],
      tabs: ["Apps", "Scopes", "Keys", "Usage", "Webhooks"],
      items: [
        {
          title: "Property Discovery App",
          meta: "Production · scopes: listings:read · key: as_live_••••7K2P",
          status: "Active",
          actions: ["Usage", "Webhook status", "Last activity"],
        },
        {
          title: "Research Integration",
          meta: "Test environment · requested scopes under review",
          status: "In review",
          actions: ["Scope request", "App status"],
        },
      ],
    },
    {
      kind: "comparison",
      eyebrow: "Integration model",
      heading: "Understand the data flow in seconds.",
      description:
        "The approved App authenticates server-side, receives only approved scopes and can receive signed events where enabled.",
      columns: [
        {
          title: "Partner App",
          items: [
            { label: "Examples", value: "PropTech / internal system" },
            { label: "Authentication", value: "Server-side" },
          ],
        },
        {
          title: "Asancha API layer",
          badge: "Controlled",
          items: [
            { label: "Requests", value: "Scoped endpoints" },
            { label: "Events", value: "Signed webhooks" },
          ],
        },
        {
          title: "Asancha Platform",
          items: [
            { label: "Capabilities", value: "Approved only" },
            { label: "Protected data", value: "Access-controlled" },
          ],
        },
      ],
    },
    {
      kind: "cards",
      eyebrow: "Partner use cases",
      heading: "Connect Asancha to an approved property workflow.",
      description:
        "Use cases are reviewed against purpose, data requirements and available capabilities.",
      items: [
        {
          title: "PropTech Platforms",
          description: "Embed approved sourcing or intelligence capabilities.",
          icon: "briefcase",
        },
        {
          title: "Investor Platforms",
          description:
            "Support investor-facing discovery or analysis experiences.",
          icon: "investor",
        },
        {
          title: "Property Systems",
          description:
            "Connect authorised sourcing, management or operational workflows.",
          icon: "building",
        },
        {
          title: "Enterprise Teams",
          description:
            "Connect approved internal property tools through controlled App access.",
          icon: "users",
        },
      ],
    },
    {
      kind: "steps",
      eyebrow: "Partner journey",
      heading: "From application to monitored integration.",
      description:
        "Applying does not create an App, issue a key, approve scopes, activate billing or grant production access.",
      items: [
        {
          title: "Apply",
          description:
            "Describe your organisation, App, use case, expected usage and security approach.",
        },
        {
          title: "Review & Approve",
          description:
            "Asancha reviews purpose, requested scopes and applicable commercial requirements.",
        },
        {
          title: "Configure & Test",
          description:
            "Approved Apps can configure credentials, documentation and supported test flows.",
        },
        {
          title: "Launch & Monitor",
          description:
            "Eligible Apps move into the approved environment with usage and status visibility.",
        },
      ],
    },
    {
      kind: "cards",
      eyebrow: "Developer experience",
      heading: "A practical integration experience for approved Apps.",
      description:
        "Detailed credential and security guidance remains in partner documentation.",
      items: [
        {
          title: "Authentication & Scopes",
          description:
            "Server-side credentials with the smallest approved permission set.",
          icon: "key",
        },
        {
          title: "Environments & Docs",
          description:
            "Environment handling and endpoint, error and authentication guidance where supported.",
          icon: "document",
          href: "/api-partner/docs",
          action: "Developer documentation",
        },
        {
          title: "Webhooks",
          description:
            "Signed HTTPS event delivery and delivery visibility where enabled.",
          icon: "message",
        },
        {
          title: "Monitoring",
          description:
            "App-level usage, key and status visibility where supported.",
          icon: "investor",
          href: "/api-partner/usage",
          action: "Usage workspace",
        },
      ],
    },
    {
      kind: "split",
      eyebrow: "Scoped access & security",
      heading: "API access does not mean access to everything.",
      description: "Secure-by-design controls protect Apps and platform data.",
      leftTitle: "Access can depend on",
      leftItems: [
        "Organisation and App approval",
        "Environment and App status",
        "Approved scopes",
        "Subscription or access status",
        "Property visibility and legal basis",
      ],
      rightTitle: "Protected unless authorised",
      rightItems: [
        "Private owner, investor or tenant data",
        "Protected documents",
        "Payment information",
        "Internal review data",
        "Staff-only capabilities",
      ],
    },
    {
      kind: "showcase",
      eyebrow: "Webhooks",
      heading: "Keep your App updated without constant polling.",
      description:
        "Receive approved event notifications while remaining inside the App’s access model.",
      label: "Example event families",
      title: "Event-driven integration",
      badge: "Where enabled",
      details: [
        "Property or listing changes",
        "Recommendation availability",
        "Subscription or payment status",
        "App status changes",
        "Signed HTTPS delivery",
        "Retry visibility where supported",
      ],
      note: "Webhook availability does not grant access to information outside the App’s approved scopes.",
    },
    {
      kind: "split",
      eyebrow: "Commercial model",
      heading: "Commercial access follows the approved App model.",
      description:
        "Pricing is not invented on this page. Terms may depend on scope, usage and the approved agreement.",
      leftTitle: "Separate decisions",
      leftItems: [
        "Organisation approval",
        "App approval",
        "Scope approval",
        "Subscription or payment status",
      ],
      rightTitle: "Production readiness",
      rightItems: [
        "Applicable agreement accepted",
        "Approved environment",
        "Eligible App status",
        "Credentials configured securely",
      ],
    },
  ],
  faqs: [
    {
      question: "What is an API App?",
      answer:
        "An API App is a specific product, platform, website or internal system operated by an approved organisation.",
    },
    {
      question: "Does approval unlock all Asancha data?",
      answer:
        "No. Every App receives only the scopes and data approved for its authorised use case.",
    },
    {
      question: "Is there a sandbox?",
      answer:
        "Environment and testing access depend on the capabilities approved and available for the App.",
    },
    {
      question: "How does pricing work?",
      answer:
        "Commercial terms may depend on approved capabilities, scope and expected usage; applying does not activate billing.",
    },
    {
      question: "How are rate limits and support handled?",
      answer:
        "Limits and support arrangements depend on the approved App, capabilities and applicable agreement. Confirmed details are provided through approved partner resources.",
    },
  ],
  finalCtaHeading: "Apply for API access.",
  finalCtaDescription:
    "Tell us about your organisation, proposed App, use case, requested capabilities and security approach.",
} satisfies SolutionPageExperienceProps;

export const aboutPageContent = {
  eyebrow: "About Asancha",
  title: "Making Property Sourcing Smarter, Simpler and More Connected",
  description:
    "Asancha is a UK property sourcing platform connecting investors with opportunities from property owners, agents and sourcers. Structured information, intelligent matching and connected professional services support clearer discovery, evaluation and progression.",
  primaryAction: { label: "Explore Properties", href: "/marketplace" },
  secondaryAction: {
    label: "For Property Sourcers",
    href: "/solutions/property-sourcers",
  },
  trustIndicators: [
    "UK property focus",
    "Structured sourcing",
    "Explainable intelligence",
    "Controlled access",
  ],
  sections: [
    {
      kind: "showcase",
      eyebrow: "Our story",
      heading: "Why Asancha was created.",
      description:
        "Property opportunities, supporting information and next steps are often fragmented across people, documents and systems. Asancha is being built to organise that journey while keeping professional judgement and due diligence where they belong.",
      label: "Why we started",
      title: "Bring the opportunity and the next step together",
      details: [
        "Make opportunities easier to understand",
        "Connect the right property roles",
        "Protect sensitive information",
        "Keep progress visible and traceable",
      ],
    },
    {
      kind: "split",
      eyebrow: "Mission & vision",
      heading: "A clearer direction for UK property sourcing.",
      description:
        "These concise statements describe the purpose and long-term direction of the Asancha platform.",
      leftTitle: "Our mission",
      leftItems: [
        "Make UK property sourcing more accessible, informed and connected",
        "Bring opportunities, information and relevant participants into one experience",
      ],
      rightTitle: "Our vision",
      rightItems: [
        "A property sourcing ecosystem with clearer information",
        "Help people discover and progress suitable opportunities with greater confidence",
      ],
    },
    {
      kind: "steps",
      eyebrow: "What Asancha brings together",
      heading: "Source. Evaluate. Match. Verify. Progress.",
      description:
        "These are conceptual stages; they do not imply that every opportunity is verified, suitable or guaranteed to complete.",
      items: [
        {
          title: "Source",
          description:
            "Discover or submit structured UK property opportunities.",
        },
        {
          title: "Evaluate",
          description:
            "Review clearer information, comparisons and explainable indicators.",
        },
        {
          title: "Match",
          description:
            "Understand how an opportunity may align with stated preferences.",
        },
        {
          title: "Verify",
          description:
            "Complete the relevant profile, authority, document and property checks.",
        },
        {
          title: "Progress",
          description:
            "Move through permitted conversations, bookings and next actions.",
        },
      ],
    },
    {
      kind: "cards",
      eyebrow: "Built for the property ecosystem",
      heading: "Different roles, one connected sourcing journey.",
      description:
        "Each role has its own profile, workspace, requirements and access boundaries.",
      items: [
        {
          title: "Investors",
          description: "Discover, compare and progress relevant opportunities.",
          icon: "investor",
          href: "/solutions/investors",
          action: "Investor journey",
        },
        {
          title: "Property Owners",
          description:
            "Present owned property through a controlled listing route.",
          icon: "building",
          href: "/solutions/property-owners",
          action: "Owner journey",
        },
        {
          title: "Property Agents",
          description:
            "Manage authorised client stock and approved listing activity.",
          icon: "agent",
          href: "/solutions/property-agents",
          action: "Agent journey",
        },
        {
          title: "Property Sourcers",
          description:
            "Package investment-focused opportunities with transparent information.",
          icon: "search",
          href: "/solutions/property-sourcers",
          action: "Sourcer journey",
        },
        {
          title: "Service Providers",
          description:
            "Support property journeys with relevant professional services.",
          icon: "users",
          href: "/solutions/service-providers",
          action: "Provider journey",
        },
        {
          title: "API Partners",
          description:
            "Connect approved products and internal systems through scoped access.",
          icon: "key",
          href: "/api-partners",
          action: "API partnerships",
        },
      ],
    },
    {
      kind: "cards",
      eyebrow: "What makes us different",
      heading:
        "Property sourcing with clearer context and connected next steps.",
      description:
        "The platform combines opportunity discovery with structured information, explainable relevance and controlled progression.",
      items: [
        {
          title: "Relevant Opportunities",
          description:
            "Focus discovery around stated property goals and preferences.",
          icon: "search",
        },
        {
          title: "Clearer Information",
          description:
            "Present facts, calculations and estimates with clearer labels.",
          icon: "clipboard",
        },
        {
          title: "Explainable Matching",
          description:
            "Show why an opportunity may align without promising suitability.",
          icon: "sparkles",
        },
        {
          title: "Connected Progression",
          description:
            "Keep permitted records, communication and next actions together.",
          icon: "check",
        },
      ],
    },
    {
      kind: "split",
      eyebrow: "Intelligence with responsibility",
      heading:
        "Technology supports understanding; people remain responsible for decisions.",
      description:
        "Asancha can organise information, compare opportunities and explain relevance without guaranteeing outcomes.",
      leftTitle: "Intelligence can support",
      leftItems: [
        "Structured property information",
        "Opportunity comparison",
        "Preference alignment",
        "Missing-information signals",
        "Explainable indicators",
      ],
      rightTitle: "It does not guarantee",
      rightItems: [
        "Investment returns",
        "Property value or rental income",
        "Finance or planning approval",
        "Legal or condition outcomes",
        "Transaction completion",
      ],
    },
    {
      kind: "split",
      eyebrow: "Trust by design",
      heading: "Evidence and access should match the action.",
      description:
        "Trust comes from visible boundaries and real platform safeguards—not invented badges or claims.",
      leftTitle: "Structured safeguards",
      leftItems: [
        "Role-specific profiles",
        "Company and authority review",
        "Property and document review",
        "Clear status and correction guidance",
      ],
      rightTitle: "Controlled by default",
      rightItems: [
        "Private seller or tenant data",
        "Protected deal packs",
        "Payment and reservation records",
        "Restricted conversations and analysis",
      ],
    },
    {
      kind: "showcase",
      eyebrow: "People & credibility",
      heading: "Trust should be supported by evidence, not invented claims.",
      description:
        "Asancha publishes its platform policies, access boundaries and contact routes openly. Named founder, team and milestone information will only be added after the business owner supplies and approves it.",
      label: "Company transparency",
      title: "Clear routes to policies, support and accountable contact",
      details: [
        "Public terms, privacy and platform rules",
        "Documented role and access boundaries",
        "Public contact and support routes",
        "No fabricated testimonials, volumes or performance statistics",
      ],
      action: { label: "Contact Asancha", href: "/contact" },
    },
    {
      kind: "route",
      eyebrow: "Start your journey",
      heading: "Choose the route that matches what you want to do.",
      description:
        "Move from the brand story into the relevant product experience.",
      routes: [
        {
          title: "Find opportunities",
          description:
            "Explore published property opportunities and create an investor profile when ready.",
          href: "/marketplace",
          action: "Explore properties",
        },
        {
          title: "List or present property",
          description:
            "Choose the owner, agent or sourcer route that reflects your relationship to the property.",
          href: "/solutions/property-owners",
          action: "View property routes",
        },
        {
          title: "Offer property services",
          description:
            "Create a professional presence around relevant property needs.",
          href: "/solutions/service-providers",
          action: "Explore service providers",
        },
        {
          title: "Integrate with Asancha",
          description:
            "Apply to connect an approved App to selected capabilities.",
          href: "/api-partners",
          action: "Explore API partnerships",
        },
      ],
    },
  ],
  faqs: [
    {
      question: "Is Asancha simply a property-listing website?",
      answer:
        "No. Asancha combines structured sourcing, property intelligence, role-based workflows and controlled progression.",
    },
    {
      question: "Does Asancha replace professional due diligence?",
      answer:
        "No. Platform information and AI-assisted outputs support understanding; users remain responsible for appropriate professional advice and due diligence.",
    },
  ],
  finalCtaHeading: "Find your place in the property journey.",
  finalCtaDescription:
    "Explore opportunities or choose the role that matches what you want to do next.",
} satisfies SolutionPageExperienceProps;
