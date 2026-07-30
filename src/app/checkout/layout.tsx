import { SimpleHeader } from "@/components/app/simple-header";

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-surface">
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
