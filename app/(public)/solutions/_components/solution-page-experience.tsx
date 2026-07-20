"use client";

// File: app/(public)/solutions/_components/solution-page-experience.tsx

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  CalendarCheck,
  CheckCircle2,
  ClipboardList,
  FileCheck2,
  KeyRound,
  LineChart,
  LockKeyhole,
  MessageSquare,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  UsersRound,
} from "lucide-react";
import type { ReactNode } from "react";

type SolutionIconName =
  | "agent"
  | "booking"
  | "briefcase"
  | "building"
  | "check"
  | "clipboard"
  | "document"
  | "investor"
  | "key"
  | "lock"
  | "message"
  | "search"
  | "shield"
  | "sliders"
  | "sparkles"
  | "users";

interface SolutionCard {
  title: string;
  description: string;
  icon: SolutionIconName;
}

interface SolutionPageExperienceProps {
  eyebrow: string;
  title: string;
  description: string;
  supportingCopy: string;
  primaryAction: {
    label: string;
    href: string;
  };
  secondaryAction: {
    label: string;
    href: string;
  };
  benefitsHeading: string;
  benefitsDescription: string;
  benefits: SolutionCard[];
  journeyHeading: string;
  journeyDescription: string;
  journey: Array<{
    title: string;
    description: string;
  }>;
  workflowEyebrow: string;
  workflowHeading: string;
  workflowDescription: string;
  workflowItems: string[];
  safetyHeading: string;
  safetyDescription: string;
  safetyNotes: string[];
  finalCtaHeading: string;
  finalCtaDescription: string;
}

const iconMap = {
  agent: BadgeCheck,
  booking: CalendarCheck,
  briefcase: BriefcaseBusiness,
  building: Building2,
  check: CheckCircle2,
  clipboard: ClipboardList,
  document: FileCheck2,
  investor: LineChart,
  key: KeyRound,
  lock: LockKeyhole,
  message: MessageSquare,
  search: Search,
  shield: ShieldCheck,
  sliders: SlidersHorizontal,
  sparkles: Sparkles,
  users: UsersRound,
} satisfies Record<SolutionIconName, typeof Search>;

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

