import { z } from "zod";

const requiredString = (label: string) => z.string().min(1, `${label} is required`);
// Not `.optional()` — RHF always supplies a default value ("") for these fields,
// so the field is simply an unconstrained string as far as validation goes.
const optionalString = z.string();

// Email/mobile mirror admin/src/validation. Password is stricter here (8 vs
// admin's 6) since this account is self-registered by the member, not set
// up by staff.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_REGEX = /^\d{10}$/;
const MIN_PASSWORD_LENGTH = 8;

export const registrationSchema = z
  .object({
    // Step 1 — Account info
    profileCreatedBy: requiredString("Profile created by"),
    firstName: requiredString("First name"),
    lastName: requiredString("Last name"),
    gender: z.enum(["female", "male"]),
    dobDay: requiredString("Day"),
    dobMonth: requiredString("Month"),
    dobYear: requiredString("Year"),
    mobileCountryCode: requiredString("Country code"),
    mobileNumber: z.string().regex(MOBILE_REGEX, "Enter a valid 10-digit mobile number"),
    email: z.string().regex(EMAIL_REGEX, "Enter a valid email address"),
    password: z.string().min(MIN_PASSWORD_LENGTH, `Password must be at least ${MIN_PASSWORD_LENGTH} characters`),
    confirmPassword: z.string(),
    religion: requiredString("Religion"),
    maritalStatus: requiredString("Marital status"),

    // Step 2 — Personal details
    height: requiredString("Height"),
    weight: optionalString,
    bodyType: optionalString,
    complexion: optionalString,
    physicalStatus: optionalString,
    bloodGroup: optionalString,
    motherTongue: requiredString("Mother tongue"),
    caste: requiredString("Caste"),
    subCaste: optionalString,
    willingToMarryOtherCaste: z.boolean(),
    diet: optionalString,
    smokingHabits: optionalString,
    drinkingHabits: optionalString,
    country: requiredString("Country"),
    state: requiredString("State"),
    district: requiredString("District"),

    // Step 3 — Education & career
    highestEducation: requiredString("Highest education"),
    fieldOfStudy: optionalString,
    occupation: requiredString("Occupation"),
    employer: optionalString,
    annualIncome: requiredString("Annual income"),

    // Step 4 — Family details
    familyType: requiredString("Family type"),
    familyValues: requiredString("Family values"),
    fatherOccupation: optionalString,
    motherOccupation: optionalString,
    siblings: optionalString,
    aboutFamily: optionalString,

    // Step 5 — Horoscope
    birthTime: optionalString,
    birthPlace: optionalString,
    star: optionalString,
    dosham: optionalString,
    horoscopeNote: optionalString,

    // Step 6 — Partner preferences
    partnerAgeMin: z.number(),
    partnerAgeMax: z.number(),
    partnerHeightMin: optionalString,
    partnerReligion: optionalString,
    partnerCaste: optionalString,
    partnerEducation: optionalString,
    partnerLocation: optionalString,
    partnerAbout: optionalString,

    // Step 7 — Photos
    photoCount: z.number().min(0),

    // Step 8 — Identity verification
    idType: requiredString("ID type"),
    idDocumentUploaded: z.boolean(),
    selfieCaptured: z.boolean(),

    // Step 9 — Review & submit has no fields of its own
  })
  .superRefine((data, ctx) => {
    if (data.confirmPassword !== data.password) {
      ctx.addIssue({ code: "custom", message: "Passwords do not match", path: ["confirmPassword"] });
    }
  });

export type RegistrationFormValues = z.infer<typeof registrationSchema>;

/** Field names validated before advancing past each step index. */
export const registrationFieldsByStep: (keyof RegistrationFormValues)[][] = [
  [
    "profileCreatedBy",
    "firstName",
    "lastName",
    "gender",
    "dobDay",
    "dobMonth",
    "dobYear",
    "mobileNumber",
    "email",
    "password",
    "confirmPassword",
    "religion",
    "maritalStatus",
  ],
  ["height", "motherTongue", "caste", "country", "state", "district"],
  ["highestEducation", "occupation", "annualIncome"],
  ["familyType", "familyValues"],
  [],
  [],
  [],
  ["idType"],
  [],
];
