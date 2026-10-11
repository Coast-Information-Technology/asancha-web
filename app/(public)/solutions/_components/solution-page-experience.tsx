"use client";

import Link from "next/link";
import Image from "next/image";
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
  Plus,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";

import { MarketplaceListingCard } from "@/src/components/marketplace/marketplace-listing-card";
import type { MarketplaceListingCard as MarketplaceListingCardType } from "@/src/features/marketplace/types/marketplace.types";

type IconName =
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
type Card = {
  title: string;
  description: string;
  icon?: IconName;
  href?: string;
  action?: string;
};
type Metric = { label: string; value: string };
type ContentSection =
  | {
      kind: "steps";
      eyebrow: string;
      heading: string;
      description: string;
      items: Card[];
    }
  | {
      kind: "cards";
      eyebrow: string;
      heading: string;
      description: string;
      items: Card[];
    }
  | {
      kind: "showcase";
      eyebrow: string;
      heading: string;
      description: string;
      label: string;
      title: string;
      badge?: string;
      metrics?: Metric[];
      details: string[];
      note?: string;
      image?: { src: string; alt: string };
      action?: { label: string; href: string };
    }
  | {
      kind: "listings";
      eyebrow: string;
      heading: string;
      description: string;
      items: MarketplaceListingCardType[];
      action: { label: string; href: string };
      note?: string;
    }
  | {
      kind: "workspace";
      eyebrow: string;
      heading: string;
      description: string;
      stats: Metric[];
      tabs: string[];
      items: Array<{
        title: string;
        meta: string;
        status: string;
        actions?: string[];
      }>;
    }
  | {
      kind: "split";
      eyebrow: string;
      heading: string;
      description: string;
      leftTitle: string;
      leftItems: string[];
      rightTitle: string;
      rightItems: string[];
    }
  | {
      kind: "comparison";
      eyebrow: string;
      heading: string;
      description: string;
      columns: Array<{ title: string; badge?: string; items: Metric[] }>;
    }
  | {
      kind: "checklist";
      eyebrow: string;
      heading: string;
      description: string;
      items: string[];
    }
  | {
      kind: "timeline";
      eyebrow: string;
      heading: string;
      description: string;
      items: string[];
    }
  | {
      kind: "route";
      eyebrow: string;
      heading: string;
      description: string;
      routes: Array<{
        title: string;
        description: string;
        href: string;
        action: string;
      }>;
    };

export interface SolutionPageExperienceProps {
  eyebrow: string;
  title: string;
  description: string;
  primaryAction: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
  utilityAction?: { label: string; href: string };
  trustIndicators: string[];
  sections: ContentSection[];
  faqs: Array<{ question: string; answer: string }>;
  finalCtaHeading: string;
  finalCtaDescription: string;
}

const icons: Record<IconName, LucideIcon> = {
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
};
const reveal = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
} as const;
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
} as const;

