// One row from GET /members/me/recently-viewed — the viewed member's basic
// display info, joined server-side.
export interface RecentlyViewedRecord {
  id: number;
  viewed_at: string;
  member_id: number;
  member_code: string;
  first_name: string;
  last_name: string;
  gender: "Male" | "Female" | string;
  district_name: string | null;
  state_name: string | null;
  photo_url: string | null;
  photo_is_blurred: boolean;
}