export function SolutionPageExperience({
  eyebrow,
  title,
  description,
  supportingCopy,
  primaryAction,
  secondaryAction,
  benefitsHeading,
  benefitsDescription,
  benefits,
  journeyHeading,
  journeyDescription,
  journey,
  workflowEyebrow,
  workflowHeading,
  workflowDescription,
  workflowItems,
  safetyHeading,
  safetyDescription,
  safetyNotes,
  finalCtaHeading,
  finalCtaDescription,
}: SolutionPageExperienceProps) {
  return (
    <main className="overflow-hidden">
      <section className="relative isolate overflow-hidden bg-foreground text-primary-foreground">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-20 bg-[url('/auth-bg.avif')] bg-cover bg-center"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(2,6,23,0.96)_0%,rgba(2,6,23,0.76)_54%,rgba(2,6,23,0.38)_100%)]"
        />

        <div className="asancha-page-container py-20 sm:py-28">
          <motion.div
            animate="show"
            className="grid gap-12 lg:grid-cols-[1fr_0.72fr] lg:items-end"
            initial="hidden"
            variants={staggerContainer}
          >
            <div>
              <motion.p
                className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-4 py-2 text-xs font-bold uppercase tracking-wide text-primary-foreground/85 backdrop-blur-md"
                variants={cardReveal}
              >
                <Sparkles aria-hidden="true" size={14} strokeWidth={2.5} />
                {eyebrow}
              </motion.p>

              <motion.h1
                className="mt-6 max-w-4xl text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl"
                variants={cardReveal}
              >
                {title}
              </motion.h1>

              <motion.p
                className="mt-6 max-w-3xl text-lg leading-8 text-primary-foreground/80"
                variants={cardReveal}
              >
                {description}
              </motion.p>

              <motion.p
                className="mt-4 max-w-3xl text-base leading-7 text-primary-foreground/70"
                variants={cardReveal}
              >
                {supportingCopy}
              </motion.p>

              <motion.div
                className="mt-9 flex flex-col gap-3 sm:flex-row"
                variants={cardReveal}
              >
                <Link
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary-hover focus:outline-none focus:ring-4 focus:ring-primary-foreground/30"
                  href={primaryAction.href}
                >
                  {primaryAction.label}
                  <ArrowRight aria-hidden="true" size={17} strokeWidth={2.5} />
                </Link>
                <Link
                  className="inline-flex min-h-12 items-center justify-center rounded-xl border border-primary-foreground/35 bg-primary-foreground/10 px-6 py-3 text-sm font-bold text-primary-foreground backdrop-blur-sm hover:bg-primary-foreground/20 focus:outline-none focus:ring-4 focus:ring-primary-foreground/30"
                  href={secondaryAction.href}
                >
                  {secondaryAction.label}
                </Link>
              </motion.div>
            </div>

            <motion.div
              className="rounded-lg border border-primary-foreground/20 bg-primary-foreground/10 p-5 shadow-2xl backdrop-blur-md"
              variants={cardReveal}
            >
              <h2 className="text-lg font-bold text-primary-foreground">
                What this role manages
              </h2>
              <div className="mt-5 grid gap-3">
                {workflowItems.slice(0, 4).map((item) => (
                  <div
                    className="flex gap-3 rounded-lg border border-primary-foreground/15 bg-primary-foreground/10 p-3 text-sm font-bold text-primary-foreground"
                    key={item}
                  >
                    <CheckCircle2
                      aria-hidden="true"
                      className="mt-0.5 shrink-0"
                      size={16}
                      strokeWidth={2.5}
                    />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <AnimatedSection
        className="border-b border-border bg-background"
        labelledBy="solution-benefits-heading"
      >
        <div className="asancha-page-container py-16">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-wide text-primary">
              Benefits
            </p>
            <h2
              className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
              id="solution-benefits-heading"
            >
              {benefitsHeading}
            </h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              {benefitsDescription}
            </p>
          </div>

          <motion.div
            className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4"
            initial="hidden"
            viewport={{ once: true, amount: 0.15 }}
            variants={staggerContainer}
            whileInView="show"
          >
            {benefits.map((benefit) => {
              const Icon = iconMap[benefit.icon];

              return (
                <motion.article
                  className="rounded-lg border border-border bg-card p-6 shadow-sm"
                  key={benefit.title}
                  variants={cardReveal}
                  whileHover={{ y: -3 }}
                >
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-accent text-primary">
                    <Icon aria-hidden="true" size={18} strokeWidth={2.5} />
                  </span>
                  <h3 className="mt-4 font-bold text-card-foreground">
                    {benefit.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {benefit.description}
                  </p>
                </motion.article>
              );
            })}
          </motion.div>
        </div>
      </AnimatedSection>

      <AnimatedSection
        className="bg-muted"
        labelledBy="solution-journey-heading"
      >
        <div className="asancha-page-container py-16">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-wide text-primary">
              Journey
            </p>
            <h2
              className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
              id="solution-journey-heading"
            >
              {journeyHeading}
            </h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              {journeyDescription}
            </p>
          </div>

          <motion.ol
            className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            viewport={{ once: true, amount: 0.15 }}
            variants={staggerContainer}
            whileInView="show"
          >
            {journey.map((step, index) => (
              <motion.li
                className="rounded-lg border border-border bg-card p-6 shadow-sm"
                key={step.title}
                variants={cardReveal}
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-extrabold text-primary">
                    0{index + 1}
                  </span>
                  <span className="h-px flex-1 bg-border" />
                </div>
                <h3 className="mt-4 font-bold text-card-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {step.description}
                </p>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </AnimatedSection>

      <AnimatedSection
        className="bg-card"
        labelledBy="solution-workflow-heading"
      >
        <div className="asancha-page-container py-16">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-primary">
                {workflowEyebrow}
              </p>
              <h2
                className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
                id="solution-workflow-heading"
              >
                {workflowHeading}
              </h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                {workflowDescription}
              </p>
            </div>

            <motion.ul
              className="grid gap-3 sm:grid-cols-2"
              initial="hidden"
              viewport={{ once: true, amount: 0.15 }}
              variants={staggerContainer}
              whileInView="show"
            >
              {workflowItems.map((item) => (
                <motion.li
                  className="flex gap-3 rounded-lg border border-border bg-muted p-4 text-sm font-bold text-foreground"
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
        className="border-y border-border bg-muted"
        labelledBy="solution-safety-heading"
      >
        <div className="asancha-page-container py-16">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-primary">
                Trust boundaries
              </p>
              <h2
                className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
                id="solution-safety-heading"
              >
                {safetyHeading}
              </h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                {safetyDescription}
              </p>
            </div>

            <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-bold text-card-foreground">
                Safety reminders
              </h3>
              <ul className="mt-5 grid gap-3">
                {safetyNotes.map((note) => (
                  <li
                    className="flex gap-3 rounded-lg border border-border bg-muted p-4 text-sm font-bold text-foreground"
                    key={note}
                  >
                    <ShieldCheck
                      aria-hidden="true"
                      className="mt-0.5 shrink-0 text-primary"
                      size={17}
                      strokeWidth={2.5}
                    />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </AnimatedSection>

      <section className="bg-primary" aria-labelledby="solution-final-heading">
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
                id="solution-final-heading"
              >
                {finalCtaHeading}
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-primary-foreground/80">
                {finalCtaDescription}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-foreground px-6 py-3 text-sm font-bold text-background hover:bg-foreground/80 focus:outline-none focus:ring-4 focus:ring-primary-foreground/40"
                href={primaryAction.href}
              >
                {primaryAction.label}
              </Link>
              <Link
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-primary-foreground/35 px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary-foreground/10 focus:outline-none focus:ring-4 focus:ring-primary-foreground/40"
                href="/marketplace"
              >
                Browse marketplace
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
