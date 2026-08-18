import { buildMetadata } from "@/lib/seo";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export const metadata = buildMetadata({
  title: "Blog",
  description: "Advice on matchmaking, horoscope matching and wedding planning from the Parinayam team.",
  path: "/blog",
});

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
