// File: app/(public)/_components/home-page-experience.tsx

import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Calculator,
  CheckCircle2,
  KeyRound,
  Lightbulb,
  LineChart,
  ListChecks,
  LockKeyhole,
  Search,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { MARKETPLACE_STRATEGY_OPTIONS } from "@/src/features/marketplace/constants/marketplace.constants";
import { DUMMY_MARKETPLACE_LISTINGS } from "@/src/features/marketplace/constants/marketplace-dummy-data";

const trustIndicators = [
  "UK-focused property sourcing",
  "Opportunities from owners, agents and sourcers",
  "Explainable investment intelligence",
  "Structured verification and controlled access",
] as const;

const ecosystemRoles = [
  {
    title: "Investors",
    description:
      "Discover, evaluate and progress property opportunities that align with your stated requirements.",
    href: "/solutions/investors",
    icon: LineChart,
  },
  {
    title: "Property Owners",
    description:
      "List property opportunities and reach an investor-focused audience through a controlled submission and publication journey.",
    href: "/solutions/property-owners",
    icon: Building2,
  },
  {
    title: "Property Sourcers",
    description:
      "Submit, package and manage sourced opportunities while retaining appropriate source attribution and progression visibility.",
    href: "/solutions/property-sourcers",
    icon: Search,
  },
  {
    title: "Property Agents",
    description:
      "Connect suitable property stock with an investor-focused audience through the approved supply workflow.",
    href: "/solutions/property-agents",
    icon: BadgeCheck,
  },
  {
    title: "Service Providers",
    description:
      "Support eligible opportunities through professional, verification and transaction-related activity.",
    href: "/solutions/service-providers",
    icon: Wrench,
  },
  {
    title: "API Partners",
    description:
      "Connect approved systems to permitted property sourcing and platform capabilities through controlled API access.",
    href: "/api-partners",
    icon: KeyRound,
  },
] as const;

const journeyPhases = [
  {
    title: "Discover",
    description:
      "Browse public property opportunities and search by location, budget, strategy and other permitted sourcing criteria.",
    icon: Search,
  },
  {
    title: "Evaluate",
    description:
      "Review property information, calculations, estimates and how well an opportunity matches your requirements. Sign in only when a protected capability is required.",
    icon: Calculator,
  },
  {
    title: "Progress",
    description:
      "Complete the requirements relevant to the next protected action, then continue through eligible platform workflows.",
    icon: ArrowRight,
  },
] as const;

const intelligenceMetrics = [
  ["£185,000", "Asking price", "Fact"],
  ["7.5%", "Gross yield", "Calculation"],
  ["£1,200 pcm", "Estimated rent", "Estimate / professional input"],
  ["92% Match", "Personalised alignment", "Algorithmic match"],
] as const;

const matchReasons = [
  ["Within stated budget", "Match criterion", true],
  ["Preferred location", "Match criterion", true],
  ["Refurbishment required", "Consideration", true],
  ["Preferred 3+ bedrooms not met", "Mismatch", false],
] as const;

const trustPillars = [
  ["Verified information where applicable", BadgeCheck],
  ["Controlled access to protected information", LockKeyhole],
  ["Explainable insights and information labels", Lightbulb],
  ["Traceable progression through each stage", ListChecks],
] as const;

const professionalRoutes = [
  ecosystemRoles[3],
  ecosystemRoles[2],
  ecosystemRoles[4],
  ecosystemRoles[5],
] as const;
const featuredListings = DUMMY_MARKETPLACE_LISTINGS.slice(0, 3);

function formatLabel(value: string): string {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
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
      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold !text-white transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-2"
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
  inverted = false,
}: {
  children: ReactNode;
  href: string;
  inverted?: boolean;
}) {
  return (
    <Link
      className={
        inverted
          ? "inline-flex min-h-12 items-center justify-center rounded-xl border border-primary-foreground/35 bg-primary-foreground/10 px-6 py-3 text-sm font-bold text-primary-foreground backdrop-blur-sm transition hover:bg-primary-foreground/20 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-foreground"
          : "inline-flex min-h-12 items-center justify-center rounded-xl border border-border bg-background px-6 py-3 text-sm font-bold text-foreground transition hover:bg-muted focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-2"
      }
      href={href}
    >
      {children}
    </Link>
  );
}

