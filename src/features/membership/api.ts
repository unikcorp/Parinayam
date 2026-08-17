import { api } from "@/lib/api";
import type { Entitlements } from "./types";

export function getEntitlementsRequest() {
  return api.get<Entitlements>("/api/members/me/entitlements");
}
