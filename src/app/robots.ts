import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard",
          "/messages",
          "/notifications",
          "/settings",
          "/checkout",
          "/profile",
          "/design-system",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
