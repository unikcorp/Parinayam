import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, ApiError } from "@/lib/api";
import type { ReportReason } from "./types";

export function useReportMember() {
  return useMutation({
    mutationFn: ({ memberId, reason, details }: { memberId: number; reason: ReportReason; details?: string }) =>
      api.post(`/api/members/me/reports/${memberId}`, { reason, details: details || null }),
    onSuccess: () => {
      toast.success("Report submitted and member blocked. Our team will review it.");
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : "Could not submit the report. Please try again.");
    },
  });
}
