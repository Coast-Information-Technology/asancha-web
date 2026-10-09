import type { SolutionPageExperienceProps } from "./solution-page-experience";

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
      kind: "showcase",
      eyebrow: "Sourced opportunities",
      heading: "See the product, not just the promise.",
      description:
        "Published opportunities appear early so you can understand what Asancha helps you discover.",
      label: "Example opportunity",
      title: "3-bed terrace · Manchester",
      badge: "Published",
      metrics: [
        { label: "Asking price", value: "£185,000" },
        { label: "Est. rent", value: "£1,150 pcm" },
        { label: "Gross yield", value: "7.5%" },
        { label: "Strategy", value: "Buy-to-let" },
      ],
      details: [
        "Tenanted property",
        "Light refurbishment indicated",
        "Investor information available",
        "Match context shown after profile setup",
      ],
      note: dummyNote,
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
      kind: "timeline",
      eyebrow: "Owner workspace",
      heading: "Track status and know what happens next.",
      description: "A submission is not automatically published or verified.",
      items: [
        "Draft",
        "Submitted",
        "Under review",
        "Approved / Action required",
        "Published",
        "Progressing",
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
  title: "Present Client Properties to Relevant Buyers & Investors",
  description:
    "Manage authorised client stock, control listing information and progress enquiries through one structured agent workspace.",
  primaryAction: { label: "Create Agent Account", href: "/auth/sign-up" },
  secondaryAction: {
    label: "Submit a Property",
    href: "/dashboard/property-agent/properties/new",
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
  title: "Present Sourced Property Opportunities to Relevant Investors",
  description:
    "Package investment-focused opportunities, disclose sourcing fees and manage reviewed deals from one sourcer workspace.",
  primaryAction: { label: "Join as a Property Sourcer", href: "/auth/sign-up" },
  secondaryAction: { label: "Explore Properties", href: "/marketplace" },
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
          title: "Survey & Inspection",
          description: "Survey, valuation, inspection and condition services.",
          icon: "search",
        },
        {
          title: "Property Operations",
          description:
            "Refurbishment, planning, management, tax and property marketing.",
          icon: "building",
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
      note: dummyNote,
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
      note: dummyNote,
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
        "Payment-aware actions remain supporting functionality after enquiry and booking management.",
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
      kind: "split",
      eyebrow: "Professional trust",
      heading: "Build trust with the right evidence.",
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
  eyebrow: "Asancha API partners",
  title: "Bring Asancha Property Sourcing & Intelligence into Your Product",
  description:
    "Connect approved Apps and systems to selected Asancha property capabilities through scoped APIs, secure credentials and event-driven integrations.",
  primaryAction: { label: "Apply for API Access", href: "/api-partner/apply" },
  secondaryAction: {
    label: "Explore API Capabilities",
    href: "#solution-section-0",
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
  ],
  finalCtaHeading: "Apply for API access.",
  finalCtaDescription:
    "Tell us about your organisation, proposed App, use case, requested capabilities and security approach.",
} satisfies SolutionPageExperienceProps;

export const aboutPageContent = {
  eyebrow: "About Asancha",
  title: "Building a More Intelligent Way to Source Property",
  description:
    "Asancha is a UK property sourcing platform bringing structured opportunities, clearer intelligence, relevant matching and controlled progression into one connected experience.",
  primaryAction: { label: "Explore Properties", href: "/marketplace" },
  secondaryAction: { label: "See How It Works", href: "/how-it-works" },
  trustIndicators: [
    "UK property focus",
    "Structured sourcing",
    "Explainable intelligence",
    "Controlled access",
  ],
  sections: [
    {
      kind: "showcase",
      eyebrow: "Why Asancha exists",
      heading:
        "Property sourcing should feel connected, clear and trustworthy.",
      description:
        "Property information and next steps are often fragmented across people, documents and systems. Asancha was built to organise that journey without replacing professional judgement.",
      label: "Our purpose",
      title: "Bring the opportunity and the next step together",
      details: [
        "Make opportunities easier to understand",
        "Connect the right property roles",
        "Protect sensitive information",
        "Keep progress visible and traceable",
      ],
    },
    {
      kind: "steps",
      eyebrow: "What Asancha brings together",
      heading: "Source. Understand. Verify. Progress.",
      description:
        "Four connected ideas express the platform more clearly than a long inventory of features.",
      items: [
        {
          title: "Source",
          description:
            "Discover or submit structured UK property opportunities.",
        },
        {
          title: "Understand",
          description:
            "Review clearer information, comparisons and explainable indicators.",
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
        },
        {
          title: "Owners & Agents",
          description:
            "Present owned or represented property through controlled routes.",
          icon: "building",
        },
        {
          title: "Property Sourcers",
          description:
            "Package investment-focused opportunities with transparent information.",
          icon: "search",
        },
        {
          title: "Providers & Partners",
          description:
            "Support the journey with expertise or approved integrations.",
          icon: "users",
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
