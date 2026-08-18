import Link from "next/link";
import { PlansCarousel, type CarouselPlan } from "@/components/marketing/plans-carousel";

export interface PricingSectionProps {
  plans: CarouselPlan[];
}

export function PricingSection({ plans }: PricingSectionProps) {
  return (
    <section id="plans" className="bg-card py-9 lg:py-24">
      <div className="mb-8 px-5 lg:mb-14 lg:flex lg:items-end lg:justify-between lg:gap-10 lg:px-18">
        <div>
          <div className="mb-2 text-xs font-bold tracking-[0.12em] text-gold uppercase lg:mb-3 lg:text-[13px]">
            Membership
          </div>
          <h2 className="text-[26px] font-extrabold tracking-[-0.02em] text-primary-deep lg:text-4xl">
            Simple, honest pricing
          </h2>
        </div>
        <p className="mt-2 text-sm text-muted-foreground lg:mt-0 lg:text-right lg:text-[17px]">
          Start free. Upgrade when you&apos;re ready to connect.
        </p>
      </div>
      {plans.length === 0 ? (
        <p className="px-5 text-center text-sm text-faint">Plans coming soon.</p>
      ) : (
        <PlansCarousel plans={plans} />
      )}
      <div className="mt-8 px-5 text-center lg:mt-12">
        <Link href="/plans" className="text-sm font-bold text-primary">
          See all plans →
        </Link>
      </div>
    </section>
  );
}
