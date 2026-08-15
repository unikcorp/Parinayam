// One row from GET /members/me/shortlist — the shortlisted member's basic
// display info, joined server-side. Mirrors features/interests/types.ts.
export interface ShortlistRecord {
  id: number;
  created_at: string;
  member_id: number;
  member_code: string;
  first_name: string;
  last_name: string;
  gender: "Male" | "Female" | string;
  photo_url: string | null;
}
