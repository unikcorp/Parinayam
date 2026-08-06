import { cn } from "@/lib/utils";
import { ProgressBar } from "@/components/shared/progress-bar";

export interface MembershipCardProps {
  planName: string;
  validTill: string;
  memberName: string;
  memberId: string;
  contactViewsUsed: number;
  contactViewsTotal: number;
  className?: string;
}

export function MembershipCard({
  planName,
  validTill,
  memberName,
  memberId,
  contactViewsUsed,
  contactViewsTotal,
  className,
}: MembershipCardProps) {
  const percent = Math.round((contactViewsUsed / contactViewsTotal) * 100);
  return (
    <div
      className={cn(
        "bg-dark-panel-gradient rounded-3xl p-6 text-white shadow-[0_16px_40px_rgba(127,29,29,0.3)]",
        className
      )}
    >
      <div className="mb-5 flex items-center justify-between">
        <span className="text-xs font-extrabold tracking-[0.1em] text-gold-light uppercase">
          ★ {planName}
        </span>
        <span className="text-xs text-white/60">valid till {validTill}</span>
      </div>
      <div className="text-lg font-extrabold">{memberName}</div>
      <div className="mt-1 mb-4.5 text-[12.5px] text-white/60">{memberId}</div>
      <ProgressBar percent={percent} variant="gold" trackClassName="bg-white/15" />
      <div className="mt-2 text-[11.5px] text-white/60">
        {contactViewsUsed} of {contactViewsTotal} contact views used
      </div>
    </div>
  );
}
