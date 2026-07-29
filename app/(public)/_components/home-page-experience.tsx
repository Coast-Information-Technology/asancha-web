"use client";

// File: app/(public)/_components/home-page-experience.tsx

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  BookOpenCheck,
  Brain,
  BriefcaseBusiness,
  Building2,
  CalendarCheck,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  Filter,
  KeyRound,
  LineChart,
  LockKeyhole,
  MessageSquareText,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  UsersRound,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";

import { DUMMY_MARKETPLACE_LISTINGS } from "@/src/features/marketplace/constants/marketplace-dummy-data";

const trustIndicators = [
  "UK-focused property opportunities",
  "AI-powered property intelligence",
  "Structured property sourcing",
  "Personalised opportunity matching",
  "Controlled access to sensitive information",
] as const;

const marketplaceFilters = [
  "Location",
  "Minimum price",
  "Maximum price",
  "Property type",
  "Bedrooms",
  "Listing category",
  "Investment strategy",
  "Occupancy status",
  "Expected yield",
  "BMV range",
] as const;

const positioningFeatures = [
  {
    title: "Structured Property Sourcing",
    description:
      "Discover opportunities organised around location, asking price, property type, condition, occupancy, investment strategy, expected performance, and other relevant criteria.",
    icon: Search,
  },
  {
    title: "AI-Powered Property Intelligence",
    description:
      "Use AI-assisted insights to understand available property information, identify important considerations, compare opportunities, and assess how closely a property matches your requirements.",
    icon: Brain,
  },
  {
    title: "Personalised Opportunity Matching",
    description:
      "Create your property preferences and receive relevant opportunities based on your goals, budget, preferred locations, property types, strategies, and investment requirements.",
    icon: Target,
  },
  {
    title: "Trusted Property Workflows",
    description:
      "Move through account setup, property submission, document review, verification, bookings, payments, reservations, and communication using clear structured processes.",
    icon: Workflow,
  },
] as const;

const journeySteps = [
  "Create Your Account",
  "Complete Your Profile",
  "Define Your Requirements",
  "Discover Relevant Opportunities",
  "Understand the Opportunity",
  "Verify and Unlock Access",
  "Take the Next Step",
] as const;

const intelligenceGroups = [
  {
    title: "Property opportunity analysis",
    items: [
      "Asking price",
      "Property type",
      "Location",
      "Property condition",
      "Occupancy",
      "Refurbishment requirements",
      "Rental indicators",
      "Yield and return indicators",
    ],
  },
  {
    title: "Personalised property matching",
    items: [
      "Preferred locations",
      "Budget",
      "Property types",
      "Investment strategy",
      "Desired returns",
      "Occupancy preferences",
      "Funding readiness",
      "Purchase timeline",
    ],
  },
  {
    title: "Responsible AI boundaries",
    items: [
      "No guaranteed property value",
      "No guaranteed investment returns",
      "No guaranteed rental income",
      "No finance or planning approval guarantee",
      "No legal outcome or completion guarantee",
    ],
  },
] as const;

const sourcingCriteria = [
  "Preferred towns, cities, or regions",
  "Minimum and maximum budget",
  "Property type",
  "Minimum bedrooms",
  "Investment strategy",
  "Below-market-value preference",
  "Yield and return expectations",
  "Tenanted or vacant preference",
  "Refurbishment level",
  "Funding method and readiness",
  "Target purchase timeline",
] as const;

const solutionCards = [
  {
    title: "Investors",
    heading: "Find Opportunities That Match Your Strategy",
    description:
      "Create your buying profile, define your requirements, explore opportunities, receive AI-assisted recommendations, and access eligible deal information.",
    href: "/solutions/investors",
    icon: LineChart,
  },
  {
    title: "Property Owners",
    heading: "Present Your Property to Relevant Buyers",
    description:
      "Submit property you own or control, provide supporting information, complete review, and track progress through your property workspace.",
    href: "/solutions/property-owners",
    icon: Building2,
  },
  {
    title: "Property Agents",
    heading: "Connect Property Inventory With Suitable Buyers",
    description:
      "Submit and manage property on behalf of owners, landlords, vendors, or developers while maintaining clear authority and documentation.",
    href: "/solutions/property-agents",
    icon: BadgeCheck,
  },
  {
    title: "Property Sourcers",
    heading: "Submit and Manage Investment-Focused Opportunities",
    description:
      "Package opportunities, provide sourcing details, upload supporting information, and present investment-focused deals through a structured platform.",
    href: "/solutions/property-sourcers",
    icon: Search,
  },
  {
    title: "Service Providers",
    heading: "Support Property Buyers, Sellers, and Transactions",
    description:
      "Provide approved services connected to legal work, finance, inspection, surveying, refurbishment, property management, and other areas of the property process.",
    href: "/solutions/service-providers",
    icon: UsersRound,
  },
  {
    title: "API Partners",
    heading: "Connect Your Property System to Asancha",
    description:
      "Apply for controlled access to approved property data, property intelligence services, usage tools, webhooks, and integration capabilities.",
    href: "/api-partners",
    icon: KeyRound,
  },
] as const;

