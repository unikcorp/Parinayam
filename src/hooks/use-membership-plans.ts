import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface MembershipPlan {
  plan_id: number;
  plan_name: string;
  plan_type: string;
  plan_amount: string;
  plan_amount_type: string;
  plan_duration: number;
  plan_contacts: number;
  profile: number;
  plan_msg: number;
  plan_sms: number;
  video: boolean;
  chat: boolean;
  plan_offers: string;
  status: "ACTIVE" | "INACTIVE";
}

// Public — the real plans an admin has created in membership_plan (no
// pagination needed, there's only ever a handful of active plans).
export function useMembershipPlans() {
  return useQuery({
    queryKey: ["membership-plans", "active"],
    queryFn: () => api.get<MembershipPlan[]>("/api/membership-plans/public"),
  });
}
