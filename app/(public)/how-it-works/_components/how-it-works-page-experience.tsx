"use client";

// File: app/(public)/how-it-works/_components/how-it-works-page-experience.tsx

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Bot,
  Building2,
  CheckCircle2,
  CreditCard,
  FileCheck2,
  KeyRound,
  Route,
  Search,
  ShieldCheck,
  UserRoundPlus,
} from "lucide-react";
import type { ReactNode } from "react";

const journeySteps = [
  {
    title: "Browse public previews",
    description:
      "Start with marketplace listings, role pages, pricing, FAQs, and platform guidance.",
    icon: Search,
  },
  {
    title: "Create an account",
    description:
      "Choose the role you want to start with and verify your email address.",
    icon: UserRoundPlus,
  },
  {
    title: "Complete setup",
    description:
      "Add profile details, accept required policies, and provide role-specific information.",
    icon: FileCheck2,
  },
  {
    title: "Use your workspace",
    description:
      "Move through dashboards, listings, documents, bookings, conversations, and payments.",
    icon: Building2,
  },
  {
    title: "Unlock actions",
    description:
      "Some actions become available after verification, review, payment, or approval.",
    icon: ShieldCheck,
  },
  {
    title: "Grow the workflow",
    description:
      "Add more roles, use recommendations, or apply for partner access when needed.",
    icon: Route,
  },
] as const;

const roleFlows = [
  ["Investors", "Save opportunities, set preferences, and compare deals.", "/solutions/investors"],
  ["Property Owners", "Add property, manage listings, and track documents.", "/solutions/property-owners"],
  ["Property Agents", "Manage represented stock and authority documents.", "/solutions/property-agents"],
  ["Property Sourcers", "Submit deals, manage packs, and track compliance.", "/solutions/property-sourcers"],
  ["Service Providers", "Publish services, availability, bookings, and areas.", "/solutions/service-providers"],
] as const;

const protectedActions = [
  ["Restricted deal details", BadgeCheck],
  ["Document submissions", FileCheck2],
  ["Reservations and bookings", Building2],
  ["Payment review", CreditCard],
  ["AI recommendations", Bot],
  ["API partner tools", KeyRound],
] as const;

