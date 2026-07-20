"use client";

// File: app/(public)/_components/home-page-experience.tsx

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  ClipboardList,
  KeyRound,
  LineChart,
  Search,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";
import type { ReactNode } from "react";

const audienceCards = [
  {
    title: "Investors",
    description:
      "Discover opportunities, compare public metrics, save listings, and move into verified workflows when ready.",
    href: "/solutions/investors",
    icon: LineChart,
  },
  {
    title: "Property Owners",
    description:
      "Add property, track listing progress, manage documents, and respond to review updates.",
    href: "/solutions/property-owners",
    icon: Building2,
  },
  {
    title: "Property Agents",
    description:
      "Manage represented stock, authority documents, company details, listings, and conversations.",
    href: "/solutions/property-agents",
    icon: BadgeCheck,
  },
  {
    title: "Property Sourcers",
    description:
      "Submit deals, prepare deal packs, track compliance, and understand publication readiness.",
    href: "/solutions/property-sourcers",
    icon: Search,
  },
  {
    title: "Service Providers",
    description:
      "Publish services, manage availability, bookings, service areas, documents, and payments.",
    href: "/solutions/service-providers",
    icon: UsersRound,
  },
  {
    title: "API Partners",
    description:
      "Apply for reviewed API access and connect approved property workflows through partner tools.",
    href: "/api-partners",
    icon: KeyRound,
  },
] as const;

const platformSteps = [
  {
    title: "Browse",
    description:
      "Start with public marketplace previews and understand the opportunity before creating an account.",
  },
  {
    title: "Choose a role",
    description:
      "Continue as an investor, owner, agent, sourcer, service provider, or approved API partner.",
  },
  {
    title: "Complete setup",
    description:
      "Verify your email, add profile details, and complete required steps for the actions you need.",
  },
  {
    title: "Manage work",
    description:
      "Move through dashboards, listings, documents, bookings, conversations, payments, and recommendations.",
  },
] as const;

const marketplaceStats = [
  ["3", "preview opportunities"],
  ["5", "public user roles"],
  ["24/7", "self-serve discovery"],
] as const;

const trustItems = [
  "Public previews for safer discovery",
  "Role-specific dashboards and onboarding",
  "Document and verification-aware workflows",
  "Clear separation between public and protected actions",
  "Controlled API partner application path",
  "Dummy marketplace data ready for UI iteration",
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
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
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
}

