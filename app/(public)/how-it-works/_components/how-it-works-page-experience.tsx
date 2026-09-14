"use client";

// File: app/(public)/how-it-works/_components/how-it-works-page-experience.tsx

import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  FileSearch,
  Handshake,
  House,
  KeyRound,
  Landmark,
  ListChecks,
  Search,
  ShieldCheck,
  UserRound,
  UsersRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

const mainJourney = [
  {
    number: "01",
    title: "Discover",
    description:
      "Browse property opportunities sourced from owners, agents and property sourcers.",
    icon: Search,
  },
  {
    number: "02",
    title: "Evaluate",
    description:
      "Review property information, investment calculations and estimates, and understand how an opportunity fits your requirements.",
    icon: BarChart3,
  },
  {
    number: "03",
    title: "Progress",
    description:
      "Sign in when required to save opportunities, access eligible protected information and take the next available action.",
    icon: ArrowRight,
  },
] as const;

const roleJourneys = [
  {
    title: "Investors",
    subtitle: "Find & Evaluate Opportunities",
    description:
      "Discover properties, define investment requirements, evaluate opportunities and progress suitable deals.",
    linkLabel: "Explore Investor Journey",
    href: "/solutions/investors",
    icon: Landmark,
  },
  {
    title: "Property Owners",
    subtitle: "List a Property",
    description:
      "Submit a property, complete required checks and reach relevant investors.",
    linkLabel: "Explore Owner Journey",
    href: "/solutions/property-owners",
    icon: House,
  },
  {
    title: "Property Sourcers",
    subtitle: "Submit Sourced Opportunities",
    description:
      "Bring sourced investment opportunities to Asancha, manage deal information and progress opportunities.",
    linkLabel: "Explore Sourcer Journey",
    href: "/solutions/property-sourcers",
    icon: FileSearch,
  },
  {
    title: "Property Agents",
    subtitle: "List & Manage Opportunities",
    description:
      "Submit properties you are authorised to represent and manage their progression.",
    linkLabel: "Explore Agent Journey",
    href: "/solutions/property-agents",
    icon: Building2,
  },
  {
    title: "Service Providers",
    subtitle: "Support Property Progression",
    description:
      "Provide relevant professional services to users progressing property opportunities.",
    linkLabel: "Explore Professional Services",
    href: "/solutions/service-providers",
    icon: BriefcaseBusiness,
  },
] as const;

const opportunitySources = [
  {
    title: "Property Owners",
    description: "List properties they own or control.",
    icon: UserRound,
  },
  {
    title: "Property Agents",
    description: "Submit properties they are authorised to represent.",
    icon: Building2,
  },
  {
    title: "Property Sourcers",
    description: "Bring sourced investment opportunities.",
    icon: UsersRound,
  },
  {
    title: "Approved Partners",
    description:
      "Provide property opportunities or information through approved partnerships or integrations where applicable.",
    icon: Handshake,
  },
] as const;

const submissionStages = [
  { title: "Submit", icon: ListChecks },
  { title: "Review", icon: ClipboardCheck },
  { title: "Publish", icon: CheckCircle2 },
  { title: "Progress", icon: ArrowRight },
] as const;

const protectedJourney = [
  {
    title: "Browse Publicly",
    description:
      "Explore available public property opportunities without creating an account.",
    icon: Search,
  },
  {
    title: "Access When Eligible",
    description:
      "Sign in and complete the required checks to access eligible protected information.",
    icon: KeyRound,
  },
  {
    title: "Progress Securely",
    description:
      "Take appropriate property or deal actions through your Asancha account.",
    icon: ShieldCheck,
  },
] as const;

const sectionReveal = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
} as const;

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
} as const;

const cardReveal = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
  },
} as const;

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  labelledBy: string;
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
      variants={sectionReveal}
      viewport={{ once: true, amount: 0.16 }}
      whileInView="show"
    >
      {children}
    </motion.section>
  );
}

