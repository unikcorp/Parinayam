"use client";

import { Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { VariantProps } from "class-variance-authority";
import type { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsShortlisted, useToggleShortlist } from "../use-shortlist";

interface ShortlistButtonProps {
  memberId: number;
  size?: VariantProps<typeof buttonVariants>["size"];
  className?: string;
}

export function ShortlistButton({ memberId, size = "icon-sm", className }: ShortlistButtonProps) {
  const isShortlisted = useIsShortlisted(memberId);
  const toggle = useToggleShortlist();
  const label = isShortlisted ? "Remove from shortlist" : "Shortlist";

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            type="button"
            variant="outline"
            size={size}
            aria-label={label}
            disabled={toggle.isPending}
            className={cn(isShortlisted && "border-gold text-gold", className)}
            onClick={() => toggle.mutate({ memberId, isShortlisted })}
          >
            {toggle.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Star className={cn("size-4", isShortlisted && "fill-gold")} />
            )}
          </Button>
        }
      />
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
