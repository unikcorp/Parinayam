import { buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/shared/json-ld";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export const metadata = buildMetadata({
  title: "Help Center",
  description: "Answers to common questions about photo privacy, verification, billing and safety.",
  path: "/help",
});

interface FaqRecord {
  question: string;
  answer: string;
}

async function getPublishedFaqs(): Promise<FaqRecord[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001";
    const res = await fetch(`${apiUrl}/api/faqs/published`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const { data } = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export default async function HelpLayout({ children }: { children: React.ReactNode }) {
  const faqs = await getPublishedFaqs();

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <div className="flex min-h-full flex-1 flex-col">
      {faqs.length > 0 && <JsonLd data={faqJsonLd} />}
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
