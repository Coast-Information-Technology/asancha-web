"use client";

// File: app/(public)/about/_components/about-page-experience.tsx

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Brain,
  Building2,
  CheckCircle2,
  KeyRound,
  Layers3,
  Lightbulb,
  LineChart,
  LockKeyhole,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  UsersRound,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";

const purposeItems = [
  "Location",
  "Asking price",
  "Property type",
  "Condition",
  "Occupancy",
  "Investment strategy",
  "Potential refurbishment",
  "Yield indicators",
  "Return indicators",
  "Supporting documents",
  "Verification status",
  "Relevant professional involvement",
  "Deal progress",
] as const;

const platformCapabilities = [
  "Public property discovery",
  "Structured property sourcing",
  "Property submission and review",
  "Investor preference capture",
  "AI-assisted property analysis",
  "Personalised opportunity matching",
  "Document and verification workflows",
  "Property-related communication",
  "Bookings and meetings",
  "Payments and payment references",
  "Reservations",
  "API partner access",
  "Operational tracking and notifications",
] as const;

const problemCards = [
  ["Inconsistent property information", "Property opportunities may be described differently across sources, making comparison difficult."],
  ["Weak matching", "Investors may receive opportunities that do not align closely with their budget, location, strategy, or buying readiness."],
  ["Limited transparency", "Users may not understand whether information is public, restricted, pending review, approved, or awaiting correction."],
  ["Disconnected processes", "Documents, messages, meetings, payments, and property progress may be managed separately."],
  ["Sensitive-information exposure", "Private seller details, deal packs, financial information, and supporting documents should not be publicly available by default."],
  ["Unclear next steps", "Users need to understand what action is available, what is restricted, and what must be completed before progressing."],
] as const;

const approachPrinciples = [
  {
    title: "Organise the Opportunity",
    description:
      "Property opportunities should be presented using consistent and relevant information, from location and property type to yield indicators and listing status.",
    icon: Layers3,
  },
  {
    title: "Understand the User",
    description:
      "Relevant property sourcing depends on understanding locations, budget, strategies, returns, funding readiness, and purchase timeline.",
    icon: Target,
  },
  {
    title: "Use AI to Support Understanding",
    description:
      "AI can help organise information, compare opportunities, identify relevant characteristics, and explain how a property may match preferences.",
    icon: Brain,
  },
  {
    title: "Protect Sensitive Information",
    description:
      "Public property previews remain safe and high-level while private deal packs, seller information, documents, and restricted analysis stay controlled.",
    icon: LockKeyhole,
  },
  {
    title: "Keep Actions Traceable",
    description:
      "Document review, verification, bookings, payments, reservations, and communication should remain connected to the relevant record.",
    icon: Workflow,
  },
] as const;

const intelligenceItems = [
  "Organising property information",
  "Identifying missing or relevant details",
  "Comparing property opportunities",
  "Matching properties to investor preferences",
  "Highlighting investment characteristics",
  "Explaining recommendation criteria",
  "Supporting property analysis",
  "Tracking recommendation history",
  "Capturing user feedback",
  "Improving future opportunity matching",
] as const;

const responsibleAiBoundaries = [
  "Investment returns",
  "Property appreciation",
  "Rental income",
  "Finance approval",
  "Planning approval",
  "Legal outcomes",
  "Property condition",
  "Resale performance",
  "Transaction completion",
] as const;

const sourcingModel = [
  "Publicly available opportunities",
  "Direct property-owner submissions",
  "Property-agent submissions",
  "Property-sourcer submissions",
  "Approved partner data",
  "Internally reviewed property opportunities",
  "Investment-focused opportunities",
  "Relevant professional services",
] as const;

