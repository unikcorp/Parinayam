import { api } from "@/lib/api";
import type { PurchasePreview } from "./preview-types";

export function getEntitlementsPreviewRequest(planId: number) {
  return api.get<PurchasePreview>(`/api/members/me/entitlements/preview?planId=${planId}`);
}
