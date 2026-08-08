import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Login",
  description: "Sign in to Parinayam with your mobile number or email.",
  path: "/login",
});

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
