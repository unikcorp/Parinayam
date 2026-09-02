import { api } from "@/lib/api";
import type { MembershipSummary } from "./summary-types";

export function getMembershipSummaryRequest() {
  return api.get<MembershipSummary>("/api/members/me/entitlements/summary");
}
