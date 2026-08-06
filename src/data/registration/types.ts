import type { RegistrationData } from "@/types/registration";

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
