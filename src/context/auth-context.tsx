"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, setAccessToken, clearAccessToken } from "@/lib/api";
import type { SessionUser } from "@/types/session";

interface AuthContextValue {
  user: SessionUser | null;
  isAuthenticated: boolean;
  isRestoring: boolean;
  login: (user: SessionUser, accessToken: string) => void;
  logout: () => void;
}

interface MemberMeResponse {
  member: { id: number; first_name: string; last_name: string; member_code: string; email: string };
}

const AuthContext = createContext<AuthContextValue | null>(null);

function toSessionUser(member: MemberMeResponse["member"]): SessionUser {
  const name = `${member.first_name} ${member.last_name}`.trim();
  return {
    id: String(member.id),
    name,
    email: member.email,
    avatarInitials: `${member.first_name[0] ?? ""}${member.last_name[0] ?? ""}`.toUpperCase(),
    premium: false,
    memberCode: member.member_code,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isRestoring, setIsRestoring] = useState(true);

  // The access token lives only in memory (see lib/api.ts), so a full page
  // reload loses it even though the httpOnly refresh cookie is still valid —
  // this silently re-derives the session from that cookie on first mount.
  useEffect(() => {
    let cancelled = false;

    async function restore() {
      try {
        const { accessToken } = await api.post<{ accessToken: string }>("/api/auth/refresh");
        setAccessToken(accessToken);
        const { member } = await api.get<MemberMeResponse>("/api/members/me");
        if (!cancelled) setUser(toSessionUser(member));
      } catch {
        // No valid session to restore — stay logged out.
      } finally {
        if (!cancelled) setIsRestoring(false);
      }
    }

    restore();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = (nextUser: SessionUser, accessToken: string) => {
    setAccessToken(accessToken);
    setUser(nextUser);
  };

  const logout = () => {
    clearAccessToken();
    setUser(null);
  };

  const value = useMemo<AuthContextValue>(
    () => ({ user, isAuthenticated: !!user, isRestoring, login, logout }),
    [user, isRestoring]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
