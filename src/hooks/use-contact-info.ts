import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface ContactInfo {
  phone: string;
  whatsapp: string;
  address: string;
  hours: string;
  supportEmail: string;
  notifyEmail: string;
}

// Public — admin-configured (Site Settings > Update Contact Info), shown on
// the Contact Us page. notifyEmail is returned too but never displayed —
// it's only used server-side to route the notification email.
export function useContactInfo() {
  return useQuery({
    queryKey: ["contact-info"],
    queryFn: () => api.get<ContactInfo>("/api/site-settings/contact-info"),
    staleTime: 5 * 60 * 1000,
  });
}
