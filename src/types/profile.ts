export interface SearchResult {
  id: number;
  memberCode: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | string;
  height: string | null;
  occupation: string | null;
  place: string;
  religion: string | null;
  caste: string | null;
  photoUrl: string | null;
  photoIsBlurred: boolean;
  isPremium: boolean;
  verified: boolean;
  /** null when the viewer hasn't set partner preferences — nothing to score against. */
  match: number | null;
}

// Homepage "Featured profiles" section — admin-picked real members, served
// by GET /api/site-settings/featured-members (see FeaturedProfiles admin
// page). Shape mirrors SearchResult so the same ProfileCard mapping works.
export interface FeaturedProfile {
  id: number;
  memberCode: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | string;
  occupation: string | null;
  place: string;
  photoUrl: string | null;
  isPremium: boolean;
  verified: boolean;
}

export interface SearchFilters {
  ageMin?: number;
  ageMax?: number;
  minHeight?: string;
  religion?: number;
  caste?: number;
  subCaste?: number;
  education?: number;
  occupation?: number;
  annualIncome?: number;
  maritalStatus?: string;
  country?: number;
  state?: number;
  district?: number;
  /** Widen the district filter to every district within ~50km, not just an exact match. */
  nearby?: boolean;
  sort?: "match" | "newest";
  page?: number;
  limit?: number;
}
