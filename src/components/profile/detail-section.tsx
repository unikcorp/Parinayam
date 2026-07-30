import { GraduationCap, Home, Leaf, Sparkle, type LucideIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

const iconMap: Record<string, { icon: LucideIcon; tint: string }> = {
  education: { icon: GraduationCap, tint: "bg-surface-blue text-primary" },
  family: { icon: Home, tint: "bg-peach-bg text-peach-text" },
  lifestyle: { icon: Leaf, tint: "bg-success-bg text-success" },
  religion: { icon: Sparkle, tint: "bg-surface-cream-2 text-gold-text" },
};

export interface DetailSectionData {
  key: string;
  icon: string;
  title: string;
  rows: readonly (readonly [string, string])[];
}

function SectionIcon({ iconKey }: { iconKey: string }) {
  const entry = iconMap[iconKey] ?? iconMap.education;
  const Icon = entry.icon;
  return (
    <span className={cn("flex size-9.5 shrink-0 items-center justify-center rounded-[11px]", entry.tint)}>
      <Icon className="size-4" />
    </span>
  );
}

function RowGrid({ rows, dense }: { rows: readonly (readonly [string, string])[]; dense?: boolean }) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2",
        dense ? "gap-x-6 gap-y-2.5" : "gap-x-10 gap-y-4"
      )}
    >
      {rows.map(([k, v]) => (
        <div
          key={k}
          className="flex items-center justify-between gap-4 border-b border-[#F5F6F9] pb-2.5"
        >
          <span className="text-[13.5px] font-semibold text-faint">{k}</span>
          <span className="text-right text-sm font-bold text-primary-deep">{v}</span>
        </div>
      ))}
    </div>
  );
}

export function DetailSectionCard({ section }: { section: DetailSectionData }) {
  return (
    <div className="rounded-[20px] border border-card-border bg-card p-7">
      <div className="mb-5 flex items-center gap-3">
        <SectionIcon iconKey={section.icon} />
        <div className="text-lg font-extrabold text-primary-deep">{section.title}</div>
      </div>
      <RowGrid rows={section.rows} />
    </div>
  );
}

export function DetailAccordion({ sections }: { sections: DetailSectionData[] }) {
  return (
    <Accordion defaultValue={[sections[0]?.key]} className="flex flex-col gap-3">
      {sections.map((s) => (
        <AccordionItem
          key={s.key}
          value={s.key}
          className="overflow-hidden rounded-2xl border border-card-border bg-card"
        >
          <AccordionTrigger className="px-4.5 py-4 hover:no-underline [&_svg]:text-faint">
            <span className="flex flex-1 items-center gap-3">
              <SectionIcon iconKey={s.icon} />
              <span className="text-[15px] font-extrabold text-primary-deep">{s.title}</span>
            </span>
          </AccordionTrigger>
          <AccordionContent className="px-4.5 pb-4">
            <RowGrid rows={s.rows} dense />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
