import Image from "next/image";
import Link from "next/link";
import localFont from "next/font/local";
import { FaCheck, FaFileAlt } from "react-icons/fa";
import type { ServiceContent } from "./service-page";

const openSans = localFont({
  src: [
    {
      path: "../../../../public/images/services/fonts/open-sans-400.ttf",
      weight: "400",
    },
    {
      path: "../../../../public/images/services/fonts/open-sans-600.ttf",
      weight: "600",
    },
    {
      path: "../../../../public/images/services/fonts/open-sans-700.ttf",
      weight: "700",
    },
  ],
  display: "swap",
});

const container =
  "mx-auto w-full px-[15px] min-[576px]:max-w-[540px] min-[768px]:max-w-[720px] min-[992px]:max-w-[960px] min-[1200px]:max-w-[1140px]";
const consultation =
  "inline-flex items-center justify-center rounded-[3px] border-2 border-[#036ca6] bg-[#036ca6] p-2 text-[12.8px] font-semibold text-white! transition-colors hover:border-[#048cd5] hover:bg-[#048cd5] focus-visible:outline-2 focus-visible:outline-offset-4";
const investor =
  "mt-12 inline-flex items-center justify-center rounded-full bg-[#036ca6] px-6 py-2 text-[19.2px] font-semibold text-white! transition-colors hover:bg-[#048cd5] focus-visible:outline-2 focus-visible:outline-offset-4";
const contactHref = "/contact?service=property-investment#contact-form";
type Section = ServiceContent["sections"][number];

