import { buildMetadata } from "@/lib/seo";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export const metadata = buildMetadata({
  title: "Success stories",
  description: "Real couples who met and married through Parinayam, in their own words.",
  path: "/stories",
});

export default function StoriesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
