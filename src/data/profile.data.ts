export const mockProfile = {
  name: "Arjun Nair",
  age: 29,
  occupation: "Chartered Accountant",
  place: "Thrissur, Kerala",
  height: "5'9\"",
  maritalStatus: "Never married",
  memberId: "PNM-2023-04127",
  managedByParent: true,
  lastActive: "5 min ago",
  online: true,
  verified: true,
  premium: true,
  photoCount: 12,
  matchPercent: 92,
  porutham: "9/10",
  lifestyleMatch: 96,
  trustScore: 94,
  aiSummary:
    "A Thrissur-based Chartered Accountant from a close-knit traditional family, Arjun balances a settled career with a love for travel and Carnatic music. His family values horoscope compatibility and is looking for an educated partner from Kerala, ideally settled in India. Profiles like his typically respond within a day.",
  sections: [
    {
      key: "education",
      icon: "education",
      title: "Education & career",
      rows: [
        ["Highest education", "CA, ICAI Delhi"],
        ["Undergraduate", "B.Com, Kerala University"],
        ["Occupation", "Chartered Accountant"],
        ["Employer", "Own practice, Thrissur"],
        ["Annual income", "₹18–22 LPA"],
        ["Work location", "Thrissur, Kerala"],
      ],
    },
    {
      key: "family",
      icon: "family",
      title: "Family",
      rows: [
        ["Family type", "Traditional, nuclear"],
        ["Father", "Retired bank officer"],
        ["Mother", "Homemaker"],
        ["Siblings", "1 sister, married"],
        ["Family location", "Thrissur"],
        ["Ancestral home", "Irinjalakuda"],
      ],
    },
    {
      key: "lifestyle",
      icon: "lifestyle",
      title: "Lifestyle",
      rows: [
        ["Diet", "Vegetarian"],
        ["Smoking", "Never"],
        ["Drinking", "Never"],
        ["Hobbies", "Travel, Carnatic music"],
        ["Languages", "Malayalam, English, Hindi"],
        ["Pets", "Loves dogs"],
      ],
    },
    {
      key: "religion",
      icon: "religion",
      title: "Religion & community",
      rows: [
        ["Religion", "Hindu"],
        ["Caste", "Nair"],
        ["Sub caste", "Veluthedathu Nair"],
        ["Family deity", "Guruvayurappan"],
        ["Gothram", "Vishwamitra"],
        ["Religious level", "Moderately observant"],
      ],
    },
  ],
  partnerPrefMatches: [
    { label: "Age", value: "24–29 yrs — you are 27" },
    { label: "Education", value: "Graduate & above — you: Postgraduate" },
    { label: "Community", value: "Veluthedathu Nair — matched" },
    { label: "Location", value: "Kerala, India — matched" },
    { label: "Working partner", value: "Prefers working — you: employed" },
  ],
  horoscope: {
    star: "Thiruvathira",
    rasi: "Mithunam",
    dosham: "No dosham",
    birthTimePlace: "04:32 AM · Thrissur",
  },
  mutualConnectionsCount: 3,
  similarProfiles: [
    { name: "Kiran P, 31", meta: "Engineer · Kozhikode", match: 89 },
    { name: "Sreejith M, 30", meta: "Banker · Kottayam", match: 87 },
    { name: "Hari K, 28", meta: "Architect · Palakkad", match: 84 },
  ],
} as const;

export type MockProfile = typeof mockProfile;

// The `id` param mirrors the shape a real per-profile lookup would take;
// every id currently resolves to the same mock record.
export async function fetchProfile(_id: string): Promise<MockProfile> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockProfile;
}
