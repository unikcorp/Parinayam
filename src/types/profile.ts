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
  /** Profile Highlight — a paid add-on independent of Membership. */
  isHighlighted: boolean;
  verified: boolean;
  /** null when the viewer hasn't set partner preferences — nothing to score against. */
  match: number | null;
  /** Only set when the Nearby filter is active. */
  distanceKm?: number | null;
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
  /** Widen the district filter (or the viewer's own district) to a radius search. */
  nearby?: boolean;
  /** Only meaningful when nearby is true. Defaults to 50 on the server if omitted. */
  radius?: 25 | 50 | 100 | 200;
  sort?: "match" | "newest";
  page?: number;
  limit?: number;
}
