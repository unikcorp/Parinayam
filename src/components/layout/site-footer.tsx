import Link from "next/link";
import { brand } from "@/data/brand";

// Mirrors the header nav (site-header.tsx) so the same destinations are
// reachable from the top and bottom of every page.
const columns = [
  {
    title: "Discover",
    links: [
      { label: "Home", href: "/" },
      { label: "About Us", href: "/legal/about-us" },
      { label: "Success Stories", href: "/stories" },
      { label: "Plans", href: "/plans" },
      { label: "Blog", href: "/blog" },
      { label: "Help", href: "/help" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "/help" },
      { label: "Safety Tips", href: "/help" },
      { label: "Contact Us", href: "/contact" },
      { label: "Report a Profile", href: "/help" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/legal/privacy-policy" },
      { label: "Terms of Service", href: "/legal/terms-conditions" },
      { label: "Refund Policy", href: "/legal/refund-policy" },
      { label: "Grievances", href: "/legal/report-misuse" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="bg-primary-darkest px-5 pt-12 pb-8 text-white/70 lg:px-18 lg:pt-16">
      <div className="grid grid-cols-1 gap-10 border-b border-white/10 pb-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-12 lg:pb-12">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-[10px] bg-primary text-lg font-extrabold text-gold-light">
              {brand.logoLetter}
            </span>
            <span className="text-lg font-extrabold text-white">{brand.name}</span>
          </div>
          <p className="mb-5 max-w-[300px] text-sm leading-relaxed">
            Premium matrimony for the {brand.community} community — verified,
            private, and family-first.
          </p>
          <div className="flex gap-2.5">
            {["f", "in", "▶"].map((s) => (
              <span
                key={s}
                className="flex size-9 items-center justify-center rounded-[10px] bg-white/8 text-sm text-white"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <div className="mb-4 text-xs font-bold tracking-wide text-white uppercase">
              {col.title}
            </div>
            <div className="flex flex-col gap-3 text-sm">
              {col.links.map((l) => (
                <Link key={l.label} href={l.href} className="hover:text-white">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2 pt-6 text-xs text-white/50 lg:flex-row lg:items-center lg:justify-between">
        <span>© 2026 {brand.name} Matrimony. All rights reserved.</span>
        <span>
          Made with care in Kerala 🌴 · Developed by{" "}
          <span className="font-semibold text-white/70">Unik Corp</span>
        </span>
      </div>
    </footer>
  );
}
