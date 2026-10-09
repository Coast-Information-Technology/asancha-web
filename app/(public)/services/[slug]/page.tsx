import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { services } from "../_components/service-content";
import { ServicePage } from "../_components/service-page";

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  if (!service) notFound();
  return {
    title: `${service.label} | Asancha`,
    description: service.description,
    alternates: { canonical: `/services/${slug}` },
    openGraph: {
      title: `${service.label} | Asancha`,
      description: service.description,
      images: [service.image],
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  if (!service) notFound();
  return <ServicePage service={service} />;
}
