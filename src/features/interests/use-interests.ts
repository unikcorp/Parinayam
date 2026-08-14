import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiError } from "@/lib/api";
import { useAuth } from "@/context/auth-context";
import {
  acceptInterestRequest,
  getReceivedInterestsRequest,
  getSentInterestsRequest,
  rejectInterestRequest,
  sendInterestRequest,
} from "./api";

const RECEIVED_KEY = ["interests", "received"];
const SENT_KEY = ["interests", "sent"];

export function useReceivedInterests() {
  const { isAuthenticated, isRestoring } = useAuth();
  return useQuery({
    queryKey: RECEIVED_KEY,
    queryFn: getReceivedInterestsRequest,
    enabled: isAuthenticated && !isRestoring,
  });
}

export function useSentInterests() {
  const { isAuthenticated, isRestoring } = useAuth();
  return useQuery({
    queryKey: SENT_KEY,
    queryFn: getSentInterestsRequest,
    enabled: isAuthenticated && !isRestoring,
  });
}

export function useSendInterest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (memberId: number) => sendInterestRequest(memberId),
    onSuccess: () => {
      toast.success("Interest sent!");
      queryClient.invalidateQueries({ queryKey: SENT_KEY });
    },
    onError: (error) => {
      // 409 = already sent — not really a failure from the member's point of
      // view, so a softer toast instead of a generic error.
      if (error instanceof ApiError && error.status === 409) {
        toast.info("You've already sent an interest to this profile.");
        return;
      }
      toast.error(error instanceof ApiError ? error.message : "Could not send the interest. Please try again.");
    },
  });
}

export function useRespondToInterest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, action }: { id: number; action: "accept" | "reject" }) =>
      action === "accept" ? acceptInterestRequest(id) : rejectInterestRequest(id),
    onSuccess: (_data, { action }) => {
      toast.success(action === "accept" ? "Interest accepted." : "Interest declined.");
      queryClient.invalidateQueries({ queryKey: RECEIVED_KEY });
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : "Something went wrong. Please try again.");
    },
  });
}
