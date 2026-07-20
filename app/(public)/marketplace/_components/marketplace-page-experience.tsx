"use client";

// File: app/(public)/marketplace/_components/marketplace-page-experience.tsx

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  FileText,
  LineChart,
  LockKeyhole,
  MessageSquare,
  PiggyBank,
  Search,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";
import type { ReactNode } from "react";

import { MarketplaceBrowser } from "@/src/components/marketplace/marketplace-browser";

const marketplaceUses = [
  {
    title: "Browse public previews",
    description:
      "Explore property opportunities before signing in or starting role setup.",
    icon: Search,
  },
  {
    title: "Compare investment signals",
    description:
      "Review public-safe price, strategy, yield, and location indicators.",
    icon: LineChart,
  },
  {
    title: "Filter by intent",
    description:
      "Narrow results by location, property type, budget, strategy, and BMV status.",
    icon: SlidersHorizontal,
  },
  {
    title: "Continue when ready",
    description:
      "Move into saved listings, reservations, bookings, or conversations when allowed.",
    icon: ArrowRight,
  },
] as const;

const protectedInformation = [
  ["Private deal packs", FileText],
  ["Sensitive property documents", ShieldCheck],
  ["Seller or owner contact details", MessageSquare],
  ["Restricted AI analysis", BadgeCheck],
  ["Payment information", PiggyBank],
  ["Internal review notes", LockKeyhole],
] as const;

const marketplaceHighlights = [
  ["Public-safe", "previews"],
  ["Role-aware", "next steps"],
  ["Verified", "actions"],
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

export function MarketplacePageExperience() {
  return (
    <main className="overflow-hidden">
      <section
        aria-labelledby="marketplace-heading"
        className="relative isolate overflow-hidden bg-foreground text-primary-foreground"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-20 bg-[url('/auth-bg.avif')] bg-cover bg-center"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(2,6,23,0.96)_0%,rgba(2,6,23,0.76)_52%,rgba(2,6,23,0.38)_100%)]"
        />

        <div className="asancha-page-container py-20 sm:py-28">
          <motion.div
            animate="show"
            className="grid gap-12 lg:grid-cols-[1fr_0.78fr] lg:items-end"
            initial="hidden"
            variants={staggerContainer}
          >
            <div>
              <motion.p
                className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-4 py-2 text-xs font-bold uppercase tracking-wide text-primary-foreground/85 backdrop-blur-md"
                variants={cardReveal}
              >
                <Building2 aria-hidden="true" size={14} strokeWidth={2.5} />
                Property marketplace
              </motion.p>

              <motion.h1
                className="mt-6 max-w-4xl text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl"
                id="marketplace-heading"
                variants={cardReveal}
              >
                Find public property previews that fit your next move.
              </motion.h1>

              <motion.p
                className="mt-6 max-w-3xl text-lg leading-8 text-primary-foreground/80"
                variants={cardReveal}
              >
                Browse public-safe property and investment previews across the
                UK, then continue into the right account, profile,
                verification, or approval path when an action needs more trust.
              </motion.p>

              <motion.div
                className="mt-9 flex flex-col gap-3 sm:flex-row"
                variants={cardReveal}
              >
                <Link
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary-hover focus:outline-none focus:ring-4 focus:ring-primary-foreground/30"
                  href="#marketplace-browser-heading"
                >
                  Browse listings
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
                  href="/how-it-works"
                >
                  See how it works
                </Link>
              </motion.div>
            </div>

            <motion.div
              className="rounded-lg border border-primary-foreground/20 bg-primary-foreground/10 p-5 shadow-2xl backdrop-blur-md"
              variants={cardReveal}
            >
              <div className="flex items-start gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
                  <ShieldCheck aria-hidden="true" size={20} strokeWidth={2.5} />
                </span>
                <div>
                  <h2 className="text-lg font-bold text-primary-foreground">
                    Built for public discovery
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-primary-foreground/75">
                    The marketplace is useful before login while sensitive deal
                    records stay behind the right checks.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                {marketplaceHighlights.map(([value, label]) => (
                  <div
                    className="rounded-lg border border-primary-foreground/15 bg-primary-foreground/10 p-4"
                    key={`${value}-${label}`}
                  >
                    <p className="text-xl font-extrabold text-primary-foreground">
                      {value}
                    </p>
                    <p className="mt-1 text-xs font-bold uppercase tracking-wide text-primary-foreground/65">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <AnimatedSection
        className="border-b border-border bg-background"
        labelledBy="marketplace-uses-heading"
      >
        <div className="asancha-page-container py-16">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-wide text-primary">
              Marketplace discovery
            </p>
            <h2
              className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
              id="marketplace-uses-heading"
            >
              Explore with context before committing to the next step.
            </h2>
          </div>

          <motion.div
            className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4"
            initial="hidden"
            viewport={{ once: true, amount: 0.15 }}
            variants={staggerContainer}
            whileInView="show"
          >
            {marketplaceUses.map((item) => {
              const Icon = item.icon;

              return (
                <motion.article
                  className="rounded-lg border border-border bg-card p-6 shadow-sm"
                  key={item.title}
                  variants={cardReveal}
                  whileHover={{ y: -3 }}
                >
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-accent text-primary">
                    <Icon aria-hidden="true" size={18} strokeWidth={2.5} />
                  </span>
                  <h3 className="mt-4 font-bold text-card-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </p>
                </motion.article>
              );
            })}
          </motion.div>
        </div>
      </AnimatedSection>

      <AnimatedSection
        className="bg-muted"
        labelledBy="marketplace-protected-heading"
      >
        <div className="asancha-page-container py-16">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-primary">
                Protected information
              </p>
              <h2
                className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
                id="marketplace-protected-heading"
              >
                Some deal information requires a verified account.
              </h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                Public previews do not include protected deal information.
                Saving, reserving, messaging, booking, payment-related actions,
                and restricted materials may require sign-in, profile
                completion, verification, payment review, or approval.
              </p>
            </div>

            <motion.ul
              className="grid gap-3 sm:grid-cols-2"
              initial="hidden"
              viewport={{ once: true, amount: 0.15 }}
              variants={staggerContainer}
              whileInView="show"
            >
              {protectedInformation.map(([label, Icon]) => (
                <motion.li
                  className="flex gap-3 rounded-lg border border-border bg-card p-4 text-sm font-bold text-foreground shadow-sm"
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

      <AnimatedSection
        className="bg-background"
        labelledBy="marketplace-browser-heading"
      >
        <div className="asancha-page-container py-16">
          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-wide text-primary">
                Browse listings
              </p>

              <h2
                className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
                id="marketplace-browser-heading"
              >
                Search the public marketplace.
              </h2>

              <p className="mt-4 text-base leading-7 text-muted-foreground">
                Use the filters below to narrow public-safe property previews.
                The listings shown here should only contain information approved
                for public marketplace visibility.
              </p>
            </div>

            
          </div>

          <MarketplaceBrowser />
        </div>
      </AnimatedSection>
    </main>
  );
}
