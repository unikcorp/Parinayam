"use client";

import { Check, Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";
import type { buttonVariants } from "@/components/ui/button";
import { useIsInterestSent, useSendInterest } from "../use-interests";

interface InterestButtonProps {
  memberId: number;
  size?: VariantProps<typeof buttonVariants>["size"];
  className?: string;
}

export function InterestButton({ memberId, size = "sm", className }: InterestButtonProps) {
  const sendInterest = useSendInterest();
  const isSent = useIsInterestSent(memberId);

  return (
    <Button
      size={size}
      className={className}
      disabled={isSent || sendInterest.isPending}
      onClick={() => sendInterest.mutate(memberId)}
    >
      {sendInterest.isPending ? (
        <Loader2 className="size-3.5 animate-spin" />
      ) : isSent ? (
        <Check className="size-3.5" />
      ) : (
        <Heart className="size-3.5" />
      )}
      {isSent ? "Sent" : "Interest"}
    </Button>
  );
}
