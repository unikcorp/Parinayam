import { api } from "@/lib/api";
import type { HighlightPackage, HighlightPurchase, InitiateHighlightPurchaseResult } from "./types";

// Public — no auth needed, active packages only.
export function getHighlightPackagesRequest() {
  return api.get<HighlightPackage[]>("/api/profile-highlight-packages/public");
}

export function initiateHighlightPurchaseRequest(packageId: number) {
  return api.post<InitiateHighlightPurchaseResult>("/api/profile-highlight-purchases/initiate", { packageId });
}

export function confirmHighlightPurchaseRequest(purchaseId: number, gatewayPaymentId: string) {
  return api.post<HighlightPurchase>("/api/profile-highlight-purchases/confirm", { purchaseId, gatewayPaymentId });
}

export function getHighlightStatusRequest() {
  return api.get<HighlightPurchase | null>("/api/profile-highlight-purchases/status");
}

export function getHighlightHistoryRequest() {
  return api.get<HighlightPurchase[]>("/api/profile-highlight-purchases/history");
}