const trustFeatures = [
  {
    title: "Profile and document review",
    description:
      "Relevant users, companies, submissions, authority records, and supporting documents may be reviewed before sensitive actions are unlocked.",
    icon: FileCheck2,
  },
  {
    title: "Protected deal information",
    description:
      "Private deal packs, seller details, payment information, sensitive documents, and restricted analysis are not exposed through public previews.",
    icon: LockKeyhole,
  },
  {
    title: "Visible progress",
    description:
      "Users can understand whether an item is pending, under review, approved, rejected, on hold, awaiting correction, or awaiting replacement.",
    icon: ClipboardCheck,
  },
  {
    title: "Traceable communication",
    description:
      "Questions, corrections, verification issues, bookings, payments, reservations, and support requests can remain connected to the relevant record.",
    icon: MessageSquareText,
  },
] as const;

const workflowItems = [
  ["Role-specific workspaces", BriefcaseBusiness],
  ["Property-related bookings", CalendarCheck],
  ["Structured support conversations", MessageSquareText],
  ["Document and verification tracking", FileCheck2],
  ["Payment-reference management", Banknote],
  ["Reservation progress", ClipboardCheck],
  ["Property activity updates", Sparkles],
  ["Professional participation", UsersRound],
] as const;

const apiCapabilities = [
  "Approved property information",
  "Approved listing information",
  "Property intelligence services",
  "AI-assisted property analysis",
  "Property recommendation services",
  "Secure API-key management",
  "Usage monitoring",
  "Webhook delivery",
  "Controlled access scopes",
  "Partner documentation",
] as const;

const finalBenefits = [
  "Save properties",
  "Complete property preferences",
  "Receive relevant recommendations",
  "Access a role-specific dashboard",
  "Submit properties or opportunities",
  "Track reviews and verification",
  "Progress towards eligible deal information and actions",
] as const;

