import { useQuery } from "@tanstack/react-query";
import { fetchPlans } from "@/data/plans.data";

export function usePlans() {
  return useQuery({
    queryKey: ["plans"],
    queryFn: fetchPlans,
  });
}