const safetyRules = [
  {
    title: "Guidance is not approval",
    description:
      "A visible page or button helps users navigate, but protected actions still depend on account state.",
  },
  {
    title: "Payment proof needs review",
    description:
      "Submitting proof is a step in the process, not the same as confirmed payment approval.",
  },
  {
    title: "AI explains, users decide",
    description:
      "AI-supported guidance can explain matches and warnings, but it does not guarantee outcomes.",
  },
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

export function HowItWorksPageExperience() {
  return (
    <main className="overflow-hidden">
      <section className="relative isolate overflow-hidden bg-foreground text-primary-foreground">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-20 bg-[url('/auth-bg.avif')] bg-cover bg-center"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(2,6,23,0.96)_0%,rgba(2,6,23,0.76)_55%,rgba(2,6,23,0.38)_100%)]"
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
              <Route aria-hidden="true" size={14} strokeWidth={2.5} />
              How it works
            </motion.p>

            <motion.h1
              className="mt-6 max-w-4xl text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl"
              variants={cardReveal}
            >
              From public discovery to the right property workflow.
            </motion.h1>

            <motion.p
              className="mt-6 max-w-3xl text-lg leading-8 text-primary-foreground/80"
              variants={cardReveal}
            >
              Asancha helps users understand what they can browse, what they can
              do next, and when account setup or review is needed.
            </motion.p>

            <motion.div className="mt-9 flex flex-col gap-3 sm:flex-row" variants={cardReveal}>
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
            </motion.div>
          </motion.div>
        </div>
      </section>

      <AnimatedSection className="border-b border-border bg-background" labelledBy="public-journey-heading">
        <div className="asancha-page-container py-16">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-wide text-primary">
              Public user journey
            </p>
            <h2
              className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
              id="public-journey-heading"
            >
              Clear stages make the platform easier to understand.
            </h2>
          </div>

          <motion.ol
            className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            viewport={{ once: true, amount: 0.15 }}
            variants={staggerContainer}
            whileInView="show"
          >
            {journeySteps.map((step, index) => {
              const Icon = step.icon;

              return (
                <motion.li
                  className="rounded-xl border border-border bg-card p-6 shadow-sm"
                  key={step.title}
                  variants={cardReveal}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="grid h-11 w-11 place-items-center rounded-lg bg-accent text-primary">
                      <Icon aria-hidden="true" size={20} strokeWidth={2.5} />
                    </span>
                    <span className="text-sm font-extrabold text-primary">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-card-foreground">
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

      <AnimatedSection className="bg-muted" labelledBy="role-flows-heading">
        <div className="asancha-page-container py-16">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-primary">
                Role-specific flows
              </p>
              <h2
                className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
                id="role-flows-heading"
              >
                Each user type gets a more relevant path.
              </h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                Role-based workspaces keep tasks focused, scannable, and easier
                to improve as the product grows.
              </p>
            </div>

            <div className="grid gap-4">
              {roleFlows.map(([title, description, href]) => (
                <Link
                  className="group rounded-xl border border-border bg-card p-5 shadow-sm transition hover:border-primary/50"
                  href={href}
                  key={href}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-card-foreground">
                        {title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {description}
                      </p>
                    </div>
                    <ArrowRight
                      aria-hidden="true"
                      className="mt-1 shrink-0 text-primary transition group-hover:translate-x-1"
                      size={18}
                      strokeWidth={2.5}
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="bg-card" labelledBy="protected-actions-heading">
        <div className="asancha-page-container py-16">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-start">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-primary">
                Protected actions
              </p>
              <h2
                className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
                id="protected-actions-heading"
              >
                Some actions need more context before they unlock.
              </h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                Public discovery stays open. Actions involving private records,
                documents, payment state, recommendations, or partner tools can
                require additional setup.
              </p>
            </div>

            <motion.ul
              className="grid gap-3 sm:grid-cols-2"
              initial="hidden"
              viewport={{ once: true, amount: 0.15 }}
              variants={staggerContainer}
              whileInView="show"
            >
              {protectedActions.map(([label, Icon]) => (
                <motion.li
                  className="flex gap-3 rounded-xl border border-border bg-muted p-4 text-sm font-bold text-foreground"
                  key={label}
                  variants={cardReveal}
                >
                  <Icon
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-primary"
                    size={17}
                    strokeWidth={2.5}
                  />
                  <span>{label}</span>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="border-y border-border bg-background" labelledBy="workflow-safety-heading">
        <div className="asancha-page-container py-16">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-wide text-primary">
              Safety rules
            </p>
            <h2
              className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
              id="workflow-safety-heading"
            >
              Clear guidance without false certainty.
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {safetyRules.map((rule) => (
              <article
                className="rounded-xl border border-border bg-card p-6 shadow-sm"
                key={rule.title}
              >
                <CheckCircle2
                  aria-hidden="true"
                  className="text-primary"
                  size={20}
                  strokeWidth={2.5}
                />
                <h3 className="mt-4 font-bold text-card-foreground">
                  {rule.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {rule.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <section className="bg-primary" aria-labelledby="how-final-cta-heading">
        <motion.div
          className="asancha-page-container py-16 text-primary-foreground"
          initial={{ opacity: 0, y: 24 }}
          viewport={{ once: true, amount: 0.25 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-primary-foreground/80">
                Next step
              </p>
              <h2
                className="mt-3 max-w-3xl text-3xl font-extrabold tracking-tight sm:text-4xl"
                id="how-final-cta-heading"
              >
                Browse first, then continue through the right account path.
              </h2>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-foreground px-6 py-3 text-sm font-bold text-background hover:bg-foreground/80 focus:outline-none focus:ring-4 focus:ring-primary-foreground/40"
                href="/marketplace"
              >
                Browse marketplace
              </Link>
              <Link
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-primary-foreground/35 px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary-foreground/10 focus:outline-none focus:ring-4 focus:ring-primary-foreground/40"
                href="/auth/sign-up"
              >
                Create account
              </Link>
              <Link
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-primary-foreground/35 px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary-foreground/10 focus:outline-none focus:ring-4 focus:ring-primary-foreground/40"
                href="/auth/api-partner/register"
              >
                Apply for API access
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
