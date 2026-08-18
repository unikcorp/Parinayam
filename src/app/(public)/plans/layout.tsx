import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Membership plans",
  description: "Simple, honest pricing — start free and upgrade when you're ready to connect.",
  path: "/plans",
});

export default function PlansLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-surface">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
