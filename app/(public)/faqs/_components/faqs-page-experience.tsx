"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  HelpCircle,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

import type {
  PublicFaqCategory,
  PublicFaqCategoryMeta,
  PublicFaqItem,
} from "@/src/content/public-faqs";

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
  show: { transition: { staggerChildren: 0.05 } },
} as const;

const itemReveal = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
  },
} as const;

interface FaqsPageExperienceProps {
  categories: readonly PublicFaqCategoryMeta[];
  faqs: readonly PublicFaqItem[];
}

function normalise(value: string): string {
  return value.trim().toLowerCase();
}

export function FaqsPageExperience({
  categories,
  faqs,
}: FaqsPageExperienceProps) {
  const [selectedCategory, setSelectedCategory] = useState<
    PublicFaqCategory | "all"
  >("all");
  const [query, setQuery] = useState("");

  const filteredFaqs = useMemo(() => {
    const searchTerm = normalise(query);

    return faqs.filter((faq) => {
      const matchesCategory =
        selectedCategory === "all" || faq.category === selectedCategory;

      if (!matchesCategory) {
        return false;
      }

      if (!searchTerm) {
        return true;
      }

      return normalise(`${faq.question} ${faq.answer}`).includes(searchTerm);
    });
  }, [faqs, query, selectedCategory]);

  const groupedFaqs = useMemo(
    () =>
      categories
        .map((category) => ({
          ...category,
          items: filteredFaqs.filter((faq) => faq.category === category.id),
        }))
        .filter((category) => category.items.length > 0),
    [categories, filteredFaqs],
  );

  function clearSearch(): void {
    setQuery("");
    setSelectedCategory("all");
  }

  return (
    <main className="overflow-x-clip">
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
              variants={itemReveal}
            >
              <HelpCircle aria-hidden="true" size={14} strokeWidth={2.5} />
              Asancha Help Centre
            </motion.p>

            <motion.h1
              className="mt-6 max-w-4xl text-4xl font-extrabold leading-tight tracking-normal sm:text-6xl"
              variants={itemReveal}
            >
              Frequently Asked Questions
            </motion.h1>

            <motion.p
              className="mt-6 max-w-3xl text-lg leading-8 text-primary-foreground/80"
              variants={itemReveal}
            >
              Find answers about property browsing, accounts, onboarding,
              verification, property submissions, payments, reservations,
              professional services, API access, privacy, and support.
            </motion.p>

            <motion.p
              className="mt-4 max-w-3xl text-sm leading-6 text-primary-foreground/70"
              variants={itemReveal}
            >
              Some features depend on your role, profile, verification,
              property, payment, subscription, or approval status.
            </motion.p>

            <motion.div
              className="mt-9 flex flex-col gap-3 sm:flex-row"
              variants={itemReveal}
            >
              <Link
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary-hover focus:outline-none focus:ring-4 focus:ring-primary-foreground/30"
                href="/marketplace"
              >
                Explore properties
                <ArrowRight aria-hidden="true" size={17} strokeWidth={2.5} />
              </Link>
              <Link
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-primary-foreground/35 bg-primary-foreground/10 px-6 py-3 text-sm font-bold text-primary-foreground backdrop-blur-sm hover:bg-primary-foreground/20 focus:outline-none focus:ring-4 focus:ring-primary-foreground/30"
                href="/auth/sign-up"
              >
                Create an account
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <motion.section
        aria-labelledby="faq-search-heading"
        className="border-b border-border bg-background"
        initial="hidden"
        viewport={{ once: true, amount: 0.18 }}
        variants={sectionReveal}
        whileInView="show"
      >
        <div className="asancha-page-container py-12">
          <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-primary">
                Search and navigation
              </p>
              <h2
                className="mt-3 text-3xl font-extrabold tracking-normal text-foreground"
                id="faq-search-heading"
              >
                Search by topic or browse a category.
              </h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                Search matches question and answer text while keeping the
                selected category active.
              </p>
            </div>

            <div className="grid gap-5">
              <label className="relative block">
                <span className="sr-only">Search frequently asked questions</span>
                <Search
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={18}
                  strokeWidth={2.5}
                />
                <input
                  className="min-h-12 w-full rounded-xl border border-border bg-card px-11 py-3 text-sm font-semibold text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/15"
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search accounts, properties, payments, API access or verification"
                  type="search"
                  value={query}
                />
              </label>

              <div className="flex flex-wrap gap-2">
                <button
                  className={`rounded-full border px-4 py-2 text-sm font-bold transition ${
                    selectedCategory === "all"
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-foreground hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedCategory("all")}
                  type="button"
                >
                  All
                </button>
                {categories.map((category) => (
                  <button
                    className={`rounded-full border px-4 py-2 text-sm font-bold transition ${
                      selectedCategory === category.id
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-foreground hover:border-primary/50"
                    }`}
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    type="button"
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        aria-labelledby="faq-list-heading"
        className="bg-muted"
        initial="hidden"
        viewport={{ once: true, amount: 0.12 }}
        variants={sectionReveal}
        whileInView="show"
      >
        <div className="asancha-page-container py-16">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-primary">
                Questions and answers
              </p>
              <h2
                className="mt-3 text-3xl font-extrabold tracking-normal text-foreground"
                id="faq-list-heading"
              >
                Public Asancha FAQs.
              </h2>
            </div>
            <p className="text-sm font-bold text-muted-foreground">
              {filteredFaqs.length} result{filteredFaqs.length === 1 ? "" : "s"}
            </p>
          </div>

          {filteredFaqs.length === 0 ? (
            <div className="mt-10 rounded-xl border border-border bg-card p-8 shadow-sm">
              <h3 className="text-xl font-extrabold tracking-normal text-card-foreground">
                No matching questions found
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Try a different word or browse another FAQ category.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-foreground px-5 py-2 text-sm font-bold text-background hover:bg-foreground/80"
                  onClick={clearSearch}
                  type="button"
                >
                  <X aria-hidden="true" size={16} strokeWidth={2.5} />
                  Clear search
                </button>
                <Link
                  className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-card px-5 py-2 text-sm font-bold text-foreground hover:border-primary/50"
                  href="/support"
                >
                  Contact support
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-10 grid gap-8">
              {groupedFaqs.map((group) => (
                <section
                  aria-labelledby={`faq-category-${group.id}`}
                  key={group.id}
                >
                  <h3
                    className="text-xl font-extrabold tracking-normal text-foreground"
                    id={`faq-category-${group.id}`}
                  >
                    {group.label}
                  </h3>
                  <motion.div
                    className="mt-4 grid gap-3"
                    initial="hidden"
                    viewport={{ once: true, amount: 0.12 }}
                    variants={staggerContainer}
                    whileInView="show"
                  >
                    {group.items.map((faq) => (
                      <motion.details
                        className="group rounded-xl border border-border bg-card p-5 shadow-sm"
                        id={faq.id}
                        key={faq.id}
                        variants={itemReveal}
                      >
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-base font-extrabold text-card-foreground marker:hidden">
                          <span>{faq.question}</span>
                          <ChevronDown
                            aria-hidden="true"
                            className="shrink-0 text-primary transition group-open:rotate-180"
                            size={18}
                            strokeWidth={2.5}
                          />
                        </summary>
                        <p className="mt-3 max-w-4xl text-sm leading-6 text-muted-foreground">
                          {faq.answer}
                        </p>
                      </motion.details>
                    ))}
                  </motion.div>
                </section>
              ))}
            </div>
          )}
        </div>
      </motion.section>

      <motion.section
        aria-labelledby="faq-safety-heading"
        className="bg-card"
        initial="hidden"
        viewport={{ once: true, amount: 0.18 }}
        variants={sectionReveal}
        whileInView="show"
      >
        <div className="asancha-page-container py-16">
          <div className="grid gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-primary">
                Public safety reminder
              </p>
              <h2
                className="mt-3 text-3xl font-extrabold tracking-normal text-foreground"
                id="faq-safety-heading"
              >
                Use the right support route for private issues.
              </h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                Public FAQs should explain Asancha without exposing private
                account information, internal support notes, API keys, tokens,
                webhook secrets, admin routes, or unsupported guarantees.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-background p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-accent text-primary">
                  <ShieldCheck
                    aria-hidden="true"
                    size={18}
                    strokeWidth={2.5}
                  />
                </span>
                <h3 className="font-bold text-foreground">
                  Support cannot bypass requirements
                </h3>
              </div>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                Support can investigate and assist, but it cannot bypass
                verification, property, payment, role, policy, or approval
                requirements.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      <section className="bg-primary" aria-labelledby="faq-final-heading">
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
                Still need help?
              </p>
              <h2
                className="mt-3 max-w-3xl text-3xl font-extrabold tracking-normal sm:text-4xl"
                id="faq-final-heading"
              >
                Find the right next step.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-primary-foreground/80">
                Explore property opportunities, create an account, or contact
                Asancha support for help with an account, property, payment,
                verification, professional profile, or API Partner application.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-foreground px-6 py-3 text-sm font-bold text-background hover:bg-foreground/80 focus:outline-none focus:ring-4 focus:ring-primary-foreground/40"
                href="/marketplace"
              >
                Explore properties
              </Link>
              <Link
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-primary-foreground/35 px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary-foreground/10 focus:outline-none focus:ring-4 focus:ring-primary-foreground/40"
                href="/auth/sign-up"
              >
                Create an account
              </Link>
              <Link
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-primary-foreground/35 px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary-foreground/10 focus:outline-none focus:ring-4 focus:ring-primary-foreground/40"
                href="/support"
              >
                Contact support
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
