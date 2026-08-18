import { buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/shared/json-ld";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { faqs } from "@/data/faqs.data";

export const metadata = buildMetadata({
  title: "Help Center",
  description: "Answers to common questions about photo privacy, verification, billing and safety.",
  path: "/help",
});

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function HelpLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <JsonLd data={faqJsonLd} />
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
