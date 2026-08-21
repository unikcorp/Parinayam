"use client";

import { brand } from "@/data/brand";
import { brandingImageUrl, useBranding } from "@/hooks/use-branding";
import { cn } from "@/lib/utils";

interface BrandMarkProps {
  /** Sizing/shape/background for the letter-fallback badge (size-9, rounded-xl, bg-dark-panel-gradient, text-gold-light, ...). */
  className: string;
  /**
   * Sizing for the real uploaded logo image — a fixed height with auto
   * width so the logo keeps its natural proportions instead of being
   * cropped into a small square badge. Defaults to a size clearly bigger
   * than the letter badge, since a real logo needs to actually be legible.
   */
  imageClassName?: string;
}

export function BrandMark({ className, imageClassName = "h-11 w-auto max-w-40 lg:h-13" }: BrandMarkProps) {
  const { data } = useBranding();
  const logoUrl = brandingImageUrl(data?.logo ?? null);

  if (logoUrl) {
    return <img src={logoUrl} alt={brand.name} className={cn(imageClassName, "object-contain")} />;
  }

  return <span className={className}>{brand.logoLetter}</span>;
}
