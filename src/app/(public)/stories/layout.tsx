import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Success stories",
  description: "Real couples who met and married through Parinayam, in their own words.",
  path: "/stories",
});

export default function StoriesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
