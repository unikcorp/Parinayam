"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { brand } from "@/data/brand";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { BrandMark } from "@/components/shared/brand-mark";
import { useHasCustomLogo } from "@/hooks/use-branding";
import { useAuth } from "@/context/auth-context";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Success Stories", href: "/stories" },
  { label: "Plans", href: "/plans" },
  { label: "About Us", href: "/legal/about-us" },
  { label: "Help", href: "/help" },
];

// Resolves the correct destination + label for an authenticated member so the
// navbar CTA always makes sense regardless of profile state:
//   - Profile < 60 %            → /profile/edit  "Complete Profile"
//   - Profile ≥ 60 %, no plan   → /plans          "Choose a Plan"
//   - Profile ≥ 60 %, has plan  → /dashboard      "Go to Dashboard"
interface NavDest {
  href: string;
  label: string;
}

function useNavDest(): NavDest | null {
  const { isAuthenticated, isRestoring } = useAuth();
  const [dest, setDest] = useState<NavDest | null>(null);

  useEffect(() => {
    // Only fetch once the session is fully restored and the user is logged in.
    if (isRestoring || !isAuthenticated) {
      setDest(null);
      return;
    }

    let cancelled = false;

    api
      .get<{
        profile_completion: number;
        has_selected_plan: boolean;
        can_enter_dashboard: boolean;
        sections: Record<string, boolean>;
      }>("/api/members/me/completion")
      .then((summary) => {
        if (cancelled) return;

        if (summary.can_enter_dashboard) {
          setDest({ href: "/dashboard", label: "Go to Dashboard" });
          return;
        }

        if (summary.profile_completion >= 60 && !summary.has_selected_plan) {
          setDest({ href: "/plans", label: "Choose a Plan" });
          return;
        }

        // Profile still below 60 % — find the first incomplete section and
        // deep-link straight to it so the member doesn't have to hunt for it.
        const SECTION_TO_STEP: Record<string, string> = {
          personal_location: "personal",
          education: "education",
          family: "family",
          horoscope: "horoscope",
          about: "about",
          partner_preference: "preferences",
          photos: "photos",
          identity: "verification",
        };
        const MANDATORY = ["personal_location", "education", "about"];
        const ALL = Object.keys(SECTION_TO_STEP);
        const firstIncomplete =
          MANDATORY.find((k) => !summary.sections[k]) ??
          ALL.find((k) => !summary.sections[k]) ??
          "personal_location";
        setDest({
          href: `/profile/edit?step=${SECTION_TO_STEP[firstIncomplete]}&resume=1`,
          label: "Complete Profile",
        });
      })
      .catch(() => {
        // Completion check failed — fall back to dashboard which has its own gate.
        if (!cancelled) setDest({ href: "/dashboard", label: "My Account" });
      });

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, isRestoring]);

  return dest;
}

export function SiteHeader({ simpleCta }: { simpleCta?: boolean } = {}) {
  const [scrolled, setScrolled] = useState(false);
  const hasCustomLogo = useHasCustomLogo();

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
      <div className="flex items-center gap-2.5">
        {/* Mobile only — hamburger sits to the left of the logo, matching
            the common mobile-nav convention (menu on the left, brand next
            to it, primary action on the right). */}
        <Sheet>
          <SheetTrigger render={<Button variant="secondary" size="icon" className="lg:hidden" />}>
            <Menu className="size-4.5" />
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-6">
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
            {/* Mobile drawer CTA */}
            <NavCta drawer simpleCta={simpleCta} />
          </SheetContent>
        </Sheet>

        <Link href="/" className="flex items-center gap-2.5 lg:gap-3">
          <BrandMark
            className="bg-dark-panel-gradient flex size-8.5 items-center justify-center rounded-[10px] text-base font-extrabold text-gold-light lg:size-10 lg:rounded-xl lg:text-xl"
            imageClassName="h-12 w-auto max-w-44 lg:h-15"
          />
          {!hasCustomLogo && (
            <span className="flex flex-col lg:block">
              <span className="text-lg font-extrabold tracking-tight text-primary lg:text-xl">
                {/* {brand.name} */}
              </span>
              <span className="hidden text-[11px] font-semibold tracking-wide text-faint uppercase lg:block">
                Matrimony
              </span>
            </span>
          )}
        </Link>
      </div>

      <nav className="hidden items-center gap-8 text-[15px] font-semibold text-muted-foreground lg:flex">
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href} className="hover:text-primary">
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Desktop CTA */}
      <div className="hidden items-center gap-3 lg:flex">
        <NavCta simpleCta={simpleCta} />
      </div>

      {/* Mobile top-bar CTA */}
      <div className="lg:hidden">
        <NavCta mobile simpleCta={simpleCta} />
      </div>
    </header>
  );
}

// Renders the right CTA based on auth + profile completion state:
//   Logged out  → Login / Register Free
//   Logged in, profile < 60%         → "Complete Profile"
//   Logged in, profile ≥ 60%, no plan → "Choose a Plan"
//   Logged in, all good               → "Go to Dashboard"
// Hidden while the session is still restoring to avoid a flash.
function NavCta({
  mobile,
  drawer,
  simpleCta,
}: {
  mobile?: boolean;
  drawer?: boolean;
  simpleCta?: boolean;
}) {
  const { isAuthenticated, isRestoring } = useAuth();
  const dest = useNavDest();

  // The marketing/landing header always shows Login/Register — it doesn't
  // route members into their dashboard/profile flow the way the rest of the
  // site's header does.
  if (simpleCta) {
    if (drawer) {
      return (
        <Button className="mt-4 w-full" size="cta" render={<Link href="/register" />}>
          Register Free
        </Button>
      );
    }

    if (mobile) {
      return (
        <Button variant="outline" size="sm" render={<Link href="/login" />}>
          Login
        </Button>
      );
    }

    return (
      <>
        <Button variant="outline" size="lg" render={<Link href="/login" />}>
          Login
        </Button>
        <Button size="lg" render={<Link href="/register" />}>
          Register Free
        </Button>
      </>
    );
  }

  // Hide completely while hydrating / restoring the session cookie so we
  // never flash the wrong buttons before auth state is known.
  if (isRestoring) return null;

  if (isAuthenticated) {
    // While the completion fetch is in-flight, show nothing rather than a
    // stale/wrong label — the button appears as soon as we know where to go.
    if (!dest) return null;

    return (
      <Button
        size={drawer ? "cta" : mobile ? "sm" : "lg"}
        className={drawer ? "mt-4 w-full" : undefined}
        render={<Link href={dest.href} />}
      >
        {dest.label}
      </Button>
    );
  }

  // Logged-out: drawer shows just Register, mobile top-bar shows Login,
  // desktop shows both Login and Register Free.
  if (drawer) {
    return (
      <Button className="mt-4 w-full" size="cta" render={<Link href="/register" />}>
        Register Free
      </Button>
    );
  }

  if (mobile) {
    return (
      <Button variant="outline" size="sm" render={<Link href="/login" />}>
        Login
      </Button>
    );
  }

  return (
    <>
      <Button variant="outline" size="lg" render={<Link href="/login" />}>
        Login
      </Button>
      <Button size="lg" render={<Link href="/register" />}>
        Register Free
      </Button>
    </>
  );
}
