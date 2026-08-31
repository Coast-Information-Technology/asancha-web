// File: app/(public)/solutions/property-owners/_components/property-owners-page-experience.tsx

import {
  ArrowRight,
  BadgeCheck,
  Building2,
  ClipboardCheck,
  FileImage,
  FolderKanban,
  ListChecks,
  LockKeyhole,
  Plus,
  PoundSterling,
  SearchCheck,
  ShieldCheck,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import { section as MotionSection } from "framer-motion/client";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

const LIST_PROPERTY_PATH = "/dashboard/property-owner/properties/new";

const benefits = [
  {
    title: "Reach Relevant Investors",
    description:
      "Present approved property opportunities to investors looking for properties matching their requirements.",
    icon: UsersRound,
  },
  {
    title: "Protect Sensitive Information",
    description:
      "Keep sensitive property, ownership and deal information appropriately controlled.",
    icon: LockKeyhole,
  },
  {
    title: "Manage Everything in One Place",
    description:
      "Manage your property information, documents and progression from your account.",
    icon: FolderKanban,
  },
  {
    title: "Track Your Progress",
    description:
      "See when your property is being reviewed, requires action or progresses through the appropriate stages.",
    icon: TrendingUp,
  },
] as const;

const requirements = [
  {
    title: "Property Details",
    description:
      "Property type, location, bedrooms, tenure and occupancy information.",
    icon: Building2,
  },
  {
    title: "Price & Investment Information",
    description:
      "Asking price, rental information and relevant investment information where applicable.",
    icon: PoundSterling,
  },
  {
    title: "Photos & Description",
    description:
      "Images, features and information that help investors understand the opportunity.",
    icon: FileImage,
  },
  {
    title: "Ownership / Authority Information",
    description:
      "Information confirming that you own the property or are authorised to submit it.",
    icon: ClipboardCheck,
  },
] as const;

const journeySteps = [
  {
    title: "List Your Property",
    description: "Create your account and tell us about the property.",
    icon: Building2,
  },
  {
    title: "Verify & Review",
    description:
      "Provide any required ownership or authority information and submit the property for review.",
    icon: SearchCheck,
  },
  {
    title: "Reach Relevant Investors",
    description:
      "Once approved for publication, the opportunity can be presented to relevant investors.",
    icon: UsersRound,
  },
  {
    title: "Track & Progress",
    description:
      "Manage the property and follow its progression through your account.",
    icon: ListChecks,
  },
] as const;

const trustControls = [
  {
    title: "Ownership & Authority Checks",
    description:
      "We may ask for information confirming that you own the property or are authorised to submit it.",
    icon: BadgeCheck,
  },
  {
    title: "Protected Information",
    description:
      "Sensitive property, ownership and deal information is kept separate from public information and made available only where appropriate.",
    icon: LockKeyhole,
  },
  {
    title: "Controlled Publication",
    description:
      "Submitting a property does not automatically publish it. Opportunities follow the appropriate review and publication process.",
    icon: ShieldCheck,
  },
] as const;

const ownerFaqs = [
  {
    question: "Can I start listing before creating an account?",
    answer:
      "Yes. Select List My Property to begin. You will be guided to create or sign in to an account before entering and submitting protected property information.",
  },
  {
    question: "Does submitting a property guarantee publication?",
    answer:
      "No. A property may require review, supporting documents, corrections, policy acceptance or verification before it can be approved for publication.",
  },
  {
    question: "Can I submit a property I do not own?",
    answer:
      "Only where you have lawful authority to represent the owner. We may ask you to provide information or evidence confirming that authority.",
  },
  {
    question: "Will my full address appear publicly?",
    answer:
      "Not necessarily. Public visibility depends on the approved listing information, privacy requirements and the property’s publication status. Sensitive address information remains controlled where appropriate.",
  },
  {
    question: "Does Asancha guarantee a buyer?",
    answer:
      "No. Asancha helps present approved opportunities to relevant investors and property professionals, but does not guarantee interest, an offer, exchange or completion.",
  },
  {
    question: "Can I update or withdraw my property?",
    answer:
      "Where permitted, you can request an update or withdrawal through your account. Some changes may require another review, and available actions can depend on the property’s current status.",
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
    <MotionSection
      aria-labelledby={labelledBy}
      className={className}
      initial="hidden"
      viewport={{ once: true, amount: 0.16 }}
      variants={sectionReveal}
      whileInView="show"
    >
      {children}
    </MotionSection>
  );
}

function PrimaryAction({ children }: { children: ReactNode }) {
  return (
    <Link
      className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold !text-white transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-2"
      href={LIST_PROPERTY_PATH}
    >
      {children}
      <ArrowRight aria-hidden="true" size={17} strokeWidth={2.5} />
    </Link>
  );
}

function SectionHeading({
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

export function PropertyOwnersPageExperience() {
  return (
    <main className="overflow-x-clip">
      <section
        aria-labelledby="property-owner-hero-heading"
        className="relative isolate overflow-hidden bg-foreground text-primary-foreground"
      >
        <Image
          aria-hidden="true"
          alt=""
          className="absolute inset-0 -z-20 object-cover object-center"
          fetchPriority="high"
          fill
          loading="eager"
          quality={70}
          sizes="100vw"
          src="/images/og/asancha-homepage-og.jpg"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(2,6,23,0.97)_0%,rgba(2,6,23,0.82)_55%,rgba(2,6,23,0.52)_100%)]"
        />

        <div className="asancha-page-container py-20 sm:py-28">
          <div className="max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary-foreground/78">
              List your property
            </p>
            <h1
              className="mt-5 text-4xl font-extrabold leading-tight tracking-normal text-primary-foreground sm:text-5xl lg:text-6xl"
              id="property-owner-hero-heading"
            >
              List Your Property and Reach Relevant Buyers &amp; Investors
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-primary-foreground/82 sm:text-xl">
              Submit your property to Asancha and connect with relevant
              investors and property professionals through a structured, secure
              process.
            </p>
            <nav
              aria-label="Property listing actions"
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <PrimaryAction>List My Property</PrimaryAction>
              <Link
                className="inline-flex min-h-12 cursor-pointer items-center justify-center rounded-xl border border-primary-foreground/35 bg-primary-foreground/10 px-6 py-3 text-sm font-bold text-primary-foreground backdrop-blur-sm transition hover:bg-primary-foreground/20 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-foreground"
                href="#how-it-works"
              >
                How It Works
              </Link>
            </nav>
          </div>
        </div>
      </section>

      <AnimatedSection
        className="border-b border-border bg-background"
        labelledBy="property-owner-benefits-heading"
      >
        <div className="asancha-page-container py-16">
          <SectionHeading
            description="Reach the right audience while keeping your property information organised, controlled and easy to manage."
            eyebrow="Benefits"
            id="property-owner-benefits-heading"
            title="Why List Your Property on Asancha?"
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => (
              <article
                className="rounded-2xl border border-border bg-card p-6 shadow-sm"
                key={benefit.title}
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-primary">
                  <benefit.icon aria-hidden="true" size={21} />
                </span>
                <h3 className="mt-5 text-lg font-bold text-card-foreground">
                  {benefit.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {benefit.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection
        className="border-b border-border bg-muted"
        labelledBy="property-owner-requirements-heading"
      >
        <div className="asancha-page-container py-16">
          <SectionHeading
            description="You do not need to prepare everything at once. The listing journey will guide you through the relevant information at the right stage."
            eyebrow="Prepare your listing"
            id="property-owner-requirements-heading"
            title="What You’ll Need"
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {requirements.map((requirement) => (
              <article
                className="grid grid-cols-[auto_1fr] gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm"
                key={requirement.title}
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-primary">
                  <requirement.icon aria-hidden="true" size={21} />
                </span>
                <div>
                  <h3 className="text-lg font-bold text-card-foreground">
                    {requirement.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {requirement.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-8">
            <PrimaryAction>Start Listing Your Property</PrimaryAction>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection
        className="border-b border-border bg-background"
        labelledBy="property-owner-journey-heading"
      >
        <div
          className="asancha-page-container scroll-mt-24 py-16"
          id="how-it-works"
        >
          <SectionHeading
            description="A clear customer journey, supported by the appropriate checks and review stages behind the scenes."
            eyebrow="A simple journey"
            id="property-owner-journey-heading"
            title="How It Works"
          />
          <ol className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {journeySteps.map((step, index) => (
              <li
                className="relative rounded-2xl border border-border bg-card p-6 shadow-sm"
                key={step.title}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-primary text-primary-foreground">
                    <step.icon aria-hidden="true" size={20} />
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wide text-primary">
                    Step {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-6 text-lg font-bold text-card-foreground">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </AnimatedSection>

      <AnimatedSection
        className="border-b border-border bg-foreground text-primary-foreground"
        labelledBy="property-owner-trust-heading"
      >
        <div className="asancha-page-container py-16">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-wide text-primary-foreground/65">
              Trust &amp; control
            </p>
            <h2
              className="mt-3 text-3xl font-extrabold leading-tight tracking-normal text-primary-foreground sm:text-4xl"
              id="property-owner-trust-heading"
            >
              Secure &amp; Controlled Property Listing
            </h2>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {trustControls.map((control) => (
              <article
                className="rounded-2xl border border-primary-foreground/15 bg-primary-foreground/8 p-6"
                key={control.title}
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary-foreground/10">
                  <control.icon aria-hidden="true" size={21} />
                </span>
                <h3 className="mt-5 text-lg font-bold text-primary-foreground">
                  {control.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-primary-foreground/72">
                  {control.description}
                </p>
              </article>
            ))}
          </div>
          <Link
            className="mt-8 inline-flex min-h-11 cursor-pointer items-center gap-2 text-sm font-bold text-primary-foreground hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary-foreground"
            href="/how-it-works"
          >
            Learn More about Verification &amp; Access
            <ArrowRight aria-hidden="true" size={16} />
          </Link>
        </div>
      </AnimatedSection>

      <AnimatedSection
        className="bg-background"
        labelledBy="property-owner-faq-heading"
      >
        <div className="asancha-page-container py-16">
          <SectionHeading
            eyebrow="Questions"
            id="property-owner-faq-heading"
            title="Frequently Asked Questions"
          />
          <div className="mt-10 grid gap-3">
            {ownerFaqs.map((faq) => (
              <details
                className="group rounded-xl border border-border bg-card shadow-sm"
                key={faq.question}
              >
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-bold text-card-foreground marker:content-none focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-inset focus-visible:ring-ring">
                  <span>{faq.question}</span>
                  <Plus
                    aria-hidden="true"
                    className="shrink-0 text-primary transition-transform group-open:rotate-45"
                    size={20}
                  />
                </summary>
                <div className="border-t border-border px-5 py-4">
                  <p className="max-w-4xl text-sm leading-6 text-muted-foreground">
                    {faq.answer}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection
        className="bg-primary"
        labelledBy="property-owner-final-heading"
      >
        <div className="asancha-page-container flex flex-col gap-7 py-16 text-primary-foreground sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-primary-foreground/70">
              Next step
            </p>
            <h2
              className="mt-3 text-3xl font-extrabold sm:text-4xl"
              id="property-owner-final-heading"
            >
              Ready to List Your Property?
            </h2>
          </div>
          <Link
            className="inline-flex min-h-12 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl bg-foreground px-6 py-3 text-sm font-bold text-background transition hover:bg-foreground/80 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
            href={LIST_PROPERTY_PATH}
          >
            List My Property
            <ArrowRight aria-hidden="true" size={17} strokeWidth={2.5} />
          </Link>
        </div>
      </AnimatedSection>
    </main>
  );
}
