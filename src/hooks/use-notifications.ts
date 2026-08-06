import { useQuery } from "@tanstack/react-query";
import { fetchNotificationGroups } from "@/data/notifications.data";

export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotificationGroups,
  });
}
