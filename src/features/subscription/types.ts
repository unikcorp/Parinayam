// Mirrors member_subscriptions row shape returned by the confirm/list
// endpoints (server/src/modules/member-subscription).
export interface SubscriptionRecord {
  id: number;
  member_id: number;
  plan_id: number;
  offer_id: number | null;
  plan_name_snapshot: string;
  original_price: string;
  discount_amount: string;
  paid_amount: string;
  status: "PENDING" | "ACTIVE" | "EXPIRED" | "CANCELLED";
  started_at: string;
  expires_at: string | null;
  contact_views_used: number;
  created_at: string;
  updated_at: string;
}

export interface InitiateSubscriptionResult {
  subscription_id: number;
  paid_amount: number;
  payment_order: {
    gateway: string;
    orderId: string;
    amount: number;
    currency: string;
  };
}
