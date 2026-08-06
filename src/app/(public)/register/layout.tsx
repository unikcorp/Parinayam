import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Register free",
  description: "Create your verified Parinayam account in minutes — free to get started.",
  path: "/register",
});

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
