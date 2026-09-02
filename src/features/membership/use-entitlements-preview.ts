import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/auth-context";
import { getEntitlementsPreviewRequest } from "./preview-api";

// The purchase confirmation screen's data source — only fetched once a
// candidate plan is known and the member has something active to carry
// forward (checkout skips this call entirely otherwise).
export function useEntitlementsPreview(planId: number | null, enabled: boolean) {
  const { isAuthenticated, isRestoring } = useAuth();

  const query = useQuery({
    queryKey: ["membership", "preview", planId],
    queryFn: () => getEntitlementsPreviewRequest(planId as number),
    enabled: isAuthenticated && !isRestoring && enabled && planId != null && !Number.isNaN(planId),
  });

  return {
    preview: query.data,
    isLoading: isRestoring || query.isLoading,
    isError: query.isError,
  };
}
