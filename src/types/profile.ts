export interface SearchResult {
  name: string;
  age: number;
  job: string;
  height: string;
  place: string;
  match: number;
  premium?: boolean;
  online?: boolean;
}

export interface FeaturedProfile {
  name: string;
  age: number;
  job: string;
  place: string;
  match: number;
  premium?: boolean;
  online?: boolean;
}