const audienceCards = [
  {
    title: "Investors",
    heading: "Discover and Understand Relevant Opportunities",
    description:
      "Define property requirements, explore available opportunities, save properties, receive recommendations, and progress towards eligible deal information and actions.",
    href: "/solutions/investors",
    icon: LineChart,
  },
  {
    title: "Property Owners",
    heading: "Present Properties Through a Structured Process",
    description:
      "Submit property you own or control, provide supporting information, complete required reviews, and track property progress.",
    href: "/solutions/property-owners",
    icon: Building2,
  },
  {
    title: "Property Agents",
    heading: "Manage Property on Behalf of Others",
    description:
      "Submit and manage property on behalf of owners, landlords, vendors, or developers while providing authority and relevant documentation.",
    href: "/solutions/property-agents",
    icon: BadgeCheck,
  },
  {
    title: "Property Sourcers",
    heading: "Package Investment-Focused Opportunities",
    description:
      "Submit and manage property deals, provide sourcing information, upload relevant documents, and present opportunities to suitable investors.",
    href: "/solutions/property-sourcers",
    icon: Search,
  },
  {
    title: "Service Providers",
    heading: "Support Property Decisions and Transactions",
    description:
      "Present approved services connected to legal work, finance, surveys, inspections, refurbishment, management, and other areas of the property process.",
    href: "/solutions/service-providers",
    icon: UsersRound,
  },
  {
    title: "API Partners",
    heading: "Connect Approved Systems and Services",
    description:
      "Apply for controlled access to selected property, listing, usage, webhook, and property-intelligence capabilities.",
    href: "/api-partners",
    icon: KeyRound,
  },
] as const;

const reviewFeatures = [
  ["Profile review", "Some profile types may require supporting information or verification before sensitive actions are unlocked."],
  ["Company review", "Companies and their representatives may need registration information, authority, and supporting documents."],
  ["Property review", "Property submissions may require review before publication or before certain information becomes available."],
  ["Document review", "Documents may be pending, under review, approved, rejected, on hold, awaiting correction, or awaiting replacement."],
  ["Controlled access", "Sensitive information may require authentication, completed profile, policy acceptance, verification, supporting documents, payment, approval, or relevant property status."],
  ["Clear user guidance", "When an action is restricted, users should understand why, what must be completed, and what they can do next."],
] as const;

const differences = [
  "Property sourcing and intelligence together",
  "Multiple property roles",
  "Dashboard access without pretending approval",
  "Explainable recommendations",
  "Controlled API access",
  "Traceable operational workflows",
] as const;

const principles = [
  "Clarity",
  "Relevance",
  "Structure",
  "Trust",
  "Explainability",
  "Responsibility",
  "Traceability",
  "Role awareness",
] as const;

const directionItems = [
  "Better property discovery",
  "More relevant opportunity matching",
  "Structured property submissions",
  "Clearer property information",
  "Explainable AI-assisted insights",
  "Safer access to sensitive information",
  "Better-connected property professionals",
  "Controlled API integrations",
  "Traceable property workflows",
  "Stronger operational oversight",
] as const;

const sectionReveal = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
} as const;

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
} as const;

const cardReveal = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
} as const;

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  labelledBy?: string;
}

function AnimatedSection({
  children,
  className,
  labelledBy,
}: AnimatedSectionProps) {
  return (
    <motion.section
      aria-labelledby={labelledBy}
      className={className}
      initial="hidden"
      viewport={{ once: true, amount: 0.18 }}
      variants={sectionReveal}
      whileInView="show"
    >
      {children}
    </motion.section>
  );
}

function SectionIntro({
  description,
  eyebrow,
  id,
  title,
}: {
  description: string;
  eyebrow: string;
  id: string;
  title: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm font-bold uppercase tracking-wide text-primary">
        {eyebrow}
      </p>
      <h2
        className="mt-3 text-3xl font-extrabold tracking-normal text-foreground sm:text-4xl"
        id={id}
      >
        {title}
      </h2>
      <p className="mt-4 text-base leading-7 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function FeatureCard({
  description,
  icon: Icon,
  title,
}: {
  description: string;
  icon: LucideIcon;
  title: string;
}) {
  return (
    <motion.article
      className="rounded-xl border border-border bg-card p-6 shadow-sm transition hover:border-primary/45 hover:shadow-md"
      variants={cardReveal}
      whileHover={{ y: -4 }}
    >
      <span className="grid h-11 w-11 place-items-center rounded-lg bg-accent text-primary">
        <Icon aria-hidden="true" size={20} strokeWidth={2.5} />
      </span>
      <h3 className="mt-5 text-lg font-bold text-card-foreground">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </motion.article>
  );
}