export function HowItWorksPageExperience() {
  return (
    <main className="overflow-x-clip">
      <section className="relative isolate overflow-hidden bg-foreground text-primary-foreground">
        <Image
          alt="UK residential properties representing opportunities available through Asancha"
          className="-z-20 object-cover object-center"
          fetchPriority="high"
          fill
          loading="eager"
          priority
          sizes="100vw"
          src="/images/og/asancha-homepage-og.jpg"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(2,6,23,0.97)_0%,rgba(2,6,23,0.85)_52%,rgba(2,6,23,0.54)_100%)]"
        />

        <div className="asancha-page-container py-20 sm:py-28">
          <div className="max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
              How Asancha works
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-extrabold leading-tight tracking-normal sm:text-6xl">
              A Simpler Way to Source and Progress Property Opportunities
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-primary-foreground/82">
              Asancha connects investors with property opportunities from
              owners, agents and sourcers, with investment insights and a
              structured process to help evaluate and progress suitable
              opportunities.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary-hover focus:outline-none focus:ring-4 focus:ring-primary-foreground/30"
                href="/marketplace"
              >
                Find Properties
                <ArrowRight aria-hidden="true" size={17} strokeWidth={2.5} />
              </Link>
              <Link
                className="inline-flex min-h-12 cursor-pointer items-center justify-center rounded-xl border border-primary-foreground/40 bg-primary-foreground/10 px-6 py-3 text-sm font-bold text-primary-foreground backdrop-blur-sm transition-colors hover:bg-primary-foreground/20 focus:outline-none focus:ring-4 focus:ring-primary-foreground/30"
                href="/list-property"
              >
                List a Property
              </Link>
            </div>
          </div>
        </div>
      </section>

      <AnimatedSection
        className="border-b border-border bg-background"
        labelledBy="main-journey-heading"
      >
        <div className="asancha-page-container py-16 sm:py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">
              The Asancha journey
            </p>
            <h2
              className="mt-3 text-3xl font-extrabold tracking-normal text-foreground sm:text-4xl"
              id="main-journey-heading"
            >
              Discover. Evaluate. Progress.
            </h2>
          </div>

          <motion.ol
            className="mt-10 grid gap-5 lg:grid-cols-3"
            initial="hidden"
            variants={staggerContainer}
            viewport={{ once: true, amount: 0.15 }}
            whileInView="show"
          >
            {mainJourney.map((step) => {
              const Icon = step.icon;

              return (
                <motion.li
                  className="relative rounded-2xl border border-border bg-card p-6 shadow-sm"
                  key={step.title}
                  variants={cardReveal}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-extrabold text-primary">
                      {step.number}
                    </span>
                    <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                      <Icon aria-hidden="true" size={21} strokeWidth={2.2} />
                    </span>
                  </div>
                  <h3 className="mt-6 text-xl font-extrabold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {step.description}
                  </p>
                </motion.li>
              );
            })}
          </motion.ol>
        </div>
      </AnimatedSection>

      <AnimatedSection
        className="bg-muted/35"
        labelledBy="choose-your-journey-heading"
      >
        <div
          className="asancha-page-container py-16 sm:py-20"
          id="choose-your-journey"
        >
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">
              Choose your journey
            </p>
            <h2
              className="mt-3 text-3xl font-extrabold tracking-normal text-foreground sm:text-4xl"
              id="choose-your-journey-heading"
            >
              Start with what you want to achieve.
            </h2>
          </div>

          <motion.div
            className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            variants={staggerContainer}
            viewport={{ once: true, amount: 0.1 }}
            whileInView="show"
          >
            {roleJourneys.map((role) => {
              const Icon = role.icon;

              return (
                <motion.article
                  className="flex min-h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-sm"
                  key={role.title}
                  variants={cardReveal}
                >
                  <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Icon aria-hidden="true" size={21} strokeWidth={2.2} />
                  </span>
                  <h3 className="mt-5 text-xl font-extrabold text-foreground">
                    {role.title}
                  </h3>
                  <p className="mt-1 text-sm font-bold text-primary">
                    {role.subtitle}
                  </p>
                  <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">
                    {role.description}
                  </p>
                  <Link
                    className="mt-6 inline-flex cursor-pointer items-center gap-2 text-sm font-bold text-foreground transition-colors hover:text-primary focus:outline-none focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-primary"
                    href={role.href}
                  >
                    {role.linkLabel}
                    <ArrowRight aria-hidden="true" size={16} />
                  </Link>
                </motion.article>
              );
            })}
          </motion.div>
        </div>
      </AnimatedSection>

      <AnimatedSection
        className="border-y border-border bg-background"
        labelledBy="opportunity-sources-heading"
      >
        <div className="asancha-page-container py-16 sm:py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">
              Multiple sourcing channels
            </p>
            <h2
              className="mt-3 text-3xl font-extrabold tracking-normal text-foreground sm:text-4xl"
              id="opportunity-sources-heading"
            >
              Where Property Opportunities Come From
            </h2>
          </div>

          <motion.div
            className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
            initial="hidden"
            variants={staggerContainer}
            viewport={{ once: true, amount: 0.12 }}
            whileInView="show"
          >
            {opportunitySources.map((source) => {
              const Icon = source.icon;

              return (
                <motion.article
                  className="rounded-2xl border border-border bg-card p-6"
                  key={source.title}
                  variants={cardReveal}
                >
                  <Icon
                    aria-hidden="true"
                    className="text-primary"
                    size={25}
                    strokeWidth={2}
                  />
                  <h3 className="mt-5 text-lg font-extrabold text-foreground">
                    {source.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {source.description}
                  </p>
                </motion.article>
              );
            })}
          </motion.div>
        </div>
      </AnimatedSection>

      <AnimatedSection
        className="bg-foreground text-primary-foreground"
        labelledBy="submission-heading"
      >
        <div className="asancha-page-container py-16 sm:py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">
              From submission to opportunity
            </p>
            <h2
              className="mt-3 text-3xl font-extrabold tracking-normal sm:text-4xl"
              id="submission-heading"
            >
              Submit. Review. Publish. Progress.
            </h2>
            <p className="mt-5 text-base leading-7 text-primary-foreground/72">
              Property submissions are reviewed before publication. Depending on
              the opportunity, Asancha may check property information,
              authority, supporting documents and other relevant information
              before it becomes available to investors.
            </p>
          </div>

          <motion.ol
            className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
            initial="hidden"
            variants={staggerContainer}
            viewport={{ once: true, amount: 0.15 }}
            whileInView="show"
          >
            {submissionStages.map((stage, index) => {
              const Icon = stage.icon;

              return (
                <motion.li
                  className="rounded-2xl border border-primary-foreground/15 bg-primary-foreground/7 p-5"
                  key={stage.title}
                  variants={cardReveal}
                >
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground">
                      <Icon aria-hidden="true" size={19} strokeWidth={2.2} />
                    </span>
                    <div>
                      <p className="text-xs font-bold text-primary-foreground/55">
                        0{index + 1}
                      </p>
                      <h3 className="font-extrabold">{stage.title}</h3>
                    </div>
                  </div>
                </motion.li>
              );
            })}
          </motion.ol>
        </div>
      </AnimatedSection>

      <AnimatedSection
        className="bg-background"
        labelledBy="protected-progression-heading"
      >
        <div className="asancha-page-container py-16 sm:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">
              Public discovery. Protected progression.
            </p>
            <h2
              className="mt-3 text-3xl font-extrabold tracking-normal text-foreground sm:text-4xl"
              id="protected-progression-heading"
            >
              Explore openly. Progress with appropriate access.
            </h2>
            <p className="mt-5 text-base leading-7 text-muted-foreground">
              Some property information and actions require an account,
              verification or appropriate access to help protect property
              owners, investors and deal information.
            </p>
          </div>

          <motion.div
            className="mt-10 grid gap-5 lg:grid-cols-3"
            initial="hidden"
            variants={staggerContainer}
            viewport={{ once: true, amount: 0.15 }}
            whileInView="show"
          >
            {protectedJourney.map((item) => {
              const Icon = item.icon;

              return (
                <motion.article
                  className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm"
                  key={item.title}
                  variants={cardReveal}
                >
                  <span className="mx-auto grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Icon aria-hidden="true" size={22} strokeWidth={2.2} />
                  </span>
                  <h3 className="mt-5 text-xl font-extrabold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </p>
                </motion.article>
              );
            })}
          </motion.div>

          <p className="mx-auto mt-8 max-w-2xl text-center text-sm font-semibold text-foreground">
            Insights support your evaluation — investment decisions remain
            yours.
          </p>
        </div>
      </AnimatedSection>

      <AnimatedSection
        className="border-t border-border bg-muted/35"
        labelledBy="get-started-heading"
      >
        <div className="asancha-page-container py-16 sm:py-20">
          <div className="rounded-3xl bg-foreground px-6 py-12 text-center text-primary-foreground shadow-xl sm:px-10 sm:py-16">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">
              Ready to get started?
            </p>
            <h2
              className="mx-auto mt-3 max-w-3xl text-3xl font-extrabold tracking-normal sm:text-4xl"
              id="get-started-heading"
            >
              Choose your next step with Asancha.
            </h2>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary-hover focus:outline-none focus:ring-4 focus:ring-primary-foreground/30"
                href="/marketplace"
              >
                Find Properties
                <ArrowRight aria-hidden="true" size={17} />
              </Link>
              <Link
                className="inline-flex min-h-12 cursor-pointer items-center justify-center rounded-xl border border-primary-foreground/35 px-6 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary-foreground/10 focus:outline-none focus:ring-4 focus:ring-primary-foreground/30"
                href="/list-property"
              >
                List a Property
              </Link>
            </div>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 text-sm text-primary-foreground/72 lg:flex-row lg:gap-8">
              <p>
                Are you an agent, sourcer or property professional?{" "}
                <Link
                  className="cursor-pointer font-bold text-primary underline-offset-4 hover:underline focus:outline-none focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-primary"
                  href="#choose-your-journey"
                >
                  Explore Professionals →
                </Link>
              </p>
              <p>
                Technology or data partner?{" "}
                <Link
                  className="cursor-pointer font-bold text-primary underline-offset-4 hover:underline focus:outline-none focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-primary"
                  href="/api-partners"
                >
                  Explore API Partnerships →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </main>
  );
}
