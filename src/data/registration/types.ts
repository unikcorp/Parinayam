import type { RegistrationFormValues } from "@/features/registration-wizard/schema";

export const initialRegistrationData: RegistrationFormValues = {
  profileCreatedBy: "Self",
  firstName: "",
  lastName: "",
  gender: "female",
  dobDay: "",
  dobMonth: "",
  dobYear: "",
  mobileCountryCode: "+91",
  mobileNumber: "",
  email: "",
  password: "",
  confirmPassword: "",
  religion: "",
  maritalStatus: "Never Married",

  height: "",
  weight: "",
  bodyType: "",
  complexion: "",
  physicalStatus: "",
  bloodGroup: "",
  motherTongue: "",
  caste: "",
  subCaste: "",
  willingToMarryOtherCaste: false,
  diet: "",
  smokingHabits: "",
  drinkingHabits: "",
  country: "",
  state: "",
  district: "",

  highestEducation: "",
  fieldOfStudy: "",
  occupation: "",
  employer: "",
  annualIncome: "",

  familyType: "",
  familyValues: "",
  fatherOccupation: "",
  motherOccupation: "",
  siblings: "",
  aboutFamily: "",

  birthTime: "",
  birthPlace: "",
  star: "",
  dosham: "",
  horoscopeNote: "",

  aboutMe: "",

  partnerAgeMin: 27,
  partnerAgeMax: 34,
  partnerHeightMin: "5' 0\"",
  partnerReligion: "",
  partnerCaste: "",
  partnerEducation: "",
  partnerLocation: "",
  partnerAbout: "",

  photoCount: 0,

  idType: "",
  idDocumentNumber: "",
  idDocumentUploaded: false,
};

export const registrationSteps = [
  { key: "account", title: "Account info", sub: "Name, contact & login details" },
  { key: "personal", title: "Personal details", sub: "Community, appearance, location" },
  { key: "education", title: "Education & career", sub: "Degree, occupation, income" },
  { key: "family", title: "Family details", sub: "Parents, siblings, family values" },
  { key: "horoscope", title: "Horoscope", sub: "Star, dosham, birth details" },
  { key: "about", title: "About you", sub: "A few lines for your profile" },
  { key: "preferences", title: "Partner preferences", sub: "Who you’re looking for" },
  { key: "photos", title: "Photos", sub: "Add up to 6 photos" },
  { key: "verification", title: "Identity verification", sub: "ID + live selfie" },
  { key: "review", title: "Review & submit", sub: "One final look" },
] as const;

export type RegistrationStepKey = (typeof registrationSteps)[number]["key"];
