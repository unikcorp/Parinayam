import { buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/shared/json-ld";
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
    <>
      <JsonLd data={faqJsonLd} />
      {children}
    </>
  );
}