function AnimatedSection({ children, className }: AnimatedSectionProps) {
  return (
    <motion.section
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

export function HomePageExperience() {
  return (
    <main className="overflow-hidden">
      <section className="relative isolate min-h-[calc(100vh-4.5rem)] overflow-hidden bg-foreground text-primary-foreground">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-20 bg-[url('/auth-bg.avif')] bg-cover bg-center"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(2,6,23,0.96)_0%,rgba(2,6,23,0.78)_48%,rgba(2,6,23,0.38)_100%)]"
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
              UK property marketplace and workflow platform
            </motion.p>

            <motion.h1
              className="mt-6 max-w-4xl text-4xl font-extrabold leading-tight tracking-tight text-primary-foreground sm:text-6xl lg:text-7xl"
              variants={cardReveal}
            >
              Discover property opportunities and move with clearer next steps.
            </motion.h1>

            <motion.p
              className="mt-6 max-w-3xl text-lg leading-8 text-primary-foreground/80 sm:text-xl"
              variants={cardReveal}
            >
              Asancha brings marketplace previews, role-specific dashboards,
              onboarding, documents, bookings, payments, and partner access into
              one structured property experience.
            </motion.p>

            <motion.div
              aria-label="Homepage primary actions"
              className="mt-9 flex flex-col gap-3 sm:flex-row"
              variants={cardReveal}
            >
              <Link
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary-hover focus:outline-none focus:ring-4 focus:ring-primary-foreground/30"
                href="/marketplace"
              >
                Browse marketplace
                <ArrowRight aria-hidden="true" size={17} strokeWidth={2.5} />
              </Link>

              <Link
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-primary-foreground/35 bg-primary-foreground/10 px-6 py-3 text-sm font-bold text-primary-foreground backdrop-blur-sm hover:bg-primary-foreground/20 focus:outline-none focus:ring-4 focus:ring-primary-foreground/30"
                href="/auth/sign-up"
              >
                Create account
              </Link>

              <Link
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-primary-foreground/35 bg-primary-foreground/10 px-6 py-3 text-sm font-bold text-primary-foreground backdrop-blur-sm hover:bg-primary-foreground/20 focus:outline-none focus:ring-4 focus:ring-primary-foreground/30"
                href="/dashboard-ui"
              >
                Preview dashboards
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <AnimatedSection
        className="border-b border-border bg-background"
      >
        <div className="asancha-page-container py-14">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-primary">
                Marketplace preview
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Start with public-safe listings before deeper account actions.
              </h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                Browse opportunities, compare core metrics, and open listing
                previews without needing to complete the full account flow.
              </p>
            </div>

            <motion.div
              className="grid gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm"
              variants={staggerContainer}
            >
              <div className="grid gap-3 sm:grid-cols-3">
                {marketplaceStats.map(([value, label]) => (
                  <motion.div
                    className="rounded-xl bg-muted p-4"
                    key={label}
                    variants={cardReveal}
                  >
                    <p className="text-3xl font-extrabold text-foreground">
                      {value}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-muted-foreground">
                      {label}
                    </p>
                  </motion.div>
                ))}
              </div>

              <div className="rounded-xl border border-border bg-background p-4">
                <div className="flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-accent text-primary">
                    <Search aria-hidden="true" size={19} strokeWidth={2.5} />
                  </span>
                  <div>
                    <h3 className="font-bold text-foreground">
                      Dummy marketplace data is active
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      Use the public marketplace now to refine listing cards,
                      filters, search, detail pages, and calls to action.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection
        aria-labelledby="homepage-audience-heading"
        className="bg-muted"
      >
        <div className="asancha-page-container py-16">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-wide text-primary">
              Who Asancha serves
            </p>

            <h2
              className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
              id="homepage-audience-heading"
            >
              One platform, separate workspaces for each property role.
            </h2>

            <p className="mt-4 text-base leading-7 text-muted-foreground">
              Each role has a dedicated path, so users see the workflows,
              documents, actions, and dashboards that match their work.
            </p>
          </div>

          <motion.div
            className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            viewport={{ once: true, amount: 0.15 }}
            variants={staggerContainer}
            whileInView="show"
          >
            {audienceCards.map((card) => {
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

                  <h3 className="mt-5 text-lg font-bold text-card-foreground">
                    {card.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {card.description}
                  </p>

                  <Link
                    className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-hover focus:outline-none focus:ring-4 focus:ring-ring/20"
                    href={card.href}
                  >
                    Learn more
                    <ArrowRight
                      aria-hidden="true"
                      className="transition group-hover:translate-x-1"
                      size={15}
                      strokeWidth={2.5}
                    />
                  </Link>
                </motion.article>
              );
            })}
          </motion.div>
        </div>
      </AnimatedSection>

      <AnimatedSection
        aria-labelledby="homepage-how-it-works-heading"
        className="bg-background"
      >
        <div className="asancha-page-container py-16">
          <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-primary">
                How it works
              </p>

              <h2
                className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
                id="homepage-how-it-works-heading"
              >
                A simple route from browsing to action.
              </h2>

              <p className="mt-4 text-base leading-7 text-muted-foreground">
                Start with public discovery, then move through the right
                account, verification, and role workflow when an action needs
                more trust.
              </p>
            </div>

            <motion.ol
              className="grid gap-4 sm:grid-cols-2"
              initial="hidden"
              viewport={{ once: true, amount: 0.15 }}
              variants={staggerContainer}
              whileInView="show"
            >
              {platformSteps.map((step, index) => (
                <motion.li
                  className="rounded-xl border border-border bg-card p-6 shadow-sm"
                  key={step.title}
                  variants={cardReveal}
                >
                  <p className="text-sm font-bold text-primary">
                    0{index + 1}
                  </p>

                  <h3 className="mt-3 text-lg font-bold text-card-foreground">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {step.description}
                  </p>
                </motion.li>
              ))}
            </motion.ol>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection
        aria-labelledby="homepage-trust-heading"
        className="border-y border-border bg-card"
      >
        <div className="asancha-page-container py-16">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-primary">
                Trust and clarity
              </p>

              <h2
                className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
                id="homepage-trust-heading"
              >
                Helpful public discovery, protected sensitive actions.
              </h2>

              <p className="mt-4 text-base leading-7 text-muted-foreground">
                Public pages give users enough context to explore. Account
                setup, verification, payment review, and approval can stay in
                the protected workflow where they belong.
              </p>
            </div>

            <motion.ul
              className="grid gap-3 sm:grid-cols-2"
              initial="hidden"
              viewport={{ once: true, amount: 0.15 }}
              variants={staggerContainer}
              whileInView="show"
            >
              {trustItems.map((item) => (
                <motion.li
                  className="flex gap-3 rounded-xl border border-border bg-muted p-4 text-sm font-bold text-foreground"
                  key={item}
                  variants={cardReveal}
                >
                  <CheckCircle2
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-primary"
                    size={17}
                    strokeWidth={2.5}
                  />
                  <span>{item}</span>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection
        aria-labelledby="homepage-api-partner-heading"
        className="bg-muted"
      >
        <div className="asancha-page-container py-16">
          <div className="grid gap-8 rounded-2xl border border-border bg-card p-6 shadow-sm lg:grid-cols-[1.1fr_0.9fr] lg:p-8">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-primary">
                API partners
              </p>

              <h2
                className="mt-3 text-3xl font-extrabold tracking-tight text-card-foreground"
                id="homepage-api-partner-heading"
              >
                Partner access has its own reviewed path.
              </h2>

              <p className="mt-4 text-base leading-7 text-muted-foreground">
                API partners apply separately, then work with approved scopes,
                keys, usage tools, and partner resources after review.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-muted p-5">
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-background text-primary">
                <ShieldCheck aria-hidden="true" size={20} strokeWidth={2.5} />
              </span>

              <h3 className="mt-4 text-lg font-bold text-foreground">
                Controlled by design
              </h3>

              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Partner tools stay separate from ordinary signup so integrations
                can be reviewed before access is granted.
              </p>

              <Link
                className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary-hover focus:outline-none focus:ring-4 focus:ring-ring/30"
                href="/api-partners"
              >
                Learn about API partners
                <ArrowRight aria-hidden="true" size={16} strokeWidth={2.5} />
              </Link>
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
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-primary-foreground/80">
                <ClipboardList aria-hidden="true" size={16} strokeWidth={2.5} />
                Ready when you are
              </p>

              <h2
                className="mt-3 max-w-3xl text-3xl font-extrabold tracking-tight sm:text-4xl"
                id="homepage-final-cta-heading"
              >
                Start with marketplace discovery or preview the working
                dashboards.
              </h2>

              <p className="mt-4 max-w-2xl text-base leading-7 text-primary-foreground/80">
                Use public browsing first, then move into the right account flow
                when a protected action becomes relevant.
              </p>
            </div>

            <div
              aria-label="Homepage final actions"
              className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row"
            >
              <Link
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-foreground px-6 py-3 text-sm font-bold text-background hover:bg-foreground/80 focus:outline-none focus:ring-4 focus:ring-primary-foreground/40"
                href="/marketplace"
              >
                Browse marketplace
              </Link>

              <Link
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-primary-foreground/35 px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary-foreground/10 focus:outline-none focus:ring-4 focus:ring-primary-foreground/40"
                href="/dashboard-ui"
              >
                Preview dashboards
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
