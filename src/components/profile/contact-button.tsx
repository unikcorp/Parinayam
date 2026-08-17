"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Loader2, Lock, Phone } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { VariantProps } from "class-variance-authority";
import type { buttonVariants } from "@/components/ui/button";
import { api, ApiError } from "@/lib/api";
import { useMembership } from "@/features/membership/use-membership";

interface ContactResponse {
  mobileCountryCode: string;
  mobile: string;
}

interface ContactButtonProps {
  memberId: number;
  size?: VariantProps<typeof buttonVariants>["size"];
  variant?: VariantProps<typeof buttonVariants>["variant"];
  /** Icon-only contexts (mobile sticky bar) have no room to show the number as
   * button text — reveal opens the phone dialer directly instead. */
  iconOnly?: boolean;
  className?: string;
}

export function ContactButton({ memberId, size = "cta", variant = "gold", iconOnly, className }: ContactButtonProps) {
  const router = useRouter();
  const { isLoading: membershipLoading, canViewContact } = useMembership();
  const [contact, setContact] = useState<ContactResponse | null>(null);
  const [loading, setLoading] = useState(false);

  // Free (contactViews limit 0) — never even attempt the call, send them
  // straight to upgrade instead of a doomed request the backend would 403.
  const locked = !membershipLoading && !canViewContact;

  async function reveal() {
    if (locked) {
      router.push("/plans");
      return;
    }

    if (contact) {
      if (iconOnly) {
        window.location.href = `tel:${contact.mobileCountryCode}${contact.mobile}`;
      } else {
        await navigator.clipboard.writeText(`${contact.mobileCountryCode}${contact.mobile}`);
        toast.success("Contact number copied.");
      }
      return;
    }

    setLoading(true);
    try {
      const data = await api.get<ContactResponse>(`/api/members/${memberId}/contact`);
      setContact(data);
      if (iconOnly) {
        window.location.href = `tel:${data.mobileCountryCode}${data.mobile}`;
      } else {
        toast.success(`Contact: ${data.mobileCountryCode} ${data.mobile}`);
      }
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Could not load contact details.");
    } finally {
      setLoading(false);
    }
  }

  const button = (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={className}
      disabled={loading}
      aria-label={iconOnly ? "View contact" : undefined}
      onClick={reveal}
    >
      {loading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : locked ? (
        <Lock className={iconOnly ? "size-4.5" : "size-4"} />
      ) : contact && !iconOnly ? (
        <Copy className="size-4" />
      ) : (
        <Phone className={iconOnly ? "size-4.5" : "size-4"} />
      )}
      {!iconOnly && (locked ? "Upgrade to View" : contact ? `${contact.mobileCountryCode} ${contact.mobile}` : "View Contact")}
    </Button>
  );

  if (!iconOnly) return button;

  return (
    <Tooltip>
      <TooltipTrigger render={button} />
      <TooltipContent>{locked ? "Upgrade to view contact" : "View Contact"}</TooltipContent>
    </Tooltip>
  );
}
