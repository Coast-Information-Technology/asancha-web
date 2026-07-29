"use client";

// File: app/(public)/_components/public-page-hero.tsx

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

interface PublicPageHeroAction {
  label: string;
  href: string;
}

interface PublicPageHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  secondaryDescription?: string;
  primaryAction?: PublicPageHeroAction;
  secondaryAction?: PublicPageHeroAction;
}

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
} as const;

const itemReveal = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
} as const;

export function PublicPageHero({
  eyebrow,
  title,
  description,
  secondaryDescription,
  primaryAction,
  secondaryAction,
}: PublicPageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-foreground text-primary-foreground">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-[url('/auth-bg.avif')] bg-cover bg-center"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(2,6,23,0.96)_0%,rgba(2,6,23,0.78)_55%,rgba(2,6,23,0.4)_100%)]"
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
            variants={itemReveal}
          >
            <Sparkles aria-hidden="true" size={14} strokeWidth={2.5} />
            {eyebrow}
          </motion.p>

          <motion.h1
            className="mt-6 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl"
            variants={itemReveal}
          >
            {title}
          </motion.h1>

          <motion.p
            className="mt-6 max-w-3xl text-lg leading-8 text-primary-foreground/80"
            variants={itemReveal}
          >
            {description}
          </motion.p>

          {secondaryDescription ? (
            <motion.p
              className="mt-4 max-w-3xl text-base leading-7 text-primary-foreground/70"
              variants={itemReveal}
            >
              {secondaryDescription}
            </motion.p>
          ) : null}

          {primaryAction || secondaryAction ? (
            <motion.div
              className="mt-9 flex flex-col gap-3 sm:flex-row"
              variants={itemReveal}
            >
              {primaryAction ? (
                <Link
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary-hover focus:outline-none focus:ring-4 focus:ring-primary-foreground/30"
                  href={primaryAction.href}
                >
                  {primaryAction.label}
                  <ArrowRight aria-hidden="true" size={17} strokeWidth={2.5} />
                </Link>
              ) : null}

              {secondaryAction ? (
                <Link
                  className="inline-flex min-h-12 items-center justify-center rounded-xl border border-primary-foreground/35 bg-primary-foreground/10 px-6 py-3 text-sm font-bold text-primary-foreground backdrop-blur-sm hover:bg-primary-foreground/20 focus:outline-none focus:ring-4 focus:ring-primary-foreground/30"
                  href={secondaryAction.href}
                >
                  {secondaryAction.label}
                </Link>
              ) : null}
            </motion.div>
          ) : null}
        </motion.div>
      </div>
    </section>
  );
}
