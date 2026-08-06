import { z } from "zod";

const requiredString = (label: string) => z.string().min(1, `${label} is required`);
// Not `.optional()` — RHF always supplies a default value ("") for these fields,
// so the field is simply an unconstrained string as far as validation goes.
const optionalString = z.string();

export const registrationSchema = z.object({
  // Step 1 — Personal details
  profileFor: requiredString("Profile for"),
  fullName: requiredString("Full name"),
  gender: z.enum(["female", "male"]),
  dob: requiredString("Date of birth"),
  height: requiredString("Height"),
  maritalStatus: requiredString("Marital status"),
  motherTongue: requiredString("Mother tongue"),
  religion: requiredString("Religion"),
  caste: requiredString("Caste"),
  subCaste: optionalString,
  country: requiredString("Country"),
  state: requiredString("State"),
  district: requiredString("District"),

  // Step 2 — Education & career
  highestEducation: requiredString("Highest education"),
  fieldOfStudy: optionalString,
  occupation: requiredString("Occupation"),
  employer: optionalString,
  annualIncome: requiredString("Annual income"),

  // Step 3 — Family details
  familyType: requiredString("Family type"),
  familyValues: requiredString("Family values"),
  fatherOccupation: optionalString,
  motherOccupation: optionalString,
  siblings: optionalString,
  aboutFamily: optionalString,

  // Step 4 — Horoscope
  birthTime: optionalString,
  birthPlace: optionalString,
  star: optionalString,
  dosham: optionalString,
  horoscopeNote: optionalString,

  // Step 5 — Partner preferences
  partnerAgeMin: z.number(),
  partnerAgeMax: z.number(),
  partnerHeightMin: optionalString,
  partnerReligion: optionalString,
  partnerCaste: optionalString,
  partnerEducation: optionalString,
  partnerLocation: optionalString,
  partnerAbout: optionalString,

  // Step 6 — Photos
  photoCount: z.number().min(0),

  // Step 7 — Identity verification
  idType: requiredString("ID type"),
  idNumber: requiredString("ID number"),
  selfieCaptured: z.boolean(),
});

export type RegistrationFormValues = z.infer<typeof registrationSchema>;

/** Field names validated before advancing past each step index. */
export const registrationFieldsByStep: (keyof RegistrationFormValues)[][] = [
  ["profileFor", "fullName", "gender", "dob", "height", "maritalStatus", "motherTongue", "religion", "caste", "country", "state", "district"],
  ["highestEducation", "occupation", "annualIncome"],
  ["familyType", "familyValues"],
  [],
  [],
  [],
  ["idType", "idNumber"],
  [],
];
