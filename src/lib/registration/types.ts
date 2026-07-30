export interface RegistrationData {
  // Step 1 — Personal details
  profileFor: string;
  fullName: string;
  gender: "female" | "male";
  dob: string;
  height: string;
  maritalStatus: string;
  motherTongue: string;
  religion: string;
  caste: string;
  subCaste: string;
  country: string;
  state: string;
  district: string;

  // Step 2 — Education & career
  highestEducation: string;
  fieldOfStudy: string;
  occupation: string;
  employer: string;
  annualIncome: string;

  // Step 3 — Family details
  familyType: string;
  familyValues: string;
  fatherOccupation: string;
  motherOccupation: string;
  siblings: string;
  aboutFamily: string;

  // Step 4 — Horoscope
  birthTime: string;
  birthPlace: string;
  star: string;
  dosham: string;
  horoscopeNote: string;

  // Step 5 — Partner preferences
  partnerAgeMin: number;
  partnerAgeMax: number;
  partnerHeightMin: string;
  partnerReligion: string;
  partnerCaste: string;
  partnerEducation: string;
  partnerLocation: string;
  partnerAbout: string;

  // Step 6 — Photos
  photoCount: number;

  // Step 7 — Identity verification
  idType: string;
  idNumber: string;
  selfieCaptured: boolean;
}

export const initialRegistrationData: RegistrationData = {
  profileFor: "Myself",
  fullName: "",
  gender: "female",
  dob: "",
  height: "",
  maritalStatus: "Never married",
  motherTongue: "Malayalam",
  religion: "Hindu",
  caste: "Nair",
  subCaste: "Veluthedathu Nair",
  country: "India",
  state: "Kerala",
  district: "Ernakulam",

  highestEducation: "",
  fieldOfStudy: "",
  occupation: "",
  employer: "",
  annualIncome: "",

  familyType: "Nuclear family",
  familyValues: "Traditional",
  fatherOccupation: "",
  motherOccupation: "",
  siblings: "",
  aboutFamily: "",

  birthTime: "",
  birthPlace: "",
  star: "",
  dosham: "No dosham",
  horoscopeNote: "",

  partnerAgeMin: 27,
  partnerAgeMax: 34,
  partnerHeightMin: "5' 0\"",
  partnerReligion: "Hindu",
  partnerCaste: "Any",
  partnerEducation: "Any",
  partnerLocation: "Kerala, India",
  partnerAbout: "",

  photoCount: 0,

  idType: "Aadhaar",
  idNumber: "",
  selfieCaptured: false,
};

export const registrationSteps = [
  { key: "personal", title: "Personal details", sub: "Name, birth, community, location" },
  { key: "education", title: "Education & career", sub: "Degree, occupation, income" },
  { key: "family", title: "Family details", sub: "Parents, siblings, family values" },
  { key: "horoscope", title: "Horoscope", sub: "Star, dosham, birth details" },
  { key: "preferences", title: "Partner preferences", sub: "Who you’re looking for" },
  { key: "photos", title: "Photos", sub: "Add up to 6 photos" },
  { key: "verification", title: "Identity verification", sub: "ID + live selfie" },
  { key: "review", title: "Review & submit", sub: "One final look" },
] as const;

export type RegistrationStepKey = (typeof registrationSteps)[number]["key"];
