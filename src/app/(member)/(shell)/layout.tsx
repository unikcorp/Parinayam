import { AppHeader } from "@/components/layout/app-header";
import { AppBottomNav } from "@/components/layout/app-bottom-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "My Parinayam",
  path: "/dashboard",
  noIndex: true,
});

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-surface">
      <AppHeader />
      <div className="flex-1 pb-20 lg:pb-0">
        <main>{children}</main>
        <SiteFooter />
      </div>
      <AppBottomNav />
    </div>
  );
}
