"use client";

import { useState } from "react";
import { Check, Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";
import type { buttonVariants } from "@/components/ui/button";
import { useSendInterest } from "../use-interests";

interface InterestButtonProps {
  memberId: number;
  size?: VariantProps<typeof buttonVariants>["size"];
  className?: string;
}

export function InterestButton({ memberId, size = "sm", className }: InterestButtonProps) {
  const sendInterest = useSendInterest();
  const [sent, setSent] = useState(false);

  const isSent = sent || sendInterest.isSuccess;

  return (
    <Button
      size={size}
      className={className}
      disabled={isSent || sendInterest.isPending}
      onClick={() => sendInterest.mutate(memberId, { onSuccess: () => setSent(true) })}
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
