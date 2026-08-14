import { api } from "@/lib/api";
import type { InterestRecord } from "./types";

interface SendInterestResult {
  id: number;
  status: "PENDING";
}

export function sendInterestRequest(memberId: number) {
  return api.post<SendInterestResult>(`/api/members/me/interests/${memberId}`);
}

export function getReceivedInterestsRequest() {
  return api.get<InterestRecord[]>("/api/members/me/interests/received");
}

export function getSentInterestsRequest() {
  return api.get<InterestRecord[]>("/api/members/me/interests/sent");
}

export function acceptInterestRequest(id: number) {
  return api.patch(`/api/members/me/interests/${id}/accept`);
}

export function rejectInterestRequest(id: number) {
  return api.patch(`/api/members/me/interests/${id}/reject`);
}
