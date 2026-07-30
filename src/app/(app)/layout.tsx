import { AppHeader } from "@/components/app/app-header";
import { AppBottomNav } from "@/components/app/app-bottom-nav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-surface">
      <AppHeader />
      <main className="flex-1 pb-20 lg:pb-0">{children}</main>
      <AppBottomNav />
    </div>
  );
}
