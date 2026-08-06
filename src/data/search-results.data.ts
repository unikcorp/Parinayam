import type { SearchResult } from "@/types/profile";

export const searchResults: SearchResult[] = [
  { name: "Arjun N", age: 29, job: "Chartered Accountant", height: "5'9\"", place: "Thrissur", match: 92, premium: true, online: true },
  { name: "Kiran P", age: 31, job: "Civil Engineer, Dubai", height: "5'11\"", place: "Kozhikode", match: 89, online: false },
  { name: "Sreejith M", age: 30, job: "Bank Manager, Federal Bank", height: "5'8\"", place: "Kottayam", match: 87, premium: true, online: true },
  { name: "Vishnu P", age: 30, job: "Government Officer", height: "5'10\"", place: "Trivandrum", match: 85, online: false },
  { name: "Hari K", age: 28, job: "Software Architect", height: "5'7\"", place: "Palakkad", match: 84, online: true },
  { name: "Deepak M", age: 32, job: "Physician, MD", height: "6'0\"", place: "Kannur", match: 82, premium: true, online: false },
];

export const searchSortOptions = ["Best match", "Newest first", "Recently active"];

export async function fetchSearchResults(): Promise<SearchResult[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return searchResults;
}