function Section({
  children,
  className = "bg-background",
  id,
}: {
  children: ReactNode;
  className?: string;
  id: string;
}) {
  return (
    <motion.section
      aria-labelledby={id}
      className={className}
      initial="hidden"
      viewport={{ once: true, amount: 0.12 }}
      variants={reveal}
      whileInView="show"
    >
      <div className="asancha-page-container py-16 sm:py-20">{children}</div>
    </motion.section>
  );
}
function Heading({
  eyebrow,
  heading,
  description,
  id,
}: {
  eyebrow: string;
  heading: string;
  description: string;
  id: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm font-bold uppercase tracking-wide text-primary">
        {eyebrow}
      </p>
      <h2
        className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
        id={id}
      >
        {heading}
      </h2>
      <p className="mt-4 text-base leading-7 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
function CardGrid({ items }: { items: Card[] }) {
  return (
    <motion.div
      className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4"
      initial="hidden"
      viewport={{ once: true, amount: 0.1 }}
      variants={stagger}
      whileInView="show"
    >
      {items.map((item) => {
        const Icon = icons[item.icon ?? "check"];
        return (
          <motion.article
            className="rounded-2xl border border-border bg-card p-6 shadow-sm"
            key={item.title}
            variants={reveal}
            whileHover={{ y: -3 }}
          >
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-primary">
              <Icon aria-hidden="true" size={20} />
            </span>
            <h3 className="mt-5 text-lg font-bold text-card-foreground">
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {item.description}
            </p>
            {item.href ? (
              <Link
                className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
                href={item.href}
              >
                {item.action ?? "Explore"}
                <ArrowRight aria-hidden="true" size={16} />
              </Link>
            ) : null}
          </motion.article>
        );
      })}
    </motion.div>
  );
}
function ListPanel({
  icon: Icon,
  items,
  title,
}: {
  icon: LucideIcon;
  items: string[];
  title: string;
}) {
  return (
    <article className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-primary">
          <Icon size={18} />
        </span>
        <h3 className="text-lg font-bold text-card-foreground">{title}</h3>
      </div>
      <ul className="mt-5 grid gap-3">
        {items.map((item) => (
          <li
            className="flex gap-3 text-sm leading-6 text-foreground"
            key={item}
          >
            <CheckCircle2 className="mt-1 shrink-0 text-primary" size={16} />
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}

function RenderSection({
  section,
  index,
}: {
  section: ContentSection;
  index: number;
}) {
  const id = `solution-section-${index}`;
  const bg = index % 2 ? "border-y border-border bg-muted" : "bg-background";
  if (section.kind === "steps")
    return (
      <Section className={bg} id={id}>
        <Heading {...section} id={id} />
        <motion.ol
          className={`mt-10 grid gap-5 md:grid-cols-2 ${section.items.length === 5 ? "lg:grid-cols-5" : "lg:grid-cols-4"}`}
          variants={stagger}
        >
          {section.items.map((item, i) => (
            <motion.li
              className="rounded-2xl border border-border bg-card p-6 shadow-sm"
              key={item.title}
              variants={reveal}
            >
              <span className="text-sm font-extrabold text-primary">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="mt-4 h-px bg-border" />
              <h3 className="mt-5 text-lg font-bold text-card-foreground">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {item.description}
              </p>
            </motion.li>
          ))}
        </motion.ol>
      </Section>
    );
  if (section.kind === "cards")
    return (
      <Section className={bg} id={id}>
        <Heading {...section} id={id} />
        <CardGrid items={section.items} />
      </Section>
    );
  if (section.kind === "showcase")
    return (
      <Section className={bg} id={id}>
        <div className="grid gap-10 lg:grid-cols-[.82fr_1.18fr] lg:items-center">
          <Heading {...section} id={id} />
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-xl">
            {section.image ? (
              <div className="relative aspect-[16/7] overflow-hidden bg-muted">
                <Image
                  alt={section.image.alt}
                  className="object-cover"
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  src={section.image.src}
                />
              </div>
            ) : null}
            <div className="flex items-center justify-between gap-4 border-b border-border px-6 py-4">
              <p className="text-xs font-bold uppercase tracking-wide text-primary">
                {section.label}
              </p>
              {section.badge && (
                <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-primary">
                  {section.badge}
                </span>
              )}
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-extrabold text-card-foreground">
                {section.title}
              </h3>
              {section.metrics?.length ? (
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {section.metrics.map((m) => (
                    <div className="rounded-xl bg-muted p-4" key={m.label}>
                      <p className="text-lg font-extrabold text-foreground">
                        {m.value}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {m.label}
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {section.details.map((d) => (
                  <li className="flex gap-2 text-sm leading-6" key={d}>
                    <CheckCircle2
                      className="mt-1 shrink-0 text-primary"
                      size={16}
                    />
                    {d}
                  </li>
                ))}
              </ul>
              {section.note && (
                <p className="mt-6 rounded-xl border border-border bg-muted p-4 text-xs leading-5 text-muted-foreground">
                  {section.note}
                </p>
              )}
              {section.action ? (
                <Link
                  className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary-hover"
                  href={section.action.href}
                >
                  {section.action.label}
                  <ArrowRight aria-hidden="true" size={16} />
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </Section>
    );
  if (section.kind === "listings")
    return (
      <Section className={bg} id={id}>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <Heading {...section} id={id} />
          <Link
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-bold text-primary shadow-sm hover:bg-muted"
            href={section.action.href}
          >
            {section.action.label}
            <ArrowRight aria-hidden="true" size={16} />
          </Link>
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {section.items.map((listing) => (
            <MarketplaceListingCard
              headingLevel={3}
              key={listing.listingPublicId}
              listing={listing}
              viewMode="grid"
            />
          ))}
        </div>
        {section.note ? (
          <p className="mt-6 text-sm leading-6 text-muted-foreground">
            {section.note}
          </p>
        ) : null}
      </Section>
    );
  if (section.kind === "workspace")
    return (
      <Section className={bg} id={id}>
        <Heading {...section} id={id} />
        <div className="mt-10 overflow-hidden rounded-3xl border border-border bg-card shadow-xl">
          <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
            {section.stats.map((s) => (
              <div className="bg-card p-5" key={s.label}>
                <p className="text-2xl font-extrabold text-primary">
                  {s.value}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="border-y border-border px-5 py-3">
            <div className="flex gap-2 overflow-x-auto">
              {section.tabs.map((tab, i) => (
                <span
                  className={`shrink-0 rounded-lg px-3 py-2 text-xs font-bold ${i ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground"}`}
                  key={tab}
                >
                  {tab}
                </span>
              ))}
            </div>
          </div>
          <div className="divide-y divide-border">
            {section.items.map((item) => (
              <div
                className="grid gap-2 p-5 sm:grid-cols-[1fr_auto] sm:items-center"
                key={item.title}
              >
                <div>
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.meta}
                  </p>
                  {item.actions?.length ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {item.actions.map((action) => (
                        <span
                          className="rounded-lg border border-border bg-muted px-2.5 py-1 text-xs font-bold text-foreground"
                          key={action}
                        >
                          {action}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
                <span className="w-fit rounded-full bg-accent px-3 py-1 text-xs font-bold text-primary">
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Section>
    );
  if (section.kind === "split")
    return (
      <Section className={bg} id={id}>
        <Heading {...section} id={id} />
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <ListPanel
            icon={CheckCircle2}
            items={section.leftItems}
            title={section.leftTitle}
          />
          <ListPanel
            icon={LockKeyhole}
            items={section.rightItems}
            title={section.rightTitle}
          />
        </div>
      </Section>
    );
  if (section.kind === "comparison")
    return (
      <Section className={bg} id={id}>
        <Heading {...section} id={id} />
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {section.columns.map((c) => (
            <article
              className="rounded-2xl border border-border bg-card p-6 shadow-sm"
              key={c.title}
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-bold">{c.title}</h3>
                {c.badge && (
                  <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-primary">
                    {c.badge}
                  </span>
                )}
              </div>
              <dl className="mt-5 grid gap-3">
                {c.items.map((m) => (
                  <div
                    className="flex justify-between gap-4 border-t border-border pt-3 text-sm"
                    key={m.label}
                  >
                    <dt className="text-muted-foreground">{m.label}</dt>
                    <dd className="font-bold">{m.value}</dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>
      </Section>
    );
  if (section.kind === "checklist")
    return (
      <Section className={bg} id={id}>
        <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
          <Heading {...section} id={id} />
          <ul className="grid gap-3 sm:grid-cols-2">
            {section.items.map((item) => (
              <li
                className="flex gap-3 rounded-xl border border-border bg-card p-4 text-sm font-bold"
                key={item}
              >
                <CheckCircle2 className="shrink-0 text-primary" size={18} />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Section>
    );
  if (section.kind === "timeline")
    return (
      <Section className={bg} id={id}>
        <Heading {...section} id={id} />
        <ol className="mt-10 flex flex-col gap-3 lg:flex-row">
          {section.items.map((item, i) => (
            <li
              className="flex flex-1 items-center gap-3 rounded-xl border border-border bg-card p-4"
              key={item}
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {i + 1}
              </span>
              <span className="text-sm font-bold">{item}</span>
            </li>
          ))}
        </ol>
      </Section>
    );
  return (
    <Section className={bg} id={id}>
      <Heading {...section} id={id} />
      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        {section.routes.map((r) => (
          <article
            className="rounded-2xl border border-border bg-card p-6 shadow-sm"
            key={r.title}
          >
            <h3 className="text-xl font-bold">{r.title}</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {r.description}
            </p>
            <Link
              className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
              href={r.href}
            >
              {r.action}
              <ArrowRight size={16} />
            </Link>
          </article>
        ))}
      </div>
    </Section>
  );
}

export function SolutionPageExperience(props: SolutionPageExperienceProps) {
  return (
    <main className="overflow-x-clip">
      <section className="relative isolate overflow-hidden bg-foreground text-primary-foreground">
        <div
          aria-hidden
          className="absolute inset-0 -z-20 bg-[url('/auth-bg.avif')] bg-cover bg-center"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(2,6,23,.97),rgba(2,6,23,.78)_58%,rgba(2,6,23,.42))]"
        />
        <div className="asancha-page-container py-20 sm:py-28">
          <motion.div
            animate="show"
            className="max-w-5xl"
            initial="hidden"
            variants={stagger}
          >
            <motion.p
              className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-4 py-2 text-xs font-bold uppercase tracking-wide"
              variants={reveal}
            >
              <Sparkles size={14} />
              {props.eyebrow}
            </motion.p>
            <motion.h1
              className="mt-6 max-w-4xl text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl"
              variants={reveal}
            >
              {props.title}
            </motion.h1>
            <motion.p
              className="mt-6 max-w-3xl text-lg leading-8 text-primary-foreground/80"
              variants={reveal}
            >
              {props.description}
            </motion.p>
            <motion.div
              className="mt-9 flex flex-col gap-3 sm:flex-row"
              variants={reveal}
            >
              <Link
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary-hover"
                href={props.primaryAction.href}
              >
                {props.primaryAction.label}
                <ArrowRight size={17} />
              </Link>
              {props.secondaryAction && (
                <Link
                  className="inline-flex min-h-12 items-center justify-center rounded-xl border border-primary-foreground/35 bg-primary-foreground/10 px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary-foreground/20"
                  href={props.secondaryAction.href}
                >
                  {props.secondaryAction.label}
                </Link>
              )}
            </motion.div>
            {props.utilityAction ? (
              <motion.p className="mt-4" variants={reveal}>
                <Link
                  className="text-sm font-bold text-primary-foreground/80 underline-offset-4 hover:text-primary-foreground hover:underline"
                  href={props.utilityAction.href}
                >
                  {props.utilityAction.label}
                </Link>
              </motion.p>
            ) : null}
            <motion.ul
              className="mt-8 flex flex-wrap gap-x-6 gap-y-3"
              variants={stagger}
            >
              {props.trustIndicators.map((item) => (
                <motion.li
                  className="flex items-center gap-2 text-sm font-bold text-primary-foreground/80"
                  key={item}
                  variants={reveal}
                >
                  <CheckCircle2 className="text-primary" size={16} />
                  {item}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        </div>
      </section>
      {props.sections.map((s, i) => (
        <RenderSection index={i} key={`${s.kind}-${s.heading}`} section={s} />
      ))}
      <Section id="solution-faq-heading">
        <Heading
          description="Practical answers about joining, visibility, review and progression."
          eyebrow="Questions"
          heading="Frequently asked questions"
          id="solution-faq-heading"
        />
        <div className="mt-10 grid gap-3">
          {props.faqs.map((faq) => (
            <details
              className="group rounded-xl border border-border bg-card shadow-sm"
              key={faq.question}
            >
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-bold">
                <span>{faq.question}</span>
                <Plus
                  className="shrink-0 text-primary transition-transform group-open:rotate-45"
                  size={20}
                />
              </summary>
              <p className="border-t border-border px-5 py-4 text-sm leading-6 text-muted-foreground">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </Section>
      <section aria-labelledby="solution-final-heading" className="bg-primary">
        <div className="asancha-page-container flex flex-col gap-7 py-16 text-primary-foreground sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-primary-foreground/70">
              Next step
            </p>
            <h2
              className="mt-3 text-3xl font-extrabold sm:text-4xl"
              id="solution-final-heading"
            >
              {props.finalCtaHeading}
            </h2>
            <p className="mt-3 max-w-2xl text-primary-foreground/80">
              {props.finalCtaDescription}
            </p>
          </div>
          <Link
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-foreground px-6 py-3 text-sm font-bold text-background hover:bg-foreground/80"
            href={props.primaryAction.href}
          >
            {props.primaryAction.label}
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </main>
  );
}
