"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, LogOut, Settings, Star, UserRound } from "lucide-react";
import { brand } from "@/data/brand";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import { useMyProfile } from "@/hooks/use-my-profile";
import { MemberProfilePhoto } from "@/components/shared/member-profile-photo";
import { BrandMark } from "@/components/shared/brand-mark";
import { useHasCustomLogo } from "@/hooks/use-branding";
import { NotificationBell } from "@/features/notifications/components/NotificationBell";
import { useMembership } from "@/features/membership/use-membership";

const navLinks = [
  { label: "Home", href: "/dashboard" },
  { label: "Interests", href: "/interests" },
  { label: "Search", href: "/search" },
  { label: "Messages", href: "/messages" },
];

export function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { data: profile } = useMyProfile();
  const { isPremium } = useMembership();
  const hasCustomLogo = useHasCustomLogo();
  const profilePhoto = profile?.photos.find((p) => p.is_profile_photo);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [menuOpen]);

  function handleLogout() {
    logout();
    setMenuOpen(false);
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-30 hidden items-center justify-between border-b border-card-border bg-card px-12 py-3.5 lg:flex">
      <div className="flex items-center gap-10">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <BrandMark className="bg-dark-panel-gradient flex size-9 items-center justify-center rounded-[11px] text-lg font-extrabold text-gold-light" />
          {!hasCustomLogo && <span className="text-lg font-extrabold text-primary">{brand.name}</span>}
        </Link>
        <nav className="flex gap-2 text-[14.5px] font-semibold">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={cn(
                "rounded-[10px] px-4.5 py-2.5",
                pathname === link.href
                  ? "bg-surface-blue font-bold text-primary"
                  : "text-muted-foreground hover:text-primary"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-3.5">
        {isPremium && (
          <span className="bg-gold-gradient inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-extrabold text-white">
            <Star className="size-3 fill-current" /> Premium
          </span>
        )}
        <NotificationBell />
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2.5 rounded-full border border-input bg-card py-1.5 pr-2.5 pl-1.5"
          >
            <MemberProfilePhoto
              photoUrl={profilePhoto?.photo_url ?? null}
              approvalStatus={profilePhoto?.approval_status ?? null}
              gender={profile?.member.gender ?? "Male"}
              name={user?.name}
              className="size-8.5 shrink-0 rounded-lg"
              showMessage={false}
            />
            <span className="text-sm font-bold text-primary-deep">
              {user?.name.split(" ")[0] ?? "Guest"}
            </span>
            <ChevronDown className="size-3.5 text-faint" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full z-40 mt-2 w-48 overflow-hidden rounded-xl border border-card-border bg-card py-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.12)]">
              <Link
                href="/profile/me"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-primary-deep hover:bg-surface"
              >
                <UserRound className="size-4 text-faint" /> My Profile
              </Link>
              <Link
                href="/shortlist"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-primary-deep hover:bg-surface"
              >
                <Star className="size-4 text-faint" /> My Shortlist
              </Link>
              <Link
                href="/settings"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-primary-deep hover:bg-surface"
              >
                <Settings className="size-4 text-faint" /> Settings
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm font-semibold text-destructive hover:bg-surface"
              >
                <LogOut className="size-4" /> Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
