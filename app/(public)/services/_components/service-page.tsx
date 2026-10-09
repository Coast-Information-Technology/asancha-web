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

export function ServicePage({ service }: { service: ServiceContent }) {
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
                  href={link.href}
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
      {service.sections.map((section, index) => (
        <ContentSection index={index} key={section.title} section={section} />
      ))}
    </article>
  );
}
