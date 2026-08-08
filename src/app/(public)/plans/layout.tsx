import Link from "next/link";
import { SimpleHeader } from "@/components/layout/simple-header";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Membership plans",
  description: "Simple, honest pricing — start free and upgrade when you're ready to connect.",
  path: "/plans",
});

export default function PlansLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-surface">
      <SimpleHeader
        mobileTitle="Membership"
        right={
          <Button variant="outline" size="sm" className="hidden lg:inline-flex" render={<Link href="/dashboard" />}>
            Back to dashboard
          </Button>
        }
      />
      <main className="flex-1">{children}</main>
    </div>
  );
}
