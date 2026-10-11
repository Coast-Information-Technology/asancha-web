import { ArrowRight, CheckCircle2, FileCheck2, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export interface ServiceContent {
  slug: string;
  label: string;
  title: string;
  description: string;
  image: string;
  heroLinks: readonly { label: string; href: string }[];
  sections: readonly ServiceSection[];
}

interface ServicePhoto {
  src: string;
  alt: string;
}

interface ServiceItem {
  title: string;
  paragraphs: readonly string[];
  image?: ServicePhoto;
}

interface ServiceSection {
  title: string;
  intro: readonly string[];
  image?: ServicePhoto;
  cards: readonly ServiceItem[];
  links: readonly { label: string; href: string }[];
  layout:
    | "benefits"
    | "timeline"
    | "education"
    | "property-types"
    | "graphic"
    | "grid";
  background: string;
}

interface ServiceTrustContent {
  audience: string[];
  included: string[];
  delivery: string;
  caveat: string;
  faqs: Array<{ question: string; answer: string }>;
}

const serviceTrustContent: Record<string, ServiceTrustContent> = {
  "property-sourcing": {
    audience: [
      "Investors with defined property requirements",
      "Landlords exploring additional opportunities",
      "Buyers seeking structured sourcing support",
    ],
    included: [
      "Requirements and budget discussion",
      "Opportunity identification where available",
      "Clearly labelled property and investment indicators",
      "Offer and progression coordination where agreed",
    ],
    delivery:
      "Asancha’s role, any third-party involvement and the applicable sourcing fee are confirmed before engagement.",
    caveat:
      "Opportunity availability, price, yield, finance, buyer suitability and transaction completion are not guaranteed.",
    faqs: [
      {
        question: "Does every enquiry result in a sourced property?",
        answer:
          "No. Availability depends on your requirements, the market and the opportunities available at the relevant time.",
      },
      {
        question: "How are sourcing fees handled?",
        answer:
          "Any applicable sourcing fee, payment timing and service scope should be disclosed and agreed before you proceed.",
      },
      {
        question: "Are property figures guaranteed?",
        answer:
          "No. Facts, calculations and estimates should be reviewed separately and supported by appropriate professional due diligence.",
      },
    ],
  },
  "property-investment": {
    audience: [
      "Prospective and experienced property investors",
      "Eligible parties exploring a joint-venture discussion",
      "Businesses or funds seeking an initial opportunity conversation",
    ],
    included: [
      "Exploratory opportunity discussion",
      "Available property information and evaluation context",
      "Indicative process and next-step coordination",
      "Introductions to appropriate professionals where agreed",
    ],
    delivery:
      "An enquiry is exploratory and is not an investment offer, financial promotion, partnership commitment or confirmation that Asancha directly provides regulated advice.",
    caveat:
      "Capital is at risk. Returns, income, value growth, financing and completion are not guaranteed. Independent financial, legal and tax advice may be required.",
    faqs: [
      {
        question: "Is this an investment offer?",
        answer:
          "No. The page provides a route to enquire. Any potential arrangement requires eligibility checks, due diligence, approved information and formal documentation.",
      },
      {
        question: "Are returns or rental income guaranteed?",
        answer:
          "No. Property values, rental income, yields and returns can change and are never guaranteed by Asancha.",
      },
      {
        question: "Who provides financial or legal advice?",
        answer:
          "Regulated financial and legal advice must be provided by appropriately authorised independent professionals.",
      },
    ],
  },
  "property-management": {
    audience: [
      "Landlords and property owners",
      "Investors requiring management support",
      "Owners seeking an initial service consultation",
    ],
    included: [
      "Initial property and service-needs review",
      "Tenant, maintenance and operational coordination where agreed",
      "Defined reporting and communication arrangements",
      "A confirmed service scope before work begins",
    ],
    delivery:
      "Geographic coverage, the responsible service provider and whether Asancha delivers or coordinates each activity are confirmed during consultation.",
    caveat:
      "Service availability, tenant outcomes, payment timing and property profitability are not guaranteed.",
    faqs: [
      {
        question: "Which locations are covered?",
        answer:
          "Coverage is confirmed during consultation; the public page does not claim nationwide availability.",
      },
      {
        question: "Who performs the management work?",
        answer:
          "The responsible party and any approved third-party involvement are identified in the agreed service scope.",
      },
      {
        question: "Is rental income guaranteed?",
        answer:
          "No. Rental income, occupancy, tenant performance and profitability cannot be guaranteed.",
      },
    ],
  },
  "property-refurbishment": {
    audience: [
      "Owners planning property improvements",
      "Investors evaluating refurbishment projects",
      "Landlords preparing or updating rental property",
    ],
    included: [
      "Initial project discussion",
      "Scope and requirements review",
      "Staged planning and delivery discussion",
      "Quotation or professional introductions where applicable",
    ],
    delivery:
      "The responsible contractor, professional team, service coverage and contractual delivery scope are confirmed before work begins.",
    caveat:
      "Images are illustrative unless explicitly identified as verified Asancha project work. Cost, timing, permissions and outcomes are project-specific.",
    faqs: [
      {
        question: "What project types can I discuss?",
        answer:
          "You can enquire about refurbishment, improvement and renovation needs; feasibility and availability are confirmed after review.",
      },
      {
        question: "Are the displayed images completed Asancha projects?",
        answer:
          "Not unless the page explicitly labels and verifies them as such. General imagery is illustrative.",
      },
      {
        question: "Are quotes and completion dates guaranteed?",
        answer:
          "No. Scope, surveys, permissions, availability and formal terms determine cost and timing.",
      },
    ],
  },
  "interior-design": {
    audience: [
      "Owners planning residential interiors",
      "Landlords preparing property for occupation",
      "Investors considering presentation or furnishing requirements",
    ],
    included: [
      "Design consultation",
      "Requirements and style discussion",
      "Space, furnishing or presentation scope where available",
      "Confirmed next steps and responsible delivery party",
    ],
    delivery:
      "Service availability, coverage and whether work is delivered directly or coordinated through a third party are confirmed during consultation.",
    caveat:
      "Imagery demonstrates service categories and is not presented as verified project evidence unless explicitly labelled.",
    faqs: [
      {
        question: "What design services are available?",
        answer:
          "Available categories and the appropriate scope are confirmed after an initial consultation.",
      },
      {
        question: "Which areas are covered?",
        answer:
          "Availability and geographic coverage are confirmed when your enquiry is reviewed.",
      },
      {
        question: "Are the displayed interiors completed Asancha projects?",
        answer:
          "Not unless they are specifically identified and approved as authentic project examples.",
      },
    ],
  },
};

const sectionClass = "border-b border-border bg-background";
const mutedSectionClass = "border-b border-border bg-muted";

function SectionHeading({
  description,
  id,
  title,
}: {
  description?: string;
  id: string;
  title: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-sm font-bold uppercase tracking-wide text-primary">
        Asancha services
      </p>
      <h2
        className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
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

function ItemCopy({ item }: { item: ServiceItem }) {
  return item.paragraphs.map((paragraph) => (
    <p className="mt-2 text-sm leading-6 text-muted-foreground" key={paragraph}>
      {paragraph}
    </p>
  ));
}

function ServiceIcon({ item }: { item: ServiceItem }) {
  if (!item.image) {
    return (
      <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-primary">
        <CheckCircle2 aria-hidden="true" size={20} />
      </span>
    );
  }

  return (
    <span className="grid h-14 w-14 place-items-center rounded-xl bg-accent p-2">
      <Image
        alt={item.image.alt}
        className="h-full w-full object-contain"
        height={48}
        src={item.image.src}
        width={48}
      />
    </span>
  );
}

function CardsSection({
  index,
  section,
}: {
  index: number;
  section: ServiceSection;
}) {
  const id = `service-section-${index}`;
  const columnClass =
    section.cards.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3";

  return (
    <section
      aria-labelledby={id}
      className={index % 2 === 0 ? sectionClass : mutedSectionClass}
    >
      <div className="asancha-page-container py-16 sm:py-20">
        <SectionHeading
          description={section.intro.join(" ") || undefined}
          id={id}
          title={section.title}
        />
        <ul
          className={`mt-10 grid list-none gap-5 p-0 md:grid-cols-2 ${columnClass}`}
        >
          {section.cards.map((item) => {
            const isPhoto = item.image?.src.includes("/bg-img/");

            return (
              <li
                className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
                key={item.title}
              >
                {isPhoto && item.image ? (
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    <Image
                      alt={item.image.alt}
                      className="object-cover transition duration-500 hover:scale-105"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      src={item.image.src}
                    />
                  </div>
                ) : null}
                <div className="p-6">
                  {!isPhoto ? <ServiceIcon item={item} /> : null}
                  <h3
                    className={`${isPhoto ? "mt-0" : "mt-5"} text-lg font-bold text-card-foreground`}
                  >
                    {item.title}
                  </h3>
                  <ItemCopy item={item} />
                </div>
              </li>
            );
          })}
        </ul>
        {section.links.length ? (
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {section.links.map((link) => (
              <Link
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-2"
                href={link.href}
                key={link.label}
              >
                {link.label}
                <ArrowRight aria-hidden="true" size={17} />
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function BenefitsSection({
  index,
  section,
}: {
  index: number;
  section: ServiceSection;
}) {
  const id = `service-section-${index}`;

  return (
    <section aria-labelledby={id} className={mutedSectionClass}>
      <div className="asancha-page-container grid gap-10 py-16 sm:py-20 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-primary">
            Why Asancha
          </p>
          <h2
            className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
            id={id}
          >
            {section.title}
          </h2>
          {section.intro.map((paragraph) => (
            <p
              className="mt-4 text-base leading-7 text-muted-foreground"
              key={paragraph}
            >
              {paragraph}
            </p>
          ))}
          <ul className="mt-8 grid list-none gap-5 p-0">
            {section.cards.map((item) => (
              <li className="flex gap-4" key={item.title}>
                <ServiceIcon item={item} />
                <div>
                  <h3 className="font-bold text-card-foreground">
                    {item.title}
                  </h3>
                  <ItemCopy item={item} />
                </div>
              </li>
            ))}
          </ul>
        </div>
        {section.image ? (
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border bg-card shadow-xl">
            <Image
              alt={section.image.alt}
              className="object-cover"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              src={section.image.src}
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}

function TimelineSection({
  index,
  section,
}: {
  index: number;
  section: ServiceSection;
}) {
  const id = `service-section-${index}`;

  return (
    <section aria-labelledby={id} className={sectionClass}>
      <div className="asancha-page-container py-16 sm:py-20">
        <SectionHeading id={id} title={section.title} />
        <ol className="mt-10 grid list-none gap-5 p-0 md:grid-cols-2 lg:grid-cols-3">
          {section.cards.map((item, itemIndex) => (
            <li
              className="rounded-2xl border border-border bg-card p-6 shadow-sm"
              key={item.title}
            >
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary text-sm font-extrabold text-primary-foreground">
                  {String(itemIndex + 1).padStart(2, "0")}
                </span>
                <span className="h-px flex-1 bg-border" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-card-foreground">
                {item.title}
              </h3>
              <ItemCopy item={item} />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function EducationSection({
  index,
  section,
}: {
  index: number;
  section: ServiceSection;
}) {
  const id = `service-section-${index}`;
  const finalItem = section.cards.at(-1);

  return (
    <section
      aria-labelledby={id}
      className="border-b border-primary-foreground/10 bg-foreground text-primary-foreground"
    >
      <div className="asancha-page-container py-16 sm:py-20">
        <p className="text-sm font-bold uppercase tracking-wide text-primary">
          Invest and learn
        </p>
        <h2
          className="mt-3 max-w-3xl text-3xl font-extrabold tracking-tight sm:text-4xl"
          id={id}
        >
          {section.title}
        </h2>
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <ul className="grid list-none gap-4 p-0 sm:grid-cols-2">
            {section.cards.slice(0, -1).map((item) => (
              <li
                className="rounded-2xl border border-primary-foreground/15 bg-primary-foreground/8 p-5"
                key={item.title}
              >
                <FileCheck2 aria-hidden="true" size={22} />
                <h3 className="mt-4 font-bold">{item.title}</h3>
              </li>
            ))}
          </ul>
          {finalItem ? (
            <div className="rounded-2xl border border-primary-foreground/15 bg-primary-foreground/8 p-6">
              <h3 className="text-xl font-bold">{finalItem.title}</h3>
              <ul className="mt-5 grid list-none gap-3 p-0">
                {finalItem.paragraphs.map((paragraph) => (
                  <li className="flex gap-3 text-sm leading-6" key={paragraph}>
                    <CheckCircle2
                      aria-hidden="true"
                      className="mt-1 shrink-0 text-primary"
                      size={16}
                    />
                    {paragraph}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function GraphicSection({
  index,
  section,
}: {
  index: number;
  section: ServiceSection;
}) {
  const id = `service-section-${index}`;

  return (
    <section aria-labelledby={id} className={mutedSectionClass}>
      <div className="asancha-page-container py-16 sm:py-20">
        <SectionHeading id={id} title={section.title} />
        {section.image ? (
          <div className="relative mt-10 aspect-[16/8] overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <Image
              alt={section.image.alt}
              className="object-contain"
              fill
              sizes="(max-width: 1152px) 100vw, 1152px"
              src={section.image.src}
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}

function ContentSection({
  index,
  section,
}: {
  index: number;
  section: ServiceSection;
}) {
  if (section.layout === "benefits") {
    return <BenefitsSection index={index} section={section} />;
  }
  if (section.layout === "timeline") {
    return <TimelineSection index={index} section={section} />;
  }
  if (section.layout === "education") {
    return <EducationSection index={index} section={section} />;
  }
  if (section.layout === "graphic") {
    return <GraphicSection index={index} section={section} />;
  }

  return <CardsSection index={index} section={section} />;
}

function ScopeSection({ content }: { content: ServiceTrustContent }) {
  return (
    <section
      aria-labelledby="service-scope-heading"
      className="border-b border-border bg-background"
    >
      <div className="asancha-page-container py-16 sm:py-20">
        <SectionHeading
          description="Understand who the service is for, what an enquiry may include and the boundaries confirmed before engagement."
          id="service-scope-heading"
          title="Who It Is For and What Is Included"
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          <article className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-bold text-card-foreground">
              Who can enquire
            </h3>
            <ul className="mt-5 grid list-none gap-3 p-0">
              {content.audience.map((item) => (
                <li className="flex gap-3 text-sm leading-6" key={item}>
                  <CheckCircle2
                    aria-hidden="true"
                    className="mt-1 shrink-0 text-primary"
                    size={16}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </article>
          <article className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-bold text-card-foreground">
              What may be included
            </h3>
            <ul className="mt-5 grid list-none gap-3 p-0">
              {content.included.map((item) => (
                <li className="flex gap-3 text-sm leading-6" key={item}>
                  <CheckCircle2
                    aria-hidden="true"
                    className="mt-1 shrink-0 text-primary"
                    size={16}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </article>
          <article className="rounded-2xl border border-border bg-muted p-6">
            <h3 className="text-lg font-bold text-foreground">
              Delivery and important boundaries
            </h3>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              {content.delivery}
            </p>
            <p className="mt-4 rounded-xl border border-border bg-card p-4 text-sm font-semibold leading-6 text-foreground">
              {content.caveat}
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}

function ServiceFaqs({ content }: { content: ServiceTrustContent }) {
  return (
    <section
      aria-labelledby="service-faq-heading"
      className="border-b border-border bg-background"
    >
      <div className="asancha-page-container py-16 sm:py-20">
        <SectionHeading
          description="Practical answers about scope, delivery and the next step."
          id="service-faq-heading"
          title="Frequently Asked Questions"
        />
        <div className="mx-auto mt-10 grid max-w-4xl gap-3">
          {content.faqs.map((faq) => (
            <details
              className="group rounded-xl border border-border bg-card shadow-sm"
              key={faq.question}
            >
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-bold text-card-foreground">
                {faq.question}
                <span
                  aria-hidden="true"
                  className="text-xl text-primary transition group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="border-t border-border px-5 py-4 text-sm leading-6 text-muted-foreground">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ServicePage({ service }: { service: ServiceContent }) {
  const trustContent = serviceTrustContent[service.slug];
  const contactAction =
    service.heroLinks.find((link) => link.href === "/contact") ??
    service.heroLinks.at(-1);
  const getServiceHref = (href: string) =>
    href === "/contact"
      ? `/contact?service=${service.slug}#contact-form`
      : href;

  return (
    <article className="bg-background text-foreground">
      <section className="relative isolate overflow-hidden bg-foreground text-primary-foreground">
        <Image
          alt=""
          className="-z-20 object-cover"
          fill
          priority
          sizes="100vw"
          src={service.image}
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(2,6,23,.96),rgba(2,6,23,.78)_58%,rgba(2,6,23,.5))]" />
        <div className="asancha-page-container py-20 sm:py-28">
          <div className="max-w-4xl">
            <Link
              className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-primary-foreground/75 hover:text-primary-foreground hover:underline"
              href="/services"
            >
              <span aria-hidden="true">←</span> All services
            </Link>
            <p className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-4 py-2 text-xs font-bold uppercase tracking-wide backdrop-blur-sm">
              <Sparkles aria-hidden="true" size={14} />
              {service.label}
            </p>
            <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
              {service.title}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-primary-foreground/80">
              {service.description}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              {service.heroLinks.map((link, index) => (
                <Link
                  className={
                    index === 0
                      ? "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary-foreground/40"
                      : "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-primary-foreground/35 bg-primary-foreground/10 px-6 py-3 text-sm font-bold text-primary-foreground backdrop-blur-sm transition hover:bg-primary-foreground/20 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary-foreground/40"
                  }
                  href={getServiceHref(link.href)}
                  key={link.label}
                >
                  {link.label}
                  {index === 0 ? (
                    <ArrowRight aria-hidden="true" size={17} />
                  ) : null}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
      {trustContent ? <ScopeSection content={trustContent} /> : null}
      {service.sections.map((section, index) => (
        <ContentSection index={index} key={section.title} section={section} />
      ))}
      {trustContent ? <ServiceFaqs content={trustContent} /> : null}
      <section
        aria-labelledby="service-next-step-heading"
        className="bg-primary"
      >
        <div className="asancha-page-container flex flex-col gap-7 py-16 text-primary-foreground sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-primary-foreground/70">
              Next step
            </p>
            <h2
              className="mt-3 text-3xl font-extrabold sm:text-4xl"
              id="service-next-step-heading"
            >
              Discuss {service.label.toLowerCase()} with Asancha.
            </h2>
            <p className="mt-3 max-w-2xl text-primary-foreground/80">
              Tell us what you need. Scope, availability, delivery
              responsibility and any applicable fees will be confirmed before
              engagement.
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <Link
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-foreground px-6 py-3 text-sm font-bold text-background hover:bg-foreground/80"
              href={getServiceHref(contactAction?.href ?? "/contact")}
            >
              {contactAction?.label ?? "Contact Asancha"}
              <ArrowRight aria-hidden="true" size={17} />
            </Link>
            <Link
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-primary-foreground/35 px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary-foreground/10"
              href="/services"
            >
              Explore Other Services
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
