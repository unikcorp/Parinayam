import { AppHeader } from "@/components/layout/app-header";
import { fetchProfile } from "@/data/profile.data";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profile = await fetchProfile(id);
  return buildMetadata({
    title: `${profile.name} — ${profile.occupation}, ${profile.place}`,
    description: profile.aiSummary,
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
