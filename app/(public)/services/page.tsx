import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { services } from "./_components/service-content";

export const metadata: Metadata = {
  title: "Property Services | Asancha",
  description:
    "Explore Asancha property sourcing, investments, management, refurbishment and interior design services.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <main className="overflow-x-clip bg-background">
      <section className="border-b border-border bg-muted">
        <div className="asancha-page-container py-20 sm:py-28">
          <p className="text-sm font-bold uppercase tracking-wide text-primary">
            Asancha services
          </p>
          <h1 className="mt-3 max-w-4xl text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl">
            Expert Support for Every Property Goal
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
            From finding your next opportunity to managing and transforming your
            property, explore how our team can help.
          </p>
        </div>
      </section>

      <section aria-labelledby="services-grid-heading">
        <div className="asancha-page-container py-16 sm:py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-wide text-primary">
              Property expertise
            </p>
            <h2
              className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
              id="services-grid-heading"
            >
              Choose the support that fits your next step.
            </h2>
          </div>

          <ul className="mt-10 grid list-none gap-5 p-0 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <li key={service.slug}>
                <Link
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-2"
                  href={`/services/${service.slug}`}
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    <Image
                      alt=""
                      className="object-cover transition duration-500 group-hover:scale-105"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      src={service.image}
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-xl font-bold text-card-foreground">
                      {service.label}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">
                      {service.description}
                    </p>
                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-primary">
                      Explore service <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
