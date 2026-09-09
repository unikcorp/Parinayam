// Mirrors profile_highlight_package / profile_highlight_purchase row shapes
// returned by server/src/modules/profile-highlight-package and
// profile-highlight-purchase.
export interface HighlightPackage {
  id: number;
  package_name: string;
  price: string;
  duration_days: number;
  description: string | null;
  status: "ACTIVE" | "INACTIVE";
  sort_order: number;
}

export interface HighlightPurchase {
  id: number;
  member_id: number;
  package_id: number | null;
  package_name_snapshot: string;
  duration_days: number;
  paid_amount: string;
  status: "PENDING" | "ACTIVE" | "EXPIRED" | "CANCELLED";
  started_at: string | null;
  expires_at: string | null;
  activated_by: "MEMBER" | "ADMIN" | null;
  activated_by_user_id: number | null;
  created_at: string;
  updated_at: string;
}

export interface InitiateHighlightPurchaseResult {
  purchase_id: number;
  paid_amount: number;
  payment_order: {
    gateway: string;
    orderId: string;
    amount: number;
    currency: string;
    keyId: string;
  };
}

export interface RazorpayHighlightConfirmPayload {
  purchaseId: number;
  razorpay: {
    orderId: string;
    paymentId: string;
    signature: string;
  };
}
