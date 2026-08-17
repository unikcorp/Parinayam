"use client";

import { useRouter } from "next/navigation";
import { Check, Heart, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";
import type { buttonVariants } from "@/components/ui/button";
import { useIsInterestSent, useSendInterest } from "../use-interests";
import { useMembership } from "@/features/membership/use-membership";

interface InterestButtonProps {
  memberId: number;
  size?: VariantProps<typeof buttonVariants>["size"];
  className?: string;
}

export function InterestButton({ memberId, size = "sm", className }: InterestButtonProps) {
  const router = useRouter();
  const sendInterest = useSendInterest();
  const isSent = useIsInterestSent(memberId);
  const { isLoading: membershipLoading, canSendInterest } = useMembership();

  // Interest limit reached — check before ever calling the API (which would
  // 403 anyway) and send them to upgrade instead.
  const locked = !membershipLoading && !canSendInterest && !isSent;

  return (
    <Button
      size={size}
      className={className}
      disabled={(isSent || sendInterest.isPending) && !locked}
      onClick={() => (locked ? router.push("/plans") : sendInterest.mutate(memberId))}
    >
      {sendInterest.isPending ? (
        <Loader2 className="size-3.5 animate-spin" />
      ) : locked ? (
        <Lock className="size-3.5" />
      ) : isSent ? (
        <Check className="size-3.5" />
      ) : (
        <Heart className="size-3.5" />
      )}
      {locked ? "Upgrade" : isSent ? "Sent" : "Interest"}
    </Button>
  );
}
