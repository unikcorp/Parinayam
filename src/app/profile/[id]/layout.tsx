import { AppHeader } from "@/components/app/app-header";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-surface">
      <AppHeader />
      <main className="flex-1 pb-24 lg:pb-0">{children}</main>
    </div>
  );
}
