import { AppHeader } from "@/components/layout/app-header";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "My Profile",
  path: "/profile/me",
  noIndex: true,
});

export default function MyProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-surface">
      <AppHeader />
      <main className="flex-1 pb-24 lg:pb-0">{children}</main>
    </div>
  );
}