function SectionIntro({
  description,
  eyebrow,
  id,
  title,
}: {
  description?: string;
  eyebrow?: string;
  id: string;
  title: string;
}) {
  return (
    <div className="max-w-3xl">
      {eyebrow ? (
        <p className="text-sm font-bold uppercase tracking-wide text-primary">
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={`${eyebrow ? "mt-3" : ""} text-3xl font-extrabold leading-tight tracking-normal text-foreground sm:text-4xl`}
        id={id}
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-7 text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  );
}

function AnimatedSection({
  children,
  className,
  labelledBy,
}: {
  children: ReactNode;
  className?: string;
  labelledBy: string;
}) {
  return (
    <section aria-labelledby={labelledBy} className={className}>
      {children}
    </section>
  );
}

export function HomePageExperience() {
  return (
    <main className="overflow-x-clip">
      <section
        aria-labelledby="homepage-hero-heading"
        className="relative isolate overflow-hidden bg-foreground text-primary-foreground"
      >
        <Image
          aria-hidden="true"
          alt=""
          className="absolute inset-0 -z-20 object-cover object-[68%_center] sm:object-center"
          fetchPriority="high"
          fill
          loading="eager"
          quality={70}
          sizes="100vw"
          src="/images/og/asancha-homepage-og.jpg"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(2,6,23,0.96)_0%,rgba(2,6,23,0.8)_56%,rgba(2,6,23,0.56)_100%)]"
        />

        <div className="asancha-page-container py-16 sm:py-20 lg:py-24">
          <div className="max-w-5xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-foreground/80 sm:text-sm">
              UK property sourcing &amp; investment platform
            </p>
            <h1
              className="mt-5 max-w-4xl text-4xl font-extrabold leading-tight tracking-normal text-primary-foreground sm:text-5xl lg:text-6xl"
              id="homepage-hero-heading"
            >
              Source Smarter Property Opportunities, All in One Place
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-primary-foreground/82 sm:text-xl">
              Asancha connects investors with property opportunities from
              owners, agents and sourcers - supported by intelligent insights
              and trusted professionals to help evaluate and progress deals with
              confidence.
            </p>
            <nav
              aria-label="Homepage primary actions"
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <PrimaryLink href="/marketplace">Find Properties</PrimaryLink>
              <SecondaryLink href="/solutions/property-owners" inverted>
                List a Property
              </SecondaryLink>
            </nav>

            <form
              action="/marketplace"
              aria-label="Search property opportunities"
              className="mt-9 grid gap-3 rounded-2xl border border-primary-foreground/20 bg-background/95 p-4 text-foreground shadow-2xl backdrop-blur-md md:grid-cols-[1.25fr_0.85fr_1fr_auto]"
              method="get"
            >
              <label className="grid gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Location / postcode
                <input
                  className="min-h-11 rounded-lg border border-border bg-background px-3 text-sm font-semibold text-foreground outline-none placeholder:font-normal focus:border-primary focus:ring-2 focus:ring-primary"
                  name="search"
                  placeholder="Town, city or postcode"
                  type="search"
                />
              </label>
              <label className="grid gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Budget
                <select
                  className="min-h-11 rounded-lg border border-border bg-background px-3 text-sm font-semibold text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary"
                  defaultValue=""
                  name="maximumPrice"
                >
                  <option value="">Any budget</option>
                  <option value="150000">Up to £150,000</option>
                  <option value="250000">Up to £250,000</option>
                  <option value="400000">Up to £400,000</option>
                  <option value="600000">Up to £600,000</option>
                </select>
              </label>
              <label className="grid gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Investment strategy
                <select
                  className="min-h-11 rounded-lg border border-border bg-background px-3 text-sm font-semibold text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary"
                  defaultValue=""
                  name="strategy"
                >
                  <option value="">Any strategy</option>
                  {MARKETPLACE_STRATEGY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <button
                className="mt-auto inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-bold text-primary-foreground transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-2"
                type="submit"
              >
                <Search aria-hidden="true" size={17} />
                Search Properties
              </button>
              <div className="flex flex-col gap-1 md:col-span-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs font-semibold text-muted-foreground">
                  Browse public property opportunities without creating an
                  account.
                </p>
                <Link
                  className="text-xs font-bold text-primary hover:underline"
                  href="/marketplace"
                >
                  More Filters
                </Link>
              </div>
            </form>

            <ul className="mt-6 flex flex-wrap gap-3">
              {trustIndicators.map((item) => (
                <li
                  className="inline-flex min-h-9 items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3 text-xs font-bold text-primary-foreground/82 backdrop-blur-md"
                  key={item}
                >
                  <CheckCircle2 aria-hidden="true" size={14} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <AnimatedSection
        className="border-b border-border bg-muted"
        labelledBy="homepage-featured-heading"
      >
        <div className="asancha-page-container py-16">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <SectionIntro
              description="Browse genuine published opportunities available through Asancha. Compare the key information first, then open a property for deeper facts, permitted investment information and next steps."
              eyebrow="Latest property opportunities"
              id="homepage-featured-heading"
              title="Explore Property Opportunities"
            />
            <SecondaryLink href="/marketplace">
              View All Properties
            </SecondaryLink>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {featuredListings.map((listing) => (
              <article
                className="overflow-hidden rounded-xl border border-border bg-card shadow-sm transition hover:border-primary/40 hover:shadow-md"
                key={listing.listingPublicId}
              >
                <div
                  aria-label={listing.coverImage?.altText ?? listing.title}
                  className="h-52 bg-cover bg-center"
                  role="img"
                  style={{
                    backgroundImage: `url(${listing.coverImage?.url ?? "/auth-bg.avif"})`,
                  }}
                />
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground">
                        {listing.location.displayName}
                      </p>
                      <h3 className="mt-1 text-lg font-bold text-card-foreground">
                        {listing.title}
                      </h3>
                    </div>
                    <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-primary">
                      {formatLabel(listing.calculatedStatus)}
                    </span>
                  </div>
                  <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <dt className="text-xs text-muted-foreground">
                        Asking price · Fact
                      </dt>
                      <dd className="mt-1 font-bold text-foreground">
                        {listing.price === null
                          ? "On application"
                          : `£${listing.price.toLocaleString("en-GB")}`}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">
                        Property type
                      </dt>
                      <dd className="mt-1 font-bold text-foreground">
                        {formatLabel(listing.propertyType)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">
                        Bedrooms
                      </dt>
                      <dd className="mt-1 font-bold text-foreground">
                        {listing.bedrooms ?? "Not stated"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">
                        Gross yield · Calculation
                      </dt>
                      <dd className="mt-1 font-bold text-foreground">
                        {listing.investmentMetrics?.grossYieldPercent ===
                          null ||
                        listing.investmentMetrics?.grossYieldPercent ===
                          undefined
                          ? "Not available"
                          : `${listing.investmentMetrics.grossYieldPercent}%`}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">
                        Estimated rent · Estimate
                      </dt>
                      <dd className="mt-1 font-bold text-foreground">
                        {listing.investmentMetrics?.estimatedMonthlyRent ===
                          null ||
                        listing.investmentMetrics?.estimatedMonthlyRent ===
                          undefined
                          ? "Not available"
                          : `£${listing.investmentMetrics.estimatedMonthlyRent.toLocaleString("en-GB")} pcm`}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">
                        Refurbishment
                      </dt>
                      <dd className="mt-1 font-bold text-foreground">
                        {listing.investmentMetrics?.refurbishmentEstimate
                          ? "Indicated"
                          : "Not indicated"}
                      </dd>
                    </div>
                  </dl>
                  <Link
                    className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold !text-white hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-2"
                    href={`/marketplace/${listing.slug}`}
                  >
                    View Property
                    <ArrowRight aria-hidden="true" size={16} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection
        className="border-b border-border bg-background"
        labelledBy="homepage-journey-heading"
      >
        <div className="asancha-page-container py-16">
          <SectionIntro
            description="Property sourcing stays at the centre. Clear information, explainable matching and controlled progression help you understand each opportunity and what comes next."
            eyebrow="Why Asancha · A clearer property sourcing journey"
            id="homepage-journey-heading"
            title="Discover. Evaluate. Progress."
          />
          <ol className="mt-12 border-y border-border lg:grid lg:grid-cols-3 lg:divide-x lg:divide-y-0 lg:divide-border">
            {journeyPhases.map((phase, index) => (
              <li
                className="grid grid-cols-[auto_1fr] gap-4 border-b border-border py-7 last:border-b-0 lg:block lg:border-b-0 lg:px-6 lg:first:pl-0 lg:last:pr-0"
                key={phase.title}
              >
                <span className="grid h-11 w-11 place-items-center rounded-full bg-accent text-primary">
                  <phase.icon aria-hidden="true" size={19} strokeWidth={2.5} />
                </span>
                <div className="min-w-0 lg:mt-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-primary">
                    Step {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-1 text-xl font-bold text-foreground">
                    {phase.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {phase.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-8">
            <SecondaryLink href="/how-it-works">
              See How Asancha Works
            </SecondaryLink>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection
        className="border-y border-border bg-card"
        labelledBy="homepage-intelligence-heading"
      >
        <div className="asancha-page-container py-16">
          <SectionIntro
            description="See useful outputs in context, with clear labels that separate facts, calculations, estimates, personalised matching and advisory AI insight."
            eyebrow="Investment intelligence"
            id="homepage-intelligence-heading"
            title="Understand More Than the Listing"
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
            <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
              <p className="text-sm font-bold text-primary">
                Example opportunity
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {intelligenceMetrics.map(([value, label, type]) => (
                  <div
                    className="rounded-xl border border-border bg-card p-4"
                    key={label}
                  >
                    <span className="text-[0.68rem] font-bold uppercase tracking-wide text-primary">
                      {type}
                    </span>
                    <p className="mt-2 text-2xl font-extrabold text-foreground">
                      {value}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-sm font-bold text-primary">
                Gross yield: estimated annual rent divided by asking price.
              </p>
            </div>
            <div className="rounded-2xl bg-foreground p-6 text-primary-foreground shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wide text-primary-foreground/65">
                Why this opportunity matches
              </p>
              <ul className="mt-5 grid gap-3">
                {matchReasons.map(([reason, type, positive]) => (
                  <li
                    className="flex items-start gap-3 rounded-xl border border-primary-foreground/15 bg-primary-foreground/10 p-4"
                    key={reason}
                  >
                    {positive ? (
                      <CheckCircle2
                        aria-hidden="true"
                        className="mt-0.5 shrink-0"
                        size={18}
                      />
                    ) : (
                      <span aria-hidden="true" className="font-extrabold">
                        !
                      </span>
                    )}
                    <div>
                      <p className="text-sm font-bold">{reason}</p>
                      <p className="mt-1 text-xs uppercase tracking-wide text-primary-foreground/60">
                        {type}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-5 rounded-xl border border-primary-foreground/15 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-primary-foreground/60">
                  AI insight · Advisory
                </p>
                <p className="mt-2 text-sm leading-6 text-primary-foreground/80">
                  This example appears aligned on budget and location, but the
                  bedroom requirement is not met and refurbishment should be
                  assessed before deciding whether to progress.
                </p>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection
        className="bg-muted"
        labelledBy="homepage-ecosystem-heading"
      >
        <div className="asancha-page-container py-16">
          <SectionIntro
            description="Property sourcing is the entry point. Intelligence, matching, verification, professional support and connected progression make the journey more useful, transparent and actionable."
            id="homepage-ecosystem-heading"
            title="One Platform. Built Around the Property Sourcing Journey."
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
              {ecosystemRoles.slice(0, 2).map((role, index) => (
                <article
                  className={
                    index === 0
                      ? "rounded-2xl bg-foreground p-7 text-primary-foreground shadow-sm"
                      : "rounded-2xl border border-border bg-card p-7 shadow-sm"
                  }
                  key={role.title}
                >
                  <span
                    className={
                      index === 0
                        ? "grid h-12 w-12 place-items-center rounded-xl bg-primary-foreground/10"
                        : "grid h-12 w-12 place-items-center rounded-xl bg-accent text-primary"
                    }
                  >
                    <role.icon aria-hidden="true" size={23} />
                  </span>
                  <h3
                    className={`mt-6 text-2xl font-extrabold ${
                      index === 0 ? "" : "text-card-foreground"
                    }`}
                  >
                    {role.title}
                  </h3>
                  <p
                    className={`mt-3 text-sm leading-6 ${
                      index === 0
                        ? "text-primary-foreground/75"
                        : "text-muted-foreground"
                    }`}
                  >
                    {role.description}
                  </p>
                  <Link
                    className={`mt-6 inline-flex items-center gap-2 text-sm font-bold hover:underline ${
                      index === 0 ? "text-primary-foreground" : "text-primary"
                    }`}
                    href={role.href}
                  >
                    {index === 0 ? "Explore investor route" : "List a property"}
                    <ArrowRight aria-hidden="true" size={15} />
                  </Link>
                </article>
              ))}
            </div>

            <section
              aria-labelledby="homepage-professionals-heading"
              className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8"
            >
              <p className="text-sm font-bold uppercase tracking-wide text-primary">
                Connected expertise
              </p>
              <h3
                className="mt-2 text-2xl font-extrabold text-card-foreground"
                id="homepage-professionals-heading"
              >
                Professional Routes Through Asancha
              </h3>
              <div className="mt-6 divide-y divide-border border-y border-border">
                {professionalRoutes.map((role) => (
                  <article
                    className="grid gap-4 py-5 sm:grid-cols-[auto_1fr_auto] sm:items-center"
                    key={role.title}
                  >
                    <span className="grid h-10 w-10 place-items-center rounded-lg bg-accent text-primary">
                      <role.icon aria-hidden="true" size={19} />
                    </span>
                    <div>
                      <h4 className="font-bold text-card-foreground">
                        {role.title}
                      </h4>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        {role.description}
                      </p>
                    </div>
                    <Link
                      aria-label={`Explore the ${role.title} route`}
                      className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-primary hover:underline"
                      href={role.href}
                    >
                      Explore <ArrowRight aria-hidden="true" size={15} />
                    </Link>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection
        className="bg-background"
        labelledBy="homepage-trust-heading"
      >
        <div className="asancha-page-container py-16">
          <div>
            <SectionIntro
              description="Understand the key trust principles at a glance, with further detail available when you need it."
              eyebrow="Trust & transparency"
              id="homepage-trust-heading"
              title="A Clearer Way to Evaluate and Progress."
            />
          </div>

          <ul className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {trustPillars.map(([title, Icon]) => (
              <li
                className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 shadow-sm"
                key={title}
              >
                <span className="grid h-10 w-10 place-items-center rounded-full bg-accent text-primary">
                  <Icon aria-hidden="true" size={19} />
                </span>
                <p className="text-sm font-bold leading-6 text-foreground">
                  {title}
                </p>
              </li>
            ))}
          </ul>
          <div className="mt-7">
            <SecondaryLink href="/how-it-works">Learn More</SecondaryLink>
          </div>
        </div>
      </AnimatedSection>

      <section
        aria-labelledby="homepage-final-cta-heading"
        className="bg-primary"
      >
        <div className="asancha-page-container py-16 text-primary-foreground">
          <p className="text-sm font-bold uppercase tracking-wide text-primary-foreground/70">
            Find your next property opportunity
          </p>
          <h2
            className="mt-3 text-3xl font-extrabold sm:text-4xl"
            id="homepage-final-cta-heading"
          >
            Ready to Source Smarter?
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-primary-foreground/80">
            Explore public property opportunities now, then create an account
            when you are ready to save, personalise, access protected
            information or progress an eligible opportunity.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-foreground px-6 py-3 text-sm font-bold text-background hover:bg-foreground/80 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
              href="/marketplace"
            >
              Find Properties <ArrowRight aria-hidden="true" size={17} />
            </Link>
            <SecondaryLink href="/auth/sign-up" inverted>
              Create Free Account
            </SecondaryLink>
            <SecondaryLink href="/solutions/property-owners" inverted>
              List a Property
            </SecondaryLink>
          </div>
          <p className="mt-5 flex items-center gap-2 text-sm font-semibold text-primary-foreground/72">
            <ShieldCheck aria-hidden="true" size={16} />
            You can browse public property opportunities without an account.
          </p>
        </div>
      </section>
    </main>
  );
}
