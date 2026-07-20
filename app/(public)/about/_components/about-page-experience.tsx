"use client";

// File: app/(public)/about/_components/about-page-experience.tsx

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  Layers3,
  LockKeyhole,
  Search,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";
import type { ReactNode } from "react";

const audiences = [
  ["Investors", "Discover and compare property opportunities.", Search],
  ["Property owners", "Prepare property details and track listing progress.", Building2],
  ["Property agents", "Manage represented stock and authority documents.", BadgeCheck],
  ["Property sourcers", "Submit opportunities and prepare deal packs.", Layers3],
  ["Service providers", "Publish services and manage bookings.", UsersRound],
  ["API partners", "Apply for reviewed integration access.", LockKeyhole],
] as const;

const principles = [
  {
    title: "Public discovery first",
    description:
      "Visitors can understand Asancha, browse marketplace previews, and choose the next step before account setup.",
  },
  {
    title: "Workspaces by role",
    description:
      "Investors, owners, agents, sourcers, service providers, and partners each get focused workflows.",
  },
  {
    title: "Trust before sensitive actions",
    description:
      "Account setup, verification, documents, payments, and approvals stay connected to the actions that need them.",
  },
  {
    title: "Useful guidance",
    description:
      "The platform helps users understand what to do next without promising outcomes it cannot guarantee.",
  },
] as const;

const boundaries = [
  "Public pages explain the platform and marketplace.",
  "Dashboards organize role-specific work.",
  "Sensitive records stay behind account checks.",
  "Partner access follows a reviewed application route.",
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

export function AboutPageExperience() {
  return (
    <main className="overflow-hidden">
      <section className="relative isolate overflow-hidden bg-foreground text-primary-foreground">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-20 bg-[url('/auth-bg.avif')] bg-cover bg-center"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(2,6,23,0.96)_0%,rgba(2,6,23,0.78)_55%,rgba(2,6,23,0.42)_100%)]"
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
              className="mt-6 max-w-4xl text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl"
              variants={cardReveal}
            >
              A UK property platform built around clarity, roles, and trust.
            </motion.h1>

            <motion.p
              className="mt-6 max-w-3xl text-lg leading-8 text-primary-foreground/80"
              variants={cardReveal}
            >
              Asancha helps property users move from public discovery into the
              right workspace, with clearer steps for listings, documents,
              verification, bookings, payments, and partner access.
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
                href="/how-it-works"
              >
                See how it works
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <AnimatedSection className="border-b border-border bg-background" labelledBy="about-purpose-heading">
        <div className="asancha-page-container py-16">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-primary">
                Why it exists
              </p>
              <h2
                className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
                id="about-purpose-heading"
              >
                Property workflows need more than simple listings.
              </h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                A single opportunity can involve people, documents, viewing
                requests, payments, conversations, approvals, and follow-up
                actions. Asancha gives each part a clearer place.
              </p>
            </div>

            <motion.div
              className="grid gap-4 sm:grid-cols-2"
              initial="hidden"
              viewport={{ once: true, amount: 0.15 }}
              variants={staggerContainer}
              whileInView="show"
            >
              {audiences.map(([title, description, Icon]) => (
                <motion.article
                  className="rounded-xl border border-border bg-card p-5 shadow-sm"
                  key={title}
                  variants={cardReveal}
                  whileHover={{ y: -3 }}
                >
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-accent text-primary">
                    <Icon aria-hidden="true" size={18} strokeWidth={2.5} />
                  </span>
                  <h3 className="mt-4 font-bold text-card-foreground">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {description}
                  </p>
                </motion.article>
              ))}
            </motion.div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="bg-muted" labelledBy="about-principles-heading">
        <div className="asancha-page-container py-16">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-wide text-primary">
              Platform principles
            </p>
            <h2
              className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
              id="about-principles-heading"
            >
              Designed to help users know what happens next.
            </h2>
          </div>

          <motion.div
            className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4"
            initial="hidden"
            viewport={{ once: true, amount: 0.15 }}
            variants={staggerContainer}
            whileInView="show"
          >
            {principles.map((principle) => (
              <motion.article
                className="rounded-xl border border-border bg-card p-6 shadow-sm"
                key={principle.title}
                variants={cardReveal}
              >
                <h3 className="font-bold text-card-foreground">
                  {principle.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {principle.description}
                </p>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="bg-card" labelledBy="about-boundaries-heading">
        <div className="asancha-page-container py-16">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-start">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-primary">
                Public-safe by design
              </p>
              <h2
                className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
                id="about-boundaries-heading"
              >
                Useful public pages, protected sensitive actions.
              </h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                Asancha keeps public discovery helpful while account-specific
                records, documents, payment state, and partner resources stay
                behind the right workflow.
              </p>
            </div>

            <ul className="grid gap-3">
              {boundaries.map((boundary) => (
                <li
                  className="flex gap-3 rounded-xl border border-border bg-muted p-4 text-sm font-bold text-foreground"
                  key={boundary}
                >
                  <CheckCircle2
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-primary"
                    size={17}
                    strokeWidth={2.5}
                  />
                  <span>{boundary}</span>
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
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-primary-foreground/80">
                <ShieldCheck aria-hidden="true" size={16} strokeWidth={2.5} />
                Continue with confidence
              </p>
              <h2
                className="mt-3 max-w-3xl text-3xl font-extrabold tracking-tight sm:text-4xl"
                id="about-final-cta-heading"
              >
                Start with discovery, then choose the right Asancha path.
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
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
