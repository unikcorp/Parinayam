import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { brand } from "@/data/brand";
import { siteUrl } from "@/lib/seo";
import { Providers } from "@/context/providers";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const defaultTitle = `${brand.name} — Find your life partner`;

// Falls back to the static favicon.ico/icon.svg files in this directory
// (Next.js's file-convention icons) whenever the admin hasn't uploaded one.
async function getFaviconUrl(): Promise<string | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";
    const res = await fetch(`${apiUrl}/api/site-settings/branding`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const { data } = await res.json();
    return data?.favicon ? `${apiUrl}/uploads/${data.favicon}` : null;
  } catch {
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const faviconUrl = await getFaviconUrl();

  return {
    metadataBase: new URL(siteUrl),
    title: { default: defaultTitle, template: `%s | ${brand.name}` },
    description: brand.tagline,
    openGraph: {
      title: defaultTitle,
      description: brand.tagline,
      url: siteUrl,
      siteName: brand.name,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: defaultTitle,
      description: brand.tagline,
    },
    robots: { index: true, follow: true },
    ...(faviconUrl ? { icons: { icon: faviconUrl } } : {}),
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#b91c1c",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-surface text-ink font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
