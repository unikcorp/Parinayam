"use client";

import { useState } from "react";
import { Copy, Loader2, Phone } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { VariantProps } from "class-variance-authority";
import type { buttonVariants } from "@/components/ui/button";
import { api, ApiError } from "@/lib/api";

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
  const [contact, setContact] = useState<ContactResponse | null>(null);
  const [loading, setLoading] = useState(false);

  async function reveal() {
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
      ) : contact && !iconOnly ? (
        <Copy className="size-4" />
      ) : (
        <Phone className={iconOnly ? "size-4.5" : "size-4"} />
      )}
      {!iconOnly && (contact ? `${contact.mobileCountryCode} ${contact.mobile}` : "View Contact")}
    </Button>
  );

  if (!iconOnly) return button;

  return (
    <Tooltip>
      <TooltipTrigger render={button} />
      <TooltipContent>View Contact</TooltipContent>
    </Tooltip>
  );
}