const featuredListings = DUMMY_MARKETPLACE_LISTINGS.slice(0, 3);

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
  eyebrow,
  id,
  title,
  description,
}: {
  eyebrow: string;
  id: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm font-bold uppercase tracking-wide text-primary">
        {eyebrow}
      </p>
      <h2
        className="mt-3 text-3xl font-extrabold leading-tight tracking-normal text-foreground sm:text-4xl"
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

function PrimaryLink({
  children,
  href,
}: {
  children: ReactNode;
  href: string;
}) {
  return (
    <Link
      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold !text-white hover:bg-foreground/80 focus:outline-none focus:ring-4 focus:ring-ring/30"
      href={href}
    >
      {children}
      <ArrowRight aria-hidden="true" size={17} strokeWidth={2.5} />
    </Link>
  );
}

function SecondaryLink({
  children,
  href,
}: {
  children: ReactNode;
  href: string;
}) {
  return (
    <Link
      className="inline-flex min-h-12 items-center justify-center rounded-xl border border-border bg-background px-6 py-3 text-sm font-bold text-foreground hover:bg-muted focus:outline-none focus:ring-4 focus:ring-ring/20"
      href={href}
    >
      {children}
    </Link>
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

export function HomePageExperience() {
  return (
    <main className="overflow-x-clip">
      <section className="relative isolate min-h-[calc(100vh-4.5rem)] overflow-hidden bg-foreground text-primary-foreground">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-20 bg-[url('/auth-bg.avif')] bg-cover bg-center"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[rgba(2,6,23,0.76)]"
        />

        <div className="asancha-page-container flex min-h-[calc(100vh-4.5rem)] flex-col justify-center py-16 sm:py-20 lg:py-24">
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
              AI-Powered Property Intelligence and Property Sourcing
            </motion.p>

            <motion.h1
              className="mt-6 max-w-3xl text-3xl font-extrabold leading-tight tracking-normal text-primary-foreground sm:text-4xl lg:text-5xl"
              variants={cardReveal}
            >
              Find Better Property Opportunities With Greater Intelligence
            </motion.h1>

            <motion.p
              className="mt-6 max-w-3xl text-lg leading-8 text-primary-foreground/82 sm:text-xl"
              variants={cardReveal}
            >
              Asancha is a UK-focused, AI-powered property intelligence and
              property sourcing company helping investors discover, understand,
              and access relevant property opportunities.
            </motion.p>

            <motion.p
              className="mt-4 max-w-3xl text-base leading-7 text-primary-foreground/72"
              variants={cardReveal}
            >
              We combine structured property sourcing, organised property
              information, intelligent opportunity matching, verification
              workflows, and AI-assisted insights to help people make
              better-informed property decisions.
            </motion.p>

            <motion.div
              aria-label="Homepage primary actions"
              className="mt-9 flex flex-col gap-3 sm:flex-row"
              variants={cardReveal}
            >
              <PrimaryLink href="/auth/sign-up">Create an Account</PrimaryLink>
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
              Built for investors, property owners, property agents, property
              sourcers, service providers, and approved API partners.
            </motion.p>

            <motion.ul
              className="mt-6 flex flex-wrap gap-3"
              variants={staggerContainer}
            >
              {trustIndicators.map((item) => (
                <motion.li
                  className="inline-flex min-h-9 items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3 text-xs font-bold text-primary-foreground/82 backdrop-blur-md"
                  key={item}
                  variants={cardReveal}
                >
                  <CheckCircle2 aria-hidden="true" size={14} />
                  {item}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        </div>
      </section>

      <AnimatedSection
        className="border-b border-border bg-background"
        labelledBy="homepage-marketplace-heading"
      >
        <div className="asancha-page-container py-16">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <SectionIntro
                description="Explore structured property opportunities across the UK. Search by location, property type, price range, investment strategy, occupancy status, and other important criteria."
                eyebrow="Explore Property Opportunities"
                id="homepage-marketplace-heading"
                title="Find Properties That Match Your Goals"
              />
              <p className="mt-5 text-base leading-7 text-muted-foreground">
                Visitors can browse safe public property previews without an
                account. Creating an account allows users to save properties,
                define preferences, receive recommendations, and progress
                towards eligible deal information and actions.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <PrimaryLink href="/auth/sign-up">Create an Account</PrimaryLink>
                <SecondaryLink href="/marketplace">
                  Explore All Properties
                </SecondaryLink>
              </div>
            </div>

            <motion.div
              className="rounded-2xl border border-border bg-card p-5 shadow-sm"
              variants={staggerContainer}
            >
              <div className="flex min-h-12 items-center gap-3 rounded-xl border border-border bg-background px-4 text-sm font-semibold text-muted-foreground">
                <Search aria-hidden="true" size={18} />
                Search by town, city, postcode, or property type
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {marketplaceFilters.map((filter) => (
                  <motion.span
                    className="inline-flex min-h-9 items-center gap-2 rounded-full border border-border bg-muted px-3 text-xs font-bold text-foreground"
                    key={filter}
                    variants={cardReveal}
                  >
                    <Filter aria-hidden="true" size={13} />
                    {filter}
                  </motion.span>
                ))}
              </div>
              <div className="mt-5 rounded-xl border border-accent bg-accent p-4">
                <h3 className="text-base font-bold text-accent-foreground">
                  Public property previews contain safe, high-level information
                  only.
                </h3>
                <p className="mt-2 text-sm leading-6 text-accent-foreground/82">
                  Detailed deal information, seller details, documents,
                  personalised analysis, reservations, payment actions, and
                  private communication may require profile completion,
                  policies, documents, verification, payment, or approval.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection
        className="bg-muted"
        labelledBy="homepage-positioning-heading"
      >
        <div className="asancha-page-container py-16">
          <SectionIntro
            description="Asancha does more than display property adverts. We help source, organise, analyse, verify, and present property opportunities so investors and property professionals can understand available information more clearly."
            eyebrow="Property Sourcing Powered by Intelligence"
            id="homepage-positioning-heading"
            title="More Than a Property Listing Platform"
          />
          <motion.div
            className="mt-10 grid gap-5 md:grid-cols-2"
            initial="hidden"
            viewport={{ once: true, amount: 0.15 }}
            variants={staggerContainer}
            whileInView="show"
          >
            {positioningFeatures.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </motion.div>
        </div>
      </AnimatedSection>

      <section
        aria-labelledby="homepage-journey-heading"
        className="bg-background"
      >
        <div className="asancha-page-container py-16">
          <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <SectionIntro
                description="Asancha helps investors and property professionals move through property sourcing with clearer information and a more structured process."
                eyebrow="A Clearer Property Journey"
                id="homepage-journey-heading"
                title="From Your Property Goals to Relevant Opportunities"
              />
              <div className="mt-7 flex flex-col gap-3 sm:flex-row lg:flex-col">
                <PrimaryLink href="/auth/sign-up">Create an Account</PrimaryLink>
                <SecondaryLink href="/how-it-works">
                  See How Asancha Works
                </SecondaryLink>
              </div>
            </div>

            <motion.ol
              className="relative grid gap-0 before:absolute before:left-5 before:top-5 before:h-[calc(100%-2.5rem)] before:w-px before:bg-border sm:before:left-6"
              initial="hidden"
              viewport={{ once: true, amount: 0.15 }}
              variants={staggerContainer}
              whileInView="show"
            >
              {journeySteps.map((step, index) => (
                <motion.li
                  className="relative grid grid-cols-[2.5rem_minmax(0,1fr)] gap-4 pb-8 last:pb-0 sm:grid-cols-[3rem_minmax(0,1fr)]"
                  key={step}
                  variants={cardReveal}
                >
                  <span className="relative z-10 grid h-10 w-10 place-items-center rounded-full border border-primary/25 bg-primary text-sm font-extrabold text-background shadow-sm sm:h-12 sm:w-12">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="rounded-xl border border-border bg-card p-5 shadow-sm transition hover:border-primary/40 hover:shadow-md">
                    <h3 className="text-lg font-bold text-card-foreground">
                      {step}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      {index === 0
                        ? "Choose how you want to use Asancha and create your first role-specific profile."
                        : index === 2
                          ? "Investors can provide locations, budget, property types, strategies, yield expectations, funding readiness, and target timeline."
                          : index === 6
                            ? "Save properties, book meetings, submit documents, communicate, or begin eligible reservation processes."
                            : "Move through the relevant profile, discovery, verification, and access steps with clear status and next actions."}
                    </p>
                  </div>
                </motion.li>
              ))}
            </motion.ol>
          </div>
        </div>
      </section>

      <AnimatedSection
        className="border-y border-border bg-card"
        labelledBy="homepage-ai-heading"
      >
        <div className="asancha-page-container py-16">
          <SectionIntro
            description="Property sourcing should involve more than receiving an address, asking price, and a few photographs. Asancha uses AI-powered property intelligence to organise available information, identify relevant considerations, compare opportunities, and explain why a property may suit particular requirements."
            eyebrow="Smarter Property Understanding"
            id="homepage-ai-heading"
            title="Turn Property Information Into Clearer Decisions"
          />
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {intelligenceGroups.map((group) => (
              <div
                className="rounded-xl border border-border bg-background p-6"
                key={group.title}
              >
                <h3 className="text-lg font-bold text-foreground">
                  {group.title}
                </h3>
                <ul className="mt-4 grid gap-2">
                  {group.items.map((item) => (
                    <li
                      className="flex gap-2 text-sm leading-6 text-muted-foreground"
                      key={item}
                    >
                      <CheckCircle2
                        aria-hidden="true"
                        className="mt-1 shrink-0 text-primary"
                        size={15}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <PrimaryLink href="/auth/sign-up">Create an Account</PrimaryLink>
            <SecondaryLink href="/marketplace">Explore Properties</SecondaryLink>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection
        className="bg-muted"
        labelledBy="homepage-sourcing-heading"
      >
        <div className="asancha-page-container py-16">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <SectionIntro
                description="Finding the right property opportunity starts with understanding the buyer. Asancha captures structured information about your goals so available and newly sourced opportunities can be assessed against what matters to you."
                eyebrow="Opportunities Built Around Your Criteria"
                id="homepage-sourcing-heading"
                title="Tell Us What You Are Looking For"
              />
              <p className="mt-5 text-base leading-7 text-muted-foreground">
                The more clearly your requirements are defined, the more
                relevant your property recommendations and sourcing experience
                can become.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <PrimaryLink href="/auth/sign-up">
                  Create an Investor Account
                </PrimaryLink>
                <SecondaryLink href="/solutions/investors">
                  Learn About Investor Solutions
                </SecondaryLink>
              </div>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {sourcingCriteria.map((item) => (
                <li
                  className="flex gap-3 rounded-xl border border-border bg-card p-4 text-sm font-bold text-foreground"
                  key={item}
                >
                  <Target
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
        className="bg-background"
        labelledBy="homepage-solutions-heading"
      >
        <div className="asancha-page-container py-16">
          <SectionIntro
            description="Asancha supports the people who search for, own, represent, source, support, and integrate property opportunities."
            eyebrow="Built for the Property Market"
            id="homepage-solutions-heading"
            title="One Platform for Every Part of the Property Process"
          />
          <motion.div
            className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            viewport={{ once: true, amount: 0.15 }}
            variants={staggerContainer}
            whileInView="show"
          >
            {solutionCards.map((card) => {
              const Icon = card.icon;

              return (
                <motion.article
                  className="group rounded-xl border border-border bg-card p-6 shadow-sm transition hover:border-primary/50 hover:shadow-md"
                  key={card.href}
                  variants={cardReveal}
                  whileHover={{ y: -4 }}
                >
                  <span className="grid h-11 w-11 place-items-center rounded-lg bg-accent text-primary">
                    <Icon aria-hidden="true" size={20} strokeWidth={2.5} />
                  </span>
                  <p className="mt-5 text-sm font-bold uppercase tracking-wide text-primary">
                    {card.title}
                  </p>
                  <h3 className="mt-2 text-lg font-bold text-card-foreground">
                    {card.heading}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {card.description}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <Link
                      className="inline-flex min-h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-bold !text-white hover:bg-primary/80"
                      href={card.title === "API Partners" ? "/api-partner/apply" : "/auth/sign-up"}
                    >
                      {card.title === "API Partners"
                        ? "Apply for API Access"
                        : `Create Account`}
                    </Link>
                    <Link
                      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-border px-4 text-sm font-bold text-foreground hover:bg-muted"
                      href={card.href}
                    >
                      Explore
                      <ArrowRight
                        aria-hidden="true"
                        className="transition group-hover:translate-x-1"
                        size={15}
                      />
                    </Link>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        </div>
      </AnimatedSection>

      <AnimatedSection
        className="border-y border-border bg-card"
        labelledBy="homepage-trust-heading"
      >
        <div className="asancha-page-container py-16">
          <SectionIntro
            description="Property sourcing involves people, documents, property information, financial information, payments, and important decisions. Asancha uses structured profiles, document review, verification, controlled access, status tracking, and platform communication to make the process clearer and more accountable."
            eyebrow="Property Sourcing With Greater Structure"
            id="homepage-trust-heading"
            title="Clear Information. Controlled Access. Traceable Actions."
          />
          <motion.div
            className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4"
            initial="hidden"
            viewport={{ once: true, amount: 0.15 }}
            variants={staggerContainer}
            whileInView="show"
          >
            {trustFeatures.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </motion.div>
          <div className="mt-8 rounded-xl border border-accent bg-accent p-5">
            <p className="text-sm font-semibold leading-6 text-accent-foreground">
              Completing onboarding gives users access to their dashboard. It
              does not automatically approve every sensitive action. Some
              features remain restricted until required verification, policies,
              documents, payments, or reviews are complete.
            </p>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection
        className="bg-background"
        labelledBy="homepage-featured-heading"
      >
        <div className="asancha-page-container py-16">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <SectionIntro
              description="View selected properties and investment-focused opportunities available through Asancha. Public property cards show safe high-level information only."
              eyebrow="Available Opportunities"
              id="homepage-featured-heading"
              title="Explore Featured Property Opportunities"
            />
            <div className="flex flex-col gap-3 sm:flex-row">
              <PrimaryLink href="/auth/sign-up">Create an Account</PrimaryLink>
              <SecondaryLink href="/marketplace">View All Properties</SecondaryLink>
            </div>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {featuredListings.map((listing) => (
              <article
                className="overflow-hidden rounded-xl border border-border bg-card shadow-sm"
                key={listing.listingPublicId}
              >
                <div
                  className="h-48 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${listing.coverImage?.url ?? "/auth-bg.avif"})`,
                  }}
                />
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold text-card-foreground">
                        {listing.title}
                      </h3>
                      <p className="mt-1 text-sm font-semibold text-muted-foreground">
                        {listing.location.displayName}
                      </p>
                    </div>
                    <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-primary">
                      {listing.listingCategory.replaceAll("_", " ")}
                    </span>
                  </div>
                  <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <p className="font-bold text-foreground">
                        £{listing.price?.toLocaleString("en-GB")}
                      </p>
                      <p className="text-muted-foreground">Asking price</p>
                    </div>
                    <div>
                      <p className="font-bold text-foreground">
                        {listing.bedrooms ?? "-"}
                      </p>
                      <p className="text-muted-foreground">Bedrooms</p>
                    </div>
                    <div>
                      <p className="font-bold text-foreground">
                        {listing.investmentMetrics?.grossYieldPercent ?? "-"}%
                      </p>
                      <p className="text-muted-foreground">Yield</p>
                    </div>
                  </div>
                  <Link
                    className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-primary px-5 text-sm font-bold !text-white hover:bg-primary/80"
                    href={`/marketplace/${listing.slug}`}
                  >
                    View Property
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection
        className="bg-muted"
        labelledBy="homepage-workflows-heading"
      >
        <div className="asancha-page-container py-16">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <SectionIntro
              description="A property opportunity may involve an investor, property owner, agent, sourcer, surveyor, solicitor, finance provider, refurbishment specialist, property manager, or the Asancha team."
              eyebrow="Connected Property Workflows"
              id="homepage-workflows-heading"
              title="Property Sourcing Often Involves More Than One Professional"
            />
            <div className="grid gap-3 sm:grid-cols-2">
              {workflowItems.map(([item, Icon]) => (
                <div
                  className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-sm font-bold text-foreground"
                  key={item}
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent text-primary">
                    <Icon aria-hidden="true" size={17} />
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection
        className="bg-background"
        labelledBy="homepage-api-heading"
      >
        <div className="asancha-page-container py-16">
          <div className="grid gap-8 rounded-2xl border border-border bg-card p-6 shadow-sm lg:grid-cols-[1fr_1fr] lg:p-8">
            <div>
              <SectionIntro
                description="Approved API partners can connect their applications, property platforms, and internal systems to selected Asancha property sourcing and property intelligence services."
                eyebrow="Build With Asancha"
                id="homepage-api-heading"
                title="Bring Property Intelligence Into Your Product"
              />
              <p className="mt-5 text-base leading-7 text-muted-foreground">
                API access is controlled through an application, review,
                approval, subscription, scope, API key, usage, and
                webhook-management process.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <PrimaryLink href="/api-partner/apply">
                  Apply for API Access
                </PrimaryLink>
                <SecondaryLink href="/api-partners">
                  Learn About API Partnerships
                </SecondaryLink>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {apiCapabilities.map((item) => (
                <div
                  className="flex gap-3 rounded-xl border border-border bg-muted p-4 text-sm font-bold text-foreground"
                  key={item}
                >
                  <BookOpenCheck
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-primary"
                    size={17}
                  />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      <section
        aria-labelledby="homepage-final-cta-heading"
        className="bg-primary"
      >
        <motion.div
          className="asancha-page-container py-16 text-primary-foreground"
          initial={{ opacity: 0, y: 24 }}
          viewport={{ once: true, amount: 0.25 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-primary-foreground/80">
                <ShieldCheck aria-hidden="true" size={16} strokeWidth={2.5} />
                Start With Your Property Goals
              </p>
              <h2
                className="mt-3 max-w-3xl text-3xl font-extrabold tracking-normal sm:text-4xl"
                id="homepage-final-cta-heading"
              >
                Create Your Asancha Account
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-primary-foreground/80">
                Tell us how you use property, complete your profile, define
                what you are looking for, and start discovering opportunities
                supported by structured property sourcing and AI-powered
                property intelligence.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-foreground px-6 py-3 text-sm font-bold text-background hover:bg-foreground/80 focus:outline-none focus:ring-4 focus:ring-primary-foreground/40"
                  href="/auth/sign-up"
                >
                  Create an Account
                  <ArrowRight aria-hidden="true" size={17} />
                </Link>
                <Link
                  className="inline-flex min-h-12 items-center justify-center rounded-xl border border-primary-foreground/35 px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary-foreground/10 focus:outline-none focus:ring-4 focus:ring-primary-foreground/40"
                  href="/marketplace"
                >
                  Explore Properties
                </Link>
              </div>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {finalBenefits.map((item) => (
                <li
                  className="flex gap-3 rounded-xl border border-primary-foreground/20 bg-primary-foreground/10 p-4 text-sm font-bold text-primary-foreground"
                  key={item}
                >
                  <CheckCircle2
                    aria-hidden="true"
                    className="mt-0.5 shrink-0"
                    size={17}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
