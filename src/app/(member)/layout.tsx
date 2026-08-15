"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useNotificationSocket } from "@/features/notifications/use-notification-socket";
import { useMessageSocket } from "@/features/messaging/use-message-socket";

// Every route under (member) — dashboard, search, messages, settings,
// checkout, profile — requires a logged-in member. Without this, visiting
// one of these URLs while logged out (or after the session expires) just
// silently renders the page with no user and every API call 401ing, which
// looks like a broken page instead of the "please log in" it actually is.
export default function MemberLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isRestoring } = useAuth();
  const router = useRouter();

  // One socket connection for the whole authenticated session — mounted
  // here (not inside NotificationBell) since the header renders two bell
  // instances at once (desktop + mobile, CSS-toggled), and each would
  // otherwise open its own connection and double-apply every event.
  useNotificationSocket();
  useMessageSocket();

  useEffect(() => {
    if (!isRestoring && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isRestoring, isAuthenticated, router]);

  if (isRestoring || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center gap-2 text-sm text-faint">
        <Loader2 className="size-4 animate-spin" /> Loading…
      </div>
    );
  }

  return <>{children}</>;
}
