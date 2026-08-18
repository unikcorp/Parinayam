"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { brand } from "@/data/brand";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Success Stories", href: "/stories" },
  { label: "Plans", href: "/plans" },
  { label: "Blog", href: "/blog" },
  { label: "Help", href: "/help" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "supports-backdrop-filter:bg-card/80 sticky top-0 z-30 flex items-center justify-between border-b bg-card px-5 py-4 backdrop-blur-md transition-shadow duration-300 lg:px-18 lg:py-5",
        scrolled ? "border-card-border shadow-[0_8px_24px_rgba(127,29,29,0.06)]" : "border-transparent"
      )}
    >
      <Link href="/" className="flex items-center gap-2.5 lg:gap-3">
        <span className="bg-dark-panel-gradient flex size-8.5 items-center justify-center rounded-[10px] text-base font-extrabold text-gold-light lg:size-10 lg:rounded-xl lg:text-xl">
          {brand.logoLetter}
        </span>
        <span className="flex flex-col lg:block">
          <span className="text-lg font-extrabold tracking-tight text-primary lg:text-xl">
            {brand.name}
          </span>
          <span className="hidden text-[11px] font-semibold tracking-wide text-faint uppercase lg:block">
            Matrimony
          </span>
        </span>
      </Link>

      <nav className="hidden items-center gap-8 text-[15px] font-semibold text-muted-foreground lg:flex">
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href} className="hover:text-primary">
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="hidden items-center gap-3 lg:flex">
        <Button variant="outline" size="lg" render={<Link href="/login" />}>
          Login
        </Button>
        <Button size="lg" render={<Link href="/register" />}>
          Register Free
        </Button>
      </div>

      <div className="flex items-center gap-2.5 lg:hidden">
        <Button variant="outline" size="sm" render={<Link href="/login" />}>
          Login
        </Button>
        <Sheet>
          <SheetTrigger render={<Button variant="secondary" size="icon" />}>
            <Menu className="size-4.5" />
          </SheetTrigger>
          <SheetContent side="right" className="w-72 p-6">
            <nav className="mt-8 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-3 py-3 text-[15px] font-semibold text-ink hover:bg-muted"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <Button className="mt-4 w-full" size="cta" render={<Link href="/register" />}>
              Register Free
            </Button>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
