import { AppHeader } from "@/components/layout/app-header";
import { buildMetadata } from "@/lib/seo";

// No data fetch here — the profile API requires a logged-in session, which
// isn't available in this server-rendered metadata pass (the access token
// only ever lives in an in-memory client variable, see lib/api.ts). Harmless
// since the route is already noIndex: true — this title never reaches search
// results, only the browser tab.
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return buildMetadata({
    title: "Member profile",
    path: `/profile/${id}`,
    noIndex: true,
  });
}

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-surface">
      <AppHeader />
      <main className="flex-1 pb-24 lg:pb-0">{children}</main>
    </div>
  );
}
