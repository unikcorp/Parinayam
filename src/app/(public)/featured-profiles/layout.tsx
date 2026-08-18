import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Featured profiles",
  description: "A preview of premium members on Parinayam. Log in or register to see full profiles and connect.",
  path: "/featured-profiles",
});

export default function FeaturedProfilesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
