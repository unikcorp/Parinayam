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
