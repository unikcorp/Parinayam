import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface MembershipPlan {
  plan_id: number;
  plan_name: string;
  plan_type: string;
  plan_amount: string;
  plan_amount_type: string;
  plan_duration: number | null;
  plan_contacts: number;
  profile: number;
  /** null = unlimited (Platinum). */
  plan_msg: number | null;
  plan_sms: number;
  video: boolean;
  chat: boolean;
  plan_offers: string;
  status: "ACTIVE" | "INACTIVE";
  /** Plan hierarchy, ascending (Free < Silver < Gold < Platinum) — used to gate self-service downgrades. */
  sort_order: number;
  /** null = unlimited (Platinum). */
  interest_limit: number | null;
  can_use_advanced_search: boolean;
  can_see_who_viewed_me: boolean;
  can_use_profile_boost: boolean;
  has_priority_visibility: boolean;
  is_premium: boolean;
  /** The plan's currently valid offer, resolved server-side (CURDATE()-scoped) — null if none is active right now. */
  offer: {
    id: number;
    title: string;
    offer_price: number;
    discount_type: "fixed" | "percentage";
    start_date: string;
    end_date: string;
  } | null;
}

// Public — the real plans an admin has created in membership_plan (no
// pagination needed, there's only ever a handful of active plans).
export function useMembershipPlans() {
  return useQuery({
    queryKey: ["membership-plans", "active"],
    queryFn: () => api.get<MembershipPlan[]>("/api/membership-plans/public"),
  });
}
