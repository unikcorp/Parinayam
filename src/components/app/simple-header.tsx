import Link from "next/link";
import { brand } from "@/lib/brand.config";

export function SimpleHeader({
  right,
  mobileTitle,
}: {
  right?: React.ReactNode;
  mobileTitle?: string;
}) {
  return (
    <header className="flex items-center justify-between border-b border-card-border bg-card px-5 py-4 lg:px-12 lg:py-3.5">
      <Link href="/dashboard" className="flex items-center gap-2.5">
        <span className="bg-dark-panel-gradient flex size-9 items-center justify-center rounded-[11px] text-lg font-extrabold text-gold-light">
          {brand.logoLetter}
        </span>
        <span className={mobileTitle ? "hidden text-lg font-extrabold text-primary lg:inline" : "text-lg font-extrabold text-primary"}>
          {brand.name}
        </span>
        {mobileTitle && (
          <span className="text-lg font-extrabold text-primary-deep lg:hidden">
            {mobileTitle}
          </span>
        )}
      </Link>
      {right}
    </header>
  );
}
