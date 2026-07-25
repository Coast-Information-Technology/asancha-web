"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Code2,
  KeyRound,
  LockKeyhole,
  Radar,
  ShieldCheck,
  Webhook,
} from "lucide-react";
import type { ReactNode } from "react";

const trustIndicators = [
  "Controlled API App access",
  "Scoped API keys",
  "App-level usage monitoring",
  "Webhook delivery management",
  "Approved property intelligence capabilities",
] as const;

const partnerBenefits = [
  {
    title: "Approved property capabilities",
    description:
      "Connect Apps to selected property sourcing and property intelligence services.",
    icon: Code2,
  },
  {
    title: "App-based separation",
    description:
      "Keep products and integrations organised with their own permissions, keys, usage, and status.",
    icon: Radar,
  },
  {
    title: "Scoped access",
    description:
      "Give each App only the permissions required for its approved purpose.",
    icon: ShieldCheck,
  },
  {
    title: "Secure key management",
    description:
      "Create, rotate, revoke, and monitor credentials connected to each App.",
    icon: KeyRound,
  },
] as const;

const featureSections = [
  {
    eyebrow: "Built for approved integrations",
    heading: "A controlled way to connect your App with Asancha.",
    description:
      "An Asancha API Partner is an approved organisation that connects one or more Apps to selected Asancha property sourcing and property intelligence services.",
    items: [
      "Property technology platforms",
      "Property sourcing systems",
      "Investor platforms",
      "Property management systems",
      "Property research and analytics tools",
      "Enterprise property teams",
    ],
  },
  {
    eyebrow: "Access by permission",
    heading: "API access does not mean access to everything.",
    description:
      "Each API App receives only the permissions required for its approved purpose. Private property-owner, investor, tenant, document, payment, and internal review data stays protected.",
    items: [
      "Organisation and App approval",
      "Environment and App status",
      "Approved scopes",
      "Subscription status",
      "Property visibility and data classification",
      "Relevant policies and legal basis",
    ],
  },
  {
    eyebrow: "Secure App authentication",
    heading: "Create and protect credentials for each App.",
    description:
      "Complete key secrets should be displayed only once when created. After creation, the interface should show only a safe identifier or prefix.",
    items: [
      "Create, rotate, and revoke keys",
      "Separate keys by App and environment",
      "Never place secret keys in frontend code",
      "Never commit keys to source control",
      "Monitor key status and activity",
      "Use server-side API communication",
    ],
  },
  {
    eyebrow: "Event-driven Apps",
    heading: "Receive approved updates when relevant events occur.",
    description:
      "Webhooks help approved Apps receive event notifications without repeatedly polling the API.",
    items: [
      "Property and listing changes",
      "Recommendation availability",
      "Payment and subscription status",
      "App status changes",
      "Delivery attempts and retry visibility",
      "HTTPS endpoints and signature verification",
    ],
  },
] as const;

const journey = [
  "Submit an API Partner application",
  "Track the review",
  "Receive a decision",
  "Create or activate your API App",
  "Accept required policies",
  "Activate the subscription",
  "Create an API key",
  "Review documentation",
  "Configure webhooks",
  "Test, launch, and monitor",
] as const;

