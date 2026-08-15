"use client";

import { useRouter } from "next/navigation";
import { Loader2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { VariantProps } from "class-variance-authority";
import type { buttonVariants } from "@/components/ui/button";
import { useStartConversation } from "../use-messaging";

interface MessageButtonProps {
  memberId: number;
  size?: VariantProps<typeof buttonVariants>["size"];
  variant?: VariantProps<typeof buttonVariants>["variant"];
  className?: string;
}

export function MessageButton({ memberId, size = "icon-sm", variant = "outline", className }: MessageButtonProps) {
  const router = useRouter();
  const start = useStartConversation();

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            type="button"
            variant={variant}
            size={size}
            aria-label="Message"
            disabled={start.isPending}
            className={className}
            onClick={() =>
              start.mutate(memberId, {
                onSuccess: ({ id }) => router.push(`/messages?c=${id}`),
              })
            }
          >
            {start.isPending ? <Loader2 className="size-4 animate-spin" /> : <MessageCircle className="size-4" />}
          </Button>
        }
      />
      <TooltipContent>Message</TooltipContent>
    </Tooltip>
  );
}
