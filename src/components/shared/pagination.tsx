"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

function pageList(page: number, total: number): (number | "ellipsis")[] {
  const pages = new Set([1, total, page, page - 1, page + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const result: (number | "ellipsis")[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - (sorted[i - 1] as number) > 1) result.push("ellipsis");
    result.push(p);
  });
  return result;
}

function PageButton({
  active,
  disabled,
  onClick,
  children,
}: {
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex size-9.5 items-center justify-center rounded-[10px] text-[13.5px] font-bold transition-colors",
        active
          ? "bg-primary text-white"
          : "border border-input text-muted-foreground hover:border-primary hover:text-primary",
        disabled && "cursor-not-allowed opacity-40"
      )}
    >
      {children}
    </button>
  );
}

export function Pagination({ page, totalPages, onPageChange, className }: PaginationProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <PageButton disabled={page === 1} onClick={() => onPageChange(page - 1)}>
        <ChevronLeft className="size-4" />
      </PageButton>
      {pageList(page, totalPages).map((p, i) =>
        p === "ellipsis" ? (
          <span key={`e${i}`} className="px-1 text-faint">
            …
          </span>
        ) : (
          <PageButton key={p} active={p === page} onClick={() => onPageChange(p)}>
            {p}
          </PageButton>
        )
      )}
      <PageButton disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>
        <ChevronRight className="size-4" />
      </PageButton>
    </div>
  );
}