function Heading({
  title,
  light = false,
  left = false,
  small = false,
}: {
  title: string;
  light?: boolean;
  left?: boolean;
  small?: boolean;
}) {
  return (
    <div
      className={`flex flex-col ${left ? "items-start" : "items-center text-center"}`}
    >
      <h2
        className={`mb-2 font-semibold leading-[1.2] ${small ? "text-2xl" : "text-[28px] min-[768px]:text-[32px]"} ${light ? "text-[#fafafa]" : "text-[#323232]"}`}
      >
        {title}
      </h2>
      <span
        aria-hidden="true"
        className={`my-4 h-[3px] w-1/5 ${light ? "bg-white" : "bg-[#333333]"}`}
      />
    </div>
  );
}
function RegisterLink() {
  return (
    <Link href={contactHref} className={investor}>
      Register as an investor
    </Link>
  );
}
function Benefits({ section }: { section: Section }) {
  return (
    <section className="bg-[#fafafa] py-[100px]">
      <div className={`${container} grid gap-y-10 min-[992px]:grid-cols-2`}>
        <div className="min-[992px]:pr-[15px]">
          <div className="pb-8 [&_h2]:font-bold">
            <Heading title={section.title} left />
          </div>
          <ul className="list-none p-0">
            {section.cards.map((item) => (
              <li key={item.title} className="flex items-start gap-4">
                {item.image && (
                  <Image
                    src={item.image.src}
                    alt=""
                    width={50}
                    height={50}
                    className="h-auto w-[50px] shrink-0"
                  />
                )}
                <div>
                  <h3 className="mb-2 text-xl font-bold leading-[1.2]">
                    {item.title}
                  </h3>
                  {item.paragraphs.map((text) => (
                    <p
                      key={text}
                      className="mb-4 text-sm font-semibold leading-[2] text-[#7d7d7d]"
                    >
                      {text}
                    </p>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
        {section.image && (
          <Image
            src={section.image.src}
            alt={section.image.alt}
            width={900}
            height={950}
            sizes="(max-width: 991px) 100vw, 540px"
            className="h-auto w-full rounded min-[992px]:ml-[15px] min-[992px]:w-[calc(100%-15px)]"
          />
        )}
      </div>
    </section>
  );
}
function Education({ section }: { section: Section }) {
  const education = section.cards.at(-1);
  return (
    <section className="bg-[#04283a] py-[100px] text-white">
      <div className={container}>
        <Heading title={section.title} light />
        <div className="mt-[50px] grid gap-10 min-[992px]:grid-cols-2">
          <ul className="list-none p-0">
            {section.cards.slice(0, -1).map((item, i) => (
              <li
                key={item.title}
                className={`flex items-center gap-4 ${i < 2 ? "mb-[50px]" : ""}`}
              >
                {item.image && (
                  <Image
                    src={item.image.src}
                    alt=""
                    width={75}
                    height={75}
                    className="size-[75px] shrink-0 object-contain"
                  />
                )}
                <h3 className="text-[28px] font-semibold leading-[1.2] min-[992px]:text-[32px]">
                  {item.title}
                </h3>
              </li>
            ))}
          </ul>
          {education && (
            <div>
              <h3 className="mb-[50px] text-[28px] font-semibold leading-[1.2]">
                {education.title}
              </h3>
              <ul className="list-disc space-y-2 pl-4 text-base">
                {education.paragraphs.map((text) => (
                  <li key={text}>{text}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <RegisterLink />
      </div>
    </section>
  );
}
function Graphic({ section }: { section: Section }) {
  return (
    <section className="pt-[50px]">
      <div className="flex flex-col items-center px-4 text-center">
        <Heading title={section.title} />
        <RegisterLink />
      </div>
      {section.image && (
        <Image
          src={section.image.src}
          alt={section.image.alt}
          width={1440}
          height={695}
          sizes="100vw"
          className="h-auto w-full"
        />
      )}
    </section>
  );
}
function Teams({ section }: { section: Section }) {
  return (
    <section className="bg-[#04283a] py-[100px] text-center text-white">
      <div className={container}>
        <Heading title={section.title} light small />
        {section.intro.map((text) => (
          <p
            key={text}
            className="mx-auto mb-4 max-w-[80%] pb-4 text-base leading-[2] min-[992px]:text-[19.2px]"
          >
            {text}
          </p>
        ))}
        <ul className="mx-auto grid max-w-[394px] list-none gap-4 p-0 min-[769px]:grid-cols-2">
          {section.cards.map((item) => (
            <li
              key={item.title}
              className="flex items-center gap-8 rounded-lg bg-[#509af8] p-3 text-left text-sm font-medium shadow-[0_0_5px_-3px_#111]"
            >
              {item.title}
              <FaCheck aria-hidden="true" className="ml-auto size-5 shrink-0" />
            </li>
          ))}
        </ul>
        <RegisterLink />
      </div>
    </section>
  );
}
function Timeline({ section }: { section: Section }) {
  return (
    <section className="bg-[#fafafa] px-5 pt-[70px] pb-10">
      <div className="pb-8 [&_h2]:font-bold">
        <Heading title={section.title} />
      </div>
      <ol className="list-none p-0">
        {section.cards.map((item, i) => {
          const left = i % 2 === 0;
          return (
            <li
              key={item.title}
              className="relative min-[960px]:grid min-[960px]:grid-cols-2"
            >
              <div className="absolute inset-y-0 left-[30px] w-[3px] bg-[#04283a] min-[960px]:left-1/2 min-[960px]:-translate-x-1/2" />
              <span className="absolute left-[30px] top-5 z-10 flex size-[66px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[3px] border-[#04283a] bg-white min-[960px]:left-1/2">
                <FaFileAlt
                  aria-hidden="true"
                  className={`text-[30px] ${left ? "text-[#009e64]" : "text-[#036ca6]"}`}
                />
              </span>
              <div
                className={`pb-[50px] pl-[80px] min-[960px]:pl-0 ${left ? "min-[960px]:col-start-1 min-[960px]:pr-[50px]" : "min-[960px]:col-start-2 min-[960px]:pl-[50px]"}`}
              >
                <div
                  className={`rounded-[.81rem] border border-[#ddd] p-5 ${left ? "border-r-[1.11rem] border-r-[#009e64]" : "border-l-[1.11rem] border-l-[#036ca6]"}`}
                >
                  <h3 className="mb-2 text-base font-bold leading-[1.2] text-[#04283a]">
                    {item.title}
                  </h3>
                  {item.paragraphs.map((text) => (
                    <p
                      key={text}
                      className="mb-4 text-sm font-semibold leading-[2] text-[#7d7d7d]"
                    >
                      {text}
                    </p>
                  ))}
                </div>
              </div>
              <div
                className={`hidden px-[50px] py-[10px] min-[960px]:row-start-1 min-[960px]:block ${left ? "min-[960px]:col-start-2" : "text-right min-[960px]:col-start-1"}`}
              >
                <span
                  className={`inline-block rounded-[5px] px-[15px] py-[10px] font-semibold text-white ${left ? "bg-[#009e64]" : "bg-[#036ca6]"}`}
                >
                  Stage {i + 1}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
function Audience({ section }: { section: Section }) {
  return (
    <section className="bg-white pt-12 pb-[50px] min-[992px]:min-h-[650px]">
      <div className={`${container} text-center`}>
        <div className="pb-8 [&_h2]:text-[28.8px] [&_h2]:font-black">
          <Heading title={section.title} />
        </div>
        <ul className="flex list-none flex-wrap items-center justify-center gap-12 px-0 py-8">
          {section.cards.map((item) => (
            <li
              key={item.title}
              className="w-full min-[768px]:w-[calc(50%-24px)] min-[992px]:w-0 min-[992px]:flex-1"
            >
              {item.image && (
                <Image
                  src={item.image.src}
                  alt={item.image.alt}
                  width={200}
                  height={140}
                  sizes="200px"
                  className="mx-auto h-auto w-[200px] rounded-[10px]"
                />
              )}
              <h3 className="mt-[50px] mb-2 text-base font-bold leading-[1.2]">
                {item.title}
              </h3>
              {item.paragraphs.map((text) => (
                <p
                  key={text}
                  className="mb-4 text-sm font-semibold leading-[2] text-[#aaaaaa]"
                >
                  {text}
                </p>
              ))}
            </li>
          ))}
        </ul>
        <Link href={contactHref} className={consultation}>
          Start Investing Today{" "}
          <span aria-hidden="true" className="ml-1">
            →
          </span>
        </Link>
      </div>
    </section>
  );
}
export function InvestmentPage({ service }: { service: ServiceContent }) {
  return (
    <article className={`${openSans.className} bg-white text-[#323232]`}>
      <section
        className="relative isolate flex h-screen flex-col items-center justify-center bg-cover bg-center pt-[130px] text-center"
        style={{ backgroundImage: `url('${service.image}')` }}
      >
        <div className="absolute inset-0 -z-10 bg-black/70" />
        <h1 className="mb-2 max-w-[80%] pb-2 text-[32px] font-bold leading-[1.2] text-white [text-shadow:2px_2px_10px_rgba(0,0,0,.7)] min-[992px]:text-[40px]">
          {service.title}
        </h1>
        <span aria-hidden="true" className="my-4 h-[3px] w-1/5 bg-white" />
        <p className="mb-4 max-w-[80%] pb-4 text-base leading-[2] text-white min-[992px]:text-[19.2px]">
          {service.description}
        </p>
        <div className="flex flex-col gap-4 min-[769px]:flex-row min-[769px]:gap-20">
          {service.heroLinks.map((link, i) => (
            <Link
              key={link.label}
              href={link.href === "/contact" ? contactHref : link.href}
              className={`${consultation} ${i ? "bg-transparent hover:bg-transparent" : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </section>
      {service.sections.map((section) => {
        switch (section.layout) {
          case "benefits":
            return <Benefits key={section.title} section={section} />;
          case "education":
            return <Education key={section.title} section={section} />;
          case "graphic":
            return <Graphic key={section.title} section={section} />;
          case "teams":
            return <Teams key={section.title} section={section} />;
          case "timeline":
            return <Timeline key={section.title} section={section} />;
          default:
            return <Audience key={section.title} section={section} />;
        }
      })}
    </article>
  );
}
