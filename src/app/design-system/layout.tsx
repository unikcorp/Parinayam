import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Design System",
  path: "/design-system",
  noIndex: true,
});

export default function DesignSystemLayout({ children }: { children: React.ReactNode }) {
  return children;
}
