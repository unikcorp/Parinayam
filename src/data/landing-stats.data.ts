/**
 * Trust-statistics strip values. Hardcoded for now — swap for a fetch from
 * a backend stats endpoint once one exists; the shape stays the same.
 */
export interface LandingStat {
  value: string;
  label: string;
}

export const trustStatistics: LandingStat[] = [
  { value: "12,400+", label: "Verified profiles" },
  { value: "3,200+", label: "Marriages arranged" },
  { value: "14", label: "Districts across Kerala" },
  { value: "4.9★", label: "Average member rating" },
];
