import { z } from "zod";
import { emailField, mobileField, nameField, passwordField } from "@/validation/rules";

const requiredString = (label: string) => z.string().min(1, `${label} is required`);
// Not `.optional()` — RHF always supplies a default value ("") for these fields,
// so the field is simply an unconstrained string as far as validation goes.
const optionalString = z.string();

const isFilled = (value: unknown) => typeof value === "string" && value.trim().length > 0;

// A step is either left completely alone (and skipped) or, the moment the
// member fills in any one of its fields, the rest of that step's fields
// (minus any free-text ones passed as `exempt`) become required too — no
// half-filled steps. Field labels are derived from their camelCase name
// since these groups don't have per-field custom labels the way the
// individually-required fields above do.
function requireGroupIfAnyFilled<T extends Record<string, unknown>>(
  data: T,
  ctx: z.RefinementCtx,
  { fields, exempt = [] }: { fields: (keyof T)[]; exempt?: (keyof T)[] }
) {
  const touched = fields.some((f) => isFilled(data[f])) || exempt.some((f) => isFilled(data[f]));
  if (!touched) return;

  for (const field of fields) {
    if (!isFilled(data[field])) {
      const label = String(field).replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
      ctx.addIssue({ code: "custom", message: `${label} is required`, path: [field as string] });
    }
  }
}

export const registrationSchema = z
  .object({
    // Step 1 — Account info
    profileCreatedBy: requiredString("Profile created by"),
    firstName: nameField("First name"),
    lastName: nameField("Last name"),
    gender: z.enum(["female", "male"]),
    dobDay: requiredString("Day"),
    dobMonth: requiredString("Month"),
    dobYear: requiredString("Year"),
    mobileCountryCode: requiredString("Country code"),
    mobileNumber: mobileField,
    email: emailField,
    // Stricter than admin's Add Member form (8 vs 6 chars) since this
    // account is self-registered by the member, not set up by staff.
    password: passwordField(8),
    confirmPassword: z.string(),
    religion: requiredString("Religion"),
    maritalStatus: requiredString("Marital status"),

    // Step 2 — Personal details. Not individually required — the whole
    // group becomes required together only if the member starts filling any
    // one of them in (see the superRefine below); an untouched step can
    // still be skipped outright.
    height: optionalString,
    weight: optionalString,
    bodyType: optionalString,
    complexion: optionalString,
    physicalStatus: optionalString,
    bloodGroup: optionalString,
    motherTongue: optionalString,
    caste: optionalString,
    subCaste: optionalString,
    willingToMarryOtherCaste: z.boolean(),
    diet: optionalString,
    smokingHabits: optionalString,
    drinkingHabits: optionalString,
    country: optionalString,
    state: optionalString,
    district: optionalString,

    // Step 3 — Education & career (same "required as a group, or skip
    // entirely" rule)
    highestEducation: optionalString,
    fieldOfStudy: optionalString,
    occupation: optionalString,
    employer: optionalString,
    annualIncome: optionalString,

    // Step 4 — Family details. aboutFamily is free text and stays optional
    // even when the rest of the step is filled in.
    familyType: optionalString,
    familyValues: optionalString,
    fatherOccupation: optionalString,
    motherOccupation: optionalString,
    siblings: optionalString,
    aboutFamily: optionalString,

    // Step 5 — Horoscope. horoscopeNote is free text and stays optional
    // even when the rest of the step is filled in.
    birthTime: optionalString,
    birthPlace: optionalString,
    star: optionalString,
    dosham: optionalString,
    horoscopeNote: optionalString,

    // Step 6 — About you. Its only field is free text, so this step never
    // has anything to require — always skippable.
    aboutMe: optionalString,

    // Step 7 — Partner preferences. partnerAbout is free text and stays
    // optional; age/height already carry sensible defaults so they're left
    // out of the "required as a group" check below.
    partnerAgeMin: z.number(),
    partnerAgeMax: z.number(),
    partnerHeightMin: optionalString,
    partnerReligion: optionalString,
    partnerCaste: optionalString,
    partnerEducation: optionalString,
    partnerLocation: optionalString,
    partnerAbout: optionalString,

    // Step 8 — Photos (not mandatory)
    photoCount: z.number().min(0),

    // Step 9 — Identity verification (not mandatory)
    idType: optionalString,
    idDocumentUploaded: z.boolean(),

    // Step 10 — Review & submit has no fields of its own
  })
  .superRefine((data, ctx) => {
    if (data.confirmPassword !== data.password) {
      ctx.addIssue({ code: "custom", message: "Passwords do not match", path: ["confirmPassword"] });
    }

    requireGroupIfAnyFilled(data, ctx, {
      fields: [
        "height", "weight", "bodyType", "complexion", "physicalStatus", "bloodGroup",
        "motherTongue", "caste", "diet", "smokingHabits", "drinkingHabits",
        "country", "state", "district",
      ],
      // Not every caste has sub-castes to choose from, so this can't be
      // required even when the rest of the step is filled in.
      exempt: ["subCaste"],
    });
    requireGroupIfAnyFilled(data, ctx, {
      fields: ["highestEducation", "fieldOfStudy", "occupation", "employer", "annualIncome"],
    });
    requireGroupIfAnyFilled(data, ctx, {
      fields: ["familyType", "familyValues", "fatherOccupation", "motherOccupation", "siblings"],
      exempt: ["aboutFamily"],
    });
    requireGroupIfAnyFilled(data, ctx, {
      fields: ["birthTime", "birthPlace", "star", "dosham"],
      exempt: ["horoscopeNote"],
    });
    requireGroupIfAnyFilled(data, ctx, {
      fields: ["partnerHeightMin", "partnerReligion", "partnerCaste", "partnerEducation", "partnerLocation"],
      exempt: ["partnerAbout"],
    });
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
  [
    "height", "weight", "bodyType", "complexion", "physicalStatus", "bloodGroup",
    "motherTongue", "caste", "diet", "smokingHabits", "drinkingHabits",
    "country", "state", "district",
  ],
  ["highestEducation", "fieldOfStudy", "occupation", "employer", "annualIncome"],
  ["familyType", "familyValues", "fatherOccupation", "motherOccupation", "siblings"],
  ["birthTime", "birthPlace", "star", "dosham"],
  [],
  ["partnerHeightMin", "partnerReligion", "partnerCaste", "partnerEducation", "partnerLocation"],
  [],
  [],
  [],
];
