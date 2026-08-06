import type { Metadata } from "next";
import { brand } from "@/data/brand";

export const siteUrl = "https://parinayam.example.com";

interface BuildMetadataOptions {
  /** Page title. Combines with the root layout's `%s | Parinayam` template. */
  title: string;
  description?: string;
  /** Path from the site root, e.g. "/plans". Defaults to "/". */
  path?: string;
  /** Absolute or root-relative OG/Twitter image. Falls back to the site default. */
  image?: string;
  /** Keep this route out of search results (used for authenticated/private pages). */
  noIndex?: boolean;
}

export function buildMetadata({
  title,
  description,
  path = "/",
  image,
  noIndex,
}: BuildMetadataOptions): Metadata {
  const url = `${siteUrl}${path}`;
  const desc = description ?? brand.tagline;

  return {
    title,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: desc,
      url,
      siteName: brand.name,
      type: "website",
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      images: image ? [image] : undefined,
    },
    ...(noIndex && { robots: { index: false, follow: false } }),
  };
}
