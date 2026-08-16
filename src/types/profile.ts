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
  verified: boolean;
  /** null when the viewer hasn't set partner preferences — nothing to score against. */
  match: number | null;
}

// Still used by the homepage's separate "Featured profiles" carousel
// (unrelated to /search) — kept here since that section is still mock data.
export interface FeaturedProfile {
  name: string;
  age: number;
  job: string;
  place: string;
  match: number;
  premium?: boolean;
  online?: boolean;
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
  sort?: "match" | "newest";
  page?: number;
  limit?: number;
}
