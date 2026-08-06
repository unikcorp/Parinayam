import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Edit your profile",
  path: "/profile/edit",
  noIndex: true,
});

export default function ProfileEditLayout({ children }: { children: React.ReactNode }) {
  return children;
}