export function AboutPageExperience() {
  return (
    <main className="overflow-x-clip">
      <section className="relative isolate overflow-hidden bg-foreground text-primary-foreground">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-20 bg-[url('/auth-bg.avif')] bg-cover bg-center"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[rgba(2,6,23,0.76)]"
        />

        <div className="asancha-page-container py-20 sm:py-28">
          <motion.div
            animate="show"
            className="max-w-5xl"
            initial="hidden"
            variants={staggerContainer}
          >
            <motion.p
              className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-4 py-2 text-xs font-bold uppercase tracking-wide text-primary-foreground/85 backdrop-blur-md"
              variants={cardReveal}
            >
              <Sparkles aria-hidden="true" size={14} strokeWidth={2.5} />
              About Asancha
            </motion.p>
            <motion.h1
              className="mt-6 max-w-4xl text-4xl font-extrabold leading-tight tracking-normal sm:text-6xl"
              variants={cardReveal}
            >
              Building a More Intelligent Way to Source Property
            </motion.h1>
            <motion.p
              className="mt-6 max-w-3xl text-lg leading-8 text-primary-foreground/80"
              variants={cardReveal}
            >
              Asancha is a UK-focused, AI-powered property intelligence and
              property sourcing company. We are building a structured property
              platform that helps investors discover relevant opportunities and
              helps property professionals present and manage those
              opportunities more effectively.
            </motion.p>
            <motion.p
              className="mt-4 max-w-3xl text-base leading-7 text-primary-foreground/70"
              variants={cardReveal}
            >
              Our aim is to make property opportunities easier to understand,
              compare, verify, manage, and act on.
            </motion.p>
            <motion.div
              className="mt-9 flex flex-col gap-3 sm:flex-row"
              variants={cardReveal}
            >
              <Link
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-foreground px-6 py-3 text-sm font-bold text-background hover:bg-foreground/80 focus:outline-none focus:ring-4 focus:ring-primary-foreground/30"
                href="/auth/sign-up"
              >
                Create an Account
                <ArrowRight aria-hidden="true" size={17} strokeWidth={2.5} />
              </Link>
              <Link
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-primary-foreground/35 bg-primary-foreground/10 px-6 py-3 text-sm font-bold text-primary-foreground backdrop-blur-sm hover:bg-primary-foreground/20 focus:outline-none focus:ring-4 focus:ring-primary-foreground/30"
                href="/marketplace"
              >
                Explore Properties
              </Link>
            </motion.div>
            <motion.p
              className="mt-7 max-w-3xl text-sm font-semibold leading-6 text-primary-foreground/74"
              variants={cardReveal}
            >
              Property sourcing should be supported by better information,
              clearer processes, and technology that helps people make more
              informed decisions.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <AnimatedSection
        className="border-b border-border bg-background"
        labelledBy="about-purpose-heading"
      >
        <div className="asancha-page-container py-16">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <SectionIntro
              description="The property market contains valuable opportunities, but the information around those opportunities is often fragmented. Asancha exists to bring greater structure to that process."
              eyebrow="Why Asancha Exists"
              id="about-purpose-heading"
              title="Property Opportunities Should Be Easier to Understand"
            />
            <ul className="grid gap-3 sm:grid-cols-2">
              {purposeItems.map((item) => (
                <li
                  className="flex gap-3 rounded-xl border border-border bg-card p-4 text-sm font-bold text-card-foreground"
                  key={item}
                >
                  <CheckCircle2
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-primary"
                    size={17}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection
        className="bg-muted"
        labelledBy="about-platform-heading"
      >
        <div className="asancha-page-container py-16">
          <SectionIntro
            description="Asancha is not simply a property-listing website. It is being developed as a structured property sourcing and property intelligence platform for the UK market."
            eyebrow="Our Platform"
            id="about-platform-heading"
            title="Property Sourcing, Intelligence and Technology in One Place"
          />
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {platformCapabilities.map((item) => (
              <div
                className="rounded-xl border border-border bg-card p-4 text-sm font-bold text-card-foreground shadow-sm"
                key={item}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection
        className="bg-background"
        labelledBy="about-problem-heading"
      >
        <div className="asancha-page-container py-16">
          <SectionIntro
            description="Property sourcing often depends on information passing through multiple people and systems. Asancha is designed to reduce this fragmentation by connecting the property opportunity to its relevant information, users, documents, reviews, payments, bookings, communications, and activities."
            eyebrow="The Property Sourcing Challenge"
            id="about-problem-heading"
            title="Too Much Property Information Is Still Scattered"
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {problemCards.map(([title, description]) => (
              <article
                className="rounded-xl border border-border bg-card p-5 shadow-sm"
                key={title}
              >
                <h3 className="text-lg font-bold text-card-foreground">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="bg-card" labelledBy="about-approach-heading">
        <div className="asancha-page-container py-16">
          <SectionIntro
            description="Asancha’s approach is based on combining clear property information with technology that supports better decision-making."
            eyebrow="How We Work"
            id="about-approach-heading"
            title="Structure First. Intelligence Where It Helps."
          />
          <motion.div
            className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-5"
            initial="hidden"
            viewport={{ once: true, amount: 0.15 }}
            variants={staggerContainer}
            whileInView="show"
          >
            {approachPrinciples.map((principle) => (
              <FeatureCard key={principle.title} {...principle} />
            ))}
          </motion.div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="bg-muted" labelledBy="about-ai-heading">
        <div className="asancha-page-container py-16">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <SectionIntro
                description="Traditional property listings usually provide a description, price, photographs, and basic property information. Asancha’s property intelligence approach is designed to help users understand an opportunity in greater context."
                eyebrow="Our Intelligence Layer"
                id="about-ai-heading"
                title="Helping Users See More Than the Listing"
              />
              <div className="mt-8 rounded-xl border border-accent bg-accent p-5">
                <h3 className="text-lg font-bold text-accent-foreground">
                  Responsible AI statement
                </h3>
                <p className="mt-3 text-sm leading-6 text-accent-foreground">
                  Asancha’s AI-powered property intelligence provides
                  supporting information, analysis, matching, and
                  recommendations. Users remain responsible for legal,
                  financial, tax, valuation, survey, planning, and property due
                  diligence.
                </p>
              </div>
            </div>
            <div className="grid gap-5 lg:grid-cols-2">
              <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <h3 className="text-lg font-bold text-card-foreground">
                  AI-assisted features may help with
                </h3>
                <ul className="mt-4 grid gap-2">
                  {intelligenceItems.map((item) => (
                    <li className="text-sm text-muted-foreground" key={item}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <h3 className="text-lg font-bold text-card-foreground">
                  It does not guarantee
                </h3>
                <ul className="mt-4 grid gap-2">
                  {responsibleAiBoundaries.map((item) => (
                    <li className="text-sm text-muted-foreground" key={item}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="bg-background" labelledBy="about-sourcing-heading">
        <div className="asancha-page-container py-16">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <SectionIntro
              description="The purpose of property sourcing is not simply to show the largest possible number of properties. It is to help identify opportunities that are relevant to the buyer’s goals."
              eyebrow="Our Sourcing Model"
              id="about-sourcing-heading"
              title="Relevant Opportunities, Not Just More Listings"
            />
            <ul className="grid gap-3 sm:grid-cols-2">
              {sourcingModel.map((item) => (
                <li
                  className="flex gap-3 rounded-xl border border-border bg-card p-4 text-sm font-bold text-card-foreground"
                  key={item}
                >
                  <Search
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-primary"
                    size={17}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="bg-card" labelledBy="about-community-heading">
        <div className="asancha-page-container py-16">
          <SectionIntro
            description="Asancha supports different users across the property process. Each user type has a separate role, profile, workspace, requirements, and access level."
            eyebrow="Our Property Community"
            id="about-community-heading"
            title="Built for the People Behind Property Opportunities"
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {audienceCards.map((card) => {
              const Icon = card.icon;

              return (
                <article
                  className="rounded-xl border border-border bg-background p-6 shadow-sm"
                  key={card.href}
                >
                  <span className="grid h-11 w-11 place-items-center rounded-lg bg-accent text-primary">
                    <Icon aria-hidden="true" size={20} />
                  </span>
                  <p className="mt-5 text-sm font-bold uppercase tracking-wide text-primary">
                    {card.title}
                  </p>
                  <h3 className="mt-2 text-lg font-bold text-foreground">
                    {card.heading}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {card.description}
                  </p>
                  <Link
                    className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-hover"
                    href={card.href}
                  >
                    Learn more
                    <ArrowRight aria-hidden="true" size={15} />
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="bg-muted" labelledBy="about-trust-heading">
        <div className="asancha-page-container py-16">
          <SectionIntro
            description="Property platforms handle personal information, property information, documents, payments, business relationships, and important decisions. Asancha is designed to support structured review and controlled access."
            eyebrow="Built With Greater Accountability"
            id="about-trust-heading"
            title="Trust Requires More Than a Badge"
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {reviewFeatures.map(([title, description]) => (
              <article
                className="rounded-xl border border-border bg-card p-5 shadow-sm"
                key={title}
              >
                <h3 className="text-lg font-bold text-card-foreground">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="bg-background" labelledBy="about-difference-heading">
        <div className="asancha-page-container py-16">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <SectionIntro
              description="Asancha is being built around the idea that a property opportunity is more than a listing card. It may involve the property itself, representatives, investor criteria, documents, analysis, verification, services, meetings, payments, reservations, communication, and activity history."
              eyebrow="Our Difference"
              id="about-difference-heading"
              title="A Property Platform Designed Around the Whole Opportunity"
            />
            <ul className="grid gap-3 sm:grid-cols-2">
              {differences.map((item) => (
                <li
                  className="flex gap-3 rounded-xl border border-border bg-card p-4 text-sm font-bold text-card-foreground"
                  key={item}
                >
                  <Lightbulb
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-primary"
                    size={17}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="bg-card" labelledBy="about-principles-heading">
        <div className="asancha-page-container py-16">
          <SectionIntro
            description="These principles guide how Asancha is being developed and how new capabilities should continue to behave."
            eyebrow="How We Are Building Asancha"
            id="about-principles-heading"
            title="The Principles Behind the Platform"
          />
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {principles.map((principle) => (
              <div
                className="rounded-xl border border-border bg-background p-5 text-sm font-bold text-foreground shadow-sm"
                key={principle}
              >
                {principle}
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="bg-muted" labelledBy="about-direction-heading">
        <div className="asancha-page-container py-16">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <SectionIntro
              description="Asancha is being developed as more than a public property marketplace. Its long-term direction is to build property intelligence and sourcing infrastructure that supports clearer, safer, and more connected property decisions."
              eyebrow="Where Asancha Is Going"
              id="about-direction-heading"
              title="Building the Infrastructure Behind Better Property Decisions"
            />
            <ul className="grid gap-3 sm:grid-cols-2">
              {directionItems.map((item) => (
                <li
                  className="rounded-xl border border-border bg-card p-4 text-sm font-bold text-card-foreground shadow-sm"
                  key={item}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </AnimatedSection>

      <section className="bg-primary" aria-labelledby="about-final-cta-heading">
        <motion.div
          className="asancha-page-container py-16 text-primary-foreground"
          initial={{ opacity: 0, y: 24 }}
          viewport={{ once: true, amount: 0.25 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-primary-foreground/80">
                <ShieldCheck aria-hidden="true" size={16} strokeWidth={2.5} />
                Start Your Property Journey
              </p>
              <h2
                className="mt-3 max-w-3xl text-3xl font-extrabold tracking-normal sm:text-4xl"
                id="about-final-cta-heading"
              >
                Join Asancha
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-primary-foreground/80">
                Create an account, choose how you use property, complete your
                profile, and begin exploring opportunities supported by
                structured property sourcing and AI-powered property
                intelligence.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <Link
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-foreground px-6 py-3 text-sm font-bold text-background hover:bg-foreground/80"
                href="/auth/sign-up"
              >
                Create an Account
              </Link>
              <Link
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-primary-foreground/35 px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary-foreground/10"
                href="/marketplace"
              >
                Explore Properties
              </Link>
              <Link
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-primary-foreground/35 px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary-foreground/10"
                href="/api-partner/apply"
              >
                Apply for API Access
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
