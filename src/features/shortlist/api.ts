import { api } from "@/lib/api";
import type { ShortlistRecord } from "./types";

export function getShortlistRequest() {
  return api.get<ShortlistRecord[]>("/api/members/me/shortlist");
}

export function addToShortlistRequest(memberId: number) {
  return api.post(`/api/members/me/shortlist/${memberId}`);
}

export function removeFromShortlistRequest(memberId: number) {
  return api.delete(`/api/members/me/shortlist/${memberId}`);
}
