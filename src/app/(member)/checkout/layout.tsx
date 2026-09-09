import Script from "next/script";
import { SimpleHeader } from "@/components/layout/simple-header";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Checkout",
  path: "/checkout",
  noIndex: true,
});

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-surface">
      {/* Scoped to this one route — the only place Razorpay Checkout ever
          opens. beforeInteractive is a root-layout-only strategy in the App
          Router (Next.js docs) and silently doesn't attach in time when used
          in a nested layout like this one — afterInteractive is the correct
          strategy here; handlePay() also tolerates it still loading. */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
      <SimpleHeader
        right={
          <div className="hidden items-center gap-2 text-[13.5px] font-semibold text-faint lg:flex">
            🔒 Secure checkout · 256-bit encrypted
          </div>
        }
      />
      <main className="flex-1">{children}</main>
    </div>
  );
}