const faqs = [
  {
    question: "What is an API App?",
    answer:
      "An API App represents the product, platform, service, website, or internal system that connects to Asancha.",
  },
  {
    question: "Is an API App the same as my organisation?",
    answer:
      "No. The organisation is the approved business or legal entity. An App is a specific integration operated by that organisation.",
  },
  {
    question: "Can anyone create an API key?",
    answer:
      "No. API keys are available only through an approved and active API App.",
  },
  {
    question: "Can an App access all Asancha data?",
    answer:
      "No. Each App receives only the smallest set of approved scopes and data necessary for its authorised use case.",
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

function AnimatedSection({
  children,
  className,
  labelledBy,
}: {
  children: ReactNode;
  className?: string;
  labelledBy?: string;
}) {
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

export function ApiPartnersPageExperience() {
  return (
    <main className="overflow-x-clip">
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
            className="max-w-5xl"
            initial="hidden"
            variants={staggerContainer}
          >
            <motion.p
              className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-4 py-2 text-xs font-bold uppercase tracking-wide text-primary-foreground/85 backdrop-blur-md"
              variants={cardReveal}
            >
              <Code2 aria-hidden="true" size={14} strokeWidth={2.5} />
              Asancha API partnerships
            </motion.p>

            <motion.h1
              className="mt-6 max-w-4xl text-4xl font-extrabold leading-tight tracking-normal sm:text-6xl"
              variants={cardReveal}
            >
              Bring property intelligence into your App.
            </motion.h1>

            <motion.p
              className="mt-6 max-w-3xl text-lg leading-8 text-primary-foreground/80"
              variants={cardReveal}
            >
              Connect your product, platform, website, or internal system to
              selected Asancha property sourcing and property intelligence
              capabilities through a controlled partner workspace.
            </motion.p>

            <motion.div
              className="mt-9 flex flex-col gap-3 sm:flex-row"
              variants={cardReveal}
            >
              <Link
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary-hover focus:outline-none focus:ring-4 focus:ring-primary-foreground/30"
                href="/api-partner/apply"
              >
                Apply for API access
                <ArrowRight aria-hidden="true" size={17} strokeWidth={2.5} />
              </Link>
              <Link
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-primary-foreground/35 bg-primary-foreground/10 px-6 py-3 text-sm font-bold text-primary-foreground backdrop-blur-sm hover:bg-primary-foreground/20 focus:outline-none focus:ring-4 focus:ring-primary-foreground/30"
                href="/api-partner/application-status"
              >
                Check application status
              </Link>
            </motion.div>

            <motion.ul
              className="mt-8 grid gap-3 sm:grid-cols-2"
              variants={staggerContainer}
            >
              {trustIndicators.map((indicator) => (
                <motion.li
                  className="flex items-center gap-2 text-sm font-bold text-primary-foreground/80"
                  key={indicator}
                  variants={cardReveal}
                >
                  <CheckCircle2
                    aria-hidden="true"
                    className="shrink-0 text-primary"
                    size={16}
                    strokeWidth={2.5}
                  />
                  <span>{indicator}</span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        </div>
      </section>

      <AnimatedSection
        className="border-b border-border bg-background"
        labelledBy="api-benefits-heading"
      >
        <div className="asancha-page-container py-16">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-wide text-primary">
              API partner benefits
            </p>
            <h2
              className="mt-3 text-3xl font-extrabold tracking-normal text-foreground sm:text-4xl"
              id="api-benefits-heading"
            >
              Build property features without recreating every workflow.
            </h2>
          </div>

          <motion.div
            className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4"
            initial="hidden"
            viewport={{ once: true, amount: 0.15 }}
            variants={staggerContainer}
            whileInView="show"
          >
            {partnerBenefits.map((benefit) => {
              const Icon = benefit.icon;

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

      {featureSections.map((section, index) => (
        <AnimatedSection
          className={index % 2 === 0 ? "bg-muted" : "bg-card"}
          key={section.heading}
          labelledBy={`api-feature-${index}-heading`}
        >
          <div className="asancha-page-container py-16">
            <div className="grid gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-primary">
                  {section.eyebrow}
                </p>
                <h2
                  className="mt-3 text-3xl font-extrabold tracking-normal text-foreground sm:text-4xl"
                  id={`api-feature-${index}-heading`}
                >
                  {section.heading}
                </h2>
                <p className="mt-4 text-base leading-7 text-muted-foreground">
                  {section.description}
                </p>
              </div>

              <motion.ul
                className="grid gap-3 sm:grid-cols-2"
                initial="hidden"
                viewport={{ once: true, amount: 0.15 }}
                variants={staggerContainer}
                whileInView="show"
              >
                {section.items.map((item) => (
                  <motion.li
                    className="flex gap-3 rounded-lg border border-border bg-background p-4 text-sm font-bold text-foreground shadow-sm"
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
      ))}

      <AnimatedSection className="bg-background" labelledBy="api-journey-heading">
        <div className="asancha-page-container py-16">
          <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
            <div className="lg:sticky lg:top-24">
              <p className="text-sm font-bold uppercase tracking-wide text-primary">
                Your route to integration
              </p>
              <h2
                className="mt-3 text-3xl font-extrabold tracking-normal text-foreground sm:text-4xl"
                id="api-journey-heading"
              >
                From application to an active API App.
              </h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                Submitting an application begins the review process. It does not
                create an App, issue a key, approve scopes, activate billing, or
                grant production access.
              </p>
            </div>

            <motion.ol
              className="relative grid gap-4 before:absolute before:bottom-4 before:left-5 before:top-4 before:w-px before:bg-border"
              initial="hidden"
              viewport={{ once: true, amount: 0.15 }}
              variants={staggerContainer}
              whileInView="show"
            >
              {journey.map((step, index) => (
                <motion.li
                  className="relative flex gap-4 rounded-lg border border-border bg-card p-4 shadow-sm"
                  key={step}
                  variants={cardReveal}
                >
                  <span className="z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary text-sm font-extrabold text-primary-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="pt-2 text-sm font-bold text-card-foreground">
                    {step}
                  </h3>
                </motion.li>
              ))}
            </motion.ol>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="bg-muted" labelledBy="api-safety-heading">
        <div className="asancha-page-container py-16">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-primary">
                Shared security
              </p>
              <h2
                className="mt-3 text-3xl font-extrabold tracking-normal text-foreground sm:text-4xl"
                id="api-safety-heading"
              >
                Protect every App, key and data flow.
              </h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                API Partners must use Asancha services, data, and events only
                for the approved App, use case, scopes, and contractual purpose.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-accent text-primary">
                  <LockKeyhole aria-hidden="true" size={18} strokeWidth={2.5} />
                </span>
                <h3 className="font-bold text-card-foreground">
                  Do not expose
                </h3>
              </div>
              <ul className="mt-5 grid gap-3 text-sm font-bold text-foreground sm:grid-cols-2">
                {[
                  "Live API keys",
                  "Webhook secrets",
                  "Private API base URLs",
                  "Internal security findings",
                  "Staff-only scopes",
                  "Private error traces",
                ].map((item) => (
                  <li
                    className="rounded-lg border border-border bg-muted p-3"
                    key={item}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="bg-background" labelledBy="api-faq-heading">
        <div className="asancha-page-container py-16">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-wide text-primary">
              API Partner questions
            </p>
            <h2
              className="mt-3 text-3xl font-extrabold tracking-normal text-foreground sm:text-4xl"
              id="api-faq-heading"
            >
              Know what approval does and does not unlock.
            </h2>
          </div>
          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            {faqs.map((faq) => (
              <article
                className="rounded-lg border border-border bg-card p-5 shadow-sm"
                key={faq.question}
              >
                <h3 className="font-bold text-card-foreground">
                  {faq.question}
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {faq.answer}
                </p>
              </article>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <section className="bg-primary" aria-labelledby="api-final-heading">
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
                Build with Asancha
              </p>
              <h2
                className="mt-3 max-w-3xl text-3xl font-extrabold tracking-normal sm:text-4xl"
                id="api-final-heading"
              >
                Apply for API access.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-primary-foreground/80">
                Tell us about your organisation, proposed App, integration use
                case, expected usage, requested property capabilities, and
                security approach.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-foreground px-6 py-3 text-sm font-bold text-background hover:bg-foreground/80 focus:outline-none focus:ring-4 focus:ring-primary-foreground/40"
                href="/api-partner/apply"
              >
                Apply for API access
                <Activity aria-hidden="true" size={17} strokeWidth={2.5} />
              </Link>
              <Link
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-primary-foreground/35 px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary-foreground/10 focus:outline-none focus:ring-4 focus:ring-primary-foreground/40"
                href="/contact"
              >
                Contact Asancha
                <Webhook aria-hidden="true" size={17} strokeWidth={2.5} />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
