export type InterestStatus = "PENDING" | "ACCEPTED" | "REJECTED";

// One row from GET /members/me/interests/received or /sent — the other
// member's basic display info, joined server-side.
export interface InterestRecord {
  id: number;
  status: InterestStatus;
  created_at: string;
  member_id: number;
  member_code: string;
  first_name: string;
  last_name: string;
  gender: "Male" | "Female" | string;
  photo_url: string | null;
}
