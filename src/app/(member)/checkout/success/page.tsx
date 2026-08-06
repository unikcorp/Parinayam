import Link from "next/link";
import { Check, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const unlocked = [
  "Unlimited interests & private chat",
  "100 contact number views",
  "See who visited your profile",
  "Horoscope match reports",
];

export default function OrderSuccessPage() {
  return (
    <div className="flex flex-col">
      <div className="bg-[linear-gradient(170deg,#0E9F6E_0%,#0B7A55_100%)] relative overflow-hidden px-6 py-16 text-center text-white lg:py-20">
        <div className="absolute -top-18 -right-18 size-55 rounded-full bg-white/8" />
        <div className="absolute -bottom-12 -left-12 size-45 rounded-full bg-white/6" />
        <div className="animate-pop relative mx-auto mb-5 flex size-21 items-center justify-center rounded-full bg-white/18">
          <span className="flex size-15 items-center justify-center rounded-full bg-white text-success">
            <Check className="size-7" strokeWidth={3} />
          </span>
        </div>
        <div className="relative text-2xl font-extrabold tracking-[-0.01em]">
          Payment successful!
        </div>
        <div className="relative mt-2 text-sm text-white/85">
          Welcome to Premium, Anjali ✨
        </div>
      </div>

      <main className="relative -mt-13 mx-auto w-full max-w-125 flex-1 px-5 pb-10 lg:pb-16">
        <div className="rounded-[20px] border border-[#F0F1F5] bg-card p-5.5 shadow-[0_16px_44px_rgba(127,29,29,0.12)] lg:p-7">
          <div className="mb-5 flex items-center gap-3.5 rounded-2xl bg-primary-deep p-4 text-white">
            <span className="bg-gold-gradient flex size-10 shrink-0 items-center justify-center rounded-[11px] text-lg">
              ★
            </span>
            <div className="flex-1">
              <div className="text-[14.5px] font-extrabold">Premium — 6 months</div>
              <div className="mt-0.5 text-[11.5px] text-white/70">Active till 6 Jan 2027</div>
            </div>
            <span className="rounded-full bg-white/15 px-2.75 py-1 text-[10.5px] font-extrabold text-[#7BD3B0]">
              ACTIVE
            </span>
          </div>

          <div className="flex flex-col gap-2.75 text-[13.5px]">
            <Row label="Order ID" value="PNM-ORD-88214" />
            <Row label="Paid via" value="UPI · GPay" />
            <Row label="Date" value="6 Jul 2026, 11:42 AM" />
            <Row label="Plan amount" value="₹5,900" />
            <Row label="Coupon FIRSTMATCH" value="− ₹1,180" tone="success" />
            <Row label="GST (18%)" value="₹850" />
            <div className="flex items-baseline justify-between border-t border-dashed border-input pt-3.5">
              <span className="text-[14.5px] font-extrabold text-primary-deep">Total paid</span>
              <span className="text-[23px] font-extrabold text-success">₹5,570</span>
            </div>
          </div>

          <Button variant="outline" className="mt-5 w-full">
            <Download className="size-4" /> Download GST invoice
          </Button>
        </div>

        <div className="mt-4 rounded-2xl border border-card-border bg-card p-5">
          <div className="mb-3 text-[14.5px] font-extrabold text-primary-deep">
            Now unlocked for you
          </div>
          <div className="flex flex-col gap-2.5 text-[13.5px] text-[#4A5568]">
            {unlocked.map((u) => (
              <div key={u} className="flex items-center gap-2.5">
                <Check className="size-4 shrink-0 text-success" />
                {u}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <Button size="cta" className="w-full" render={<Link href="/dashboard" />}>
            Start exploring matches →
          </Button>
        </div>
      </main>
    </div>
  );
}

function Row({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "success";
}) {
  return (
    <div className="flex justify-between">
      <span className="text-faint">{label}</span>
      <span className={tone === "success" ? "font-bold text-success" : "font-bold text-primary-deep"}>
        {value}
      </span>
    </div>
  );
}
