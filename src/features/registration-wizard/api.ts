import { api } from "@/lib/api";
import { setAccessToken } from "@/lib/api";
import type { RegistrationFormValues } from "./schema";
import type { RegistrationLookups } from "./use-registration-lookups";

const DOB_MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
function toMonthNumber(monthName: string): number {
  return DOB_MONTHS.indexOf(monthName) + 1;
}

function toServerGender(gender: "female" | "male"): "Male" | "Female" {
  return gender === "female" ? "Female" : "Male";
}

const DOCUMENT_TYPE_MAP: Record<string, "Aadhaar" | "Passport" | "PAN" | "Other"> = {
  Aadhaar: "Aadhaar",
  Passport: "Passport",
  PAN: "PAN",
  "Other Documents": "Other",
};

// ---------- Step 1 — Account info (creates the login) ----------
export interface RegisterSelfResult {
  memberId: number;
  currentStep: number;
  status: "DRAFT";
  accessToken: string;
}

export async function registerSelfRequest(
  values: RegistrationFormValues,
  lookups: RegistrationLookups,
): Promise<RegisterSelfResult> {
  const result = await api.post<RegisterSelfResult>("/api/members/register", {
    profileCreatedBy: values.profileCreatedBy,
    firstName: values.firstName,
    lastName: values.lastName,
    gender: toServerGender(values.gender),
    dobDay: Number(values.dobDay),
    dobMonth: toMonthNumber(values.dobMonth),
    dobYear: Number(values.dobYear),
    mobileCountryCode: values.mobileCountryCode,
    mobileNumber: values.mobileNumber,
    email: values.email,
    password: values.password,
    confirmPassword: values.confirmPassword,
    religion: lookups.resolveReligionId(values.religion),
    maritalStatus: values.maritalStatus || null,
  });
  setAccessToken(result.accessToken);
  return result;
}

// ---------- Editing Account Info after the account already exists (from
// /profile/edit, not registration) — same PUT /:id/basic the admin panel's
// Edit Member form uses. No password/email here (those live in Settings →
// Security), so mobileCountryCode/mobileNumber/accountStatus are resent
// unchanged rather than left for the caller to omit and risk clearing. ----------
export async function updateAccountInfoRequest(
  memberId: number,
  values: RegistrationFormValues,
  lookups: RegistrationLookups,
  currentAccountStatus: "ACTIVE" | "INACTIVE" | "BLOCKED" | "PENDING_APPROVAL",
) {
  await api.put(`/api/members/${memberId}/basic`, {
    profileCreatedBy: values.profileCreatedBy,
    accountStatus: currentAccountStatus,
    firstName: values.firstName,
    lastName: values.lastName,
    gender: toServerGender(values.gender),
    dobDay: Number(values.dobDay),
    dobMonth: toMonthNumber(values.dobMonth),
    dobYear: Number(values.dobYear),
    mobileCountryCode: values.mobileCountryCode,
    mobileNumber: values.mobileNumber,
    religion: values.religion ? lookups.resolveReligionId(values.religion) : null,
    maritalStatus: values.maritalStatus || null,
  });
}

// ---------- Step 2 — Personal details (+ embedded horoscope) ----------
export function buildPersonalDetailsPayload(values: RegistrationFormValues, lookups: RegistrationLookups) {
  return {
    motherTongue: lookups.resolveMotherTongueId(values.motherTongue),
    caste: lookups.resolveCasteId(values.caste, values.religion),
    subCaste: values.subCaste ? lookups.resolveSubCasteId(values.subCaste, values.caste) : null,
    height: values.height || null,
    weight: values.weight || null,
    bodyType: values.bodyType || null,
    complexion: values.complexion || null,
    physicalStatus: values.physicalStatus || null,
    bloodGroup: values.bloodGroup || null,
    diet: values.diet || null,
    smokingHabits: values.smokingHabits || null,
    drinkingHabits: values.drinkingHabits || null,
    willingToMarryOtherCaste: values.willingToMarryOtherCaste,
    horoscope: {
      star: values.star ? lookups.resolveStarId(values.star) : null,
      doshType: values.dosham ? lookups.resolveDoshId(values.dosham) : null,
      birthTime: values.birthTime || null,
      birthPlace: values.birthPlace || null,
      horoscopeNote: values.horoscopeNote || null,
    },
  };
}

export async function updatePersonalDetailsRequest(
  memberId: number,
  values: RegistrationFormValues,
  lookups: RegistrationLookups,
) {
  await api.put(`/api/members/${memberId}/personal`, buildPersonalDetailsPayload(values, lookups));
}

// ---------- Location (same client step as Personal, separate server endpoint) ----------
export async function updateLocationRequest(
  memberId: number,
  values: RegistrationFormValues,
  lookups: RegistrationLookups,
) {
  await api.put(`/api/members/${memberId}/location`, {
    country: lookups.resolveCountryId(values.country),
    state: lookups.resolveStateId(values.state, values.country),
    district: lookups.resolveDistrictId(values.district, values.state),
  });
}

// ---------- Step 3 — Education & career ----------
export async function updateEducationRequest(
  memberId: number,
  values: RegistrationFormValues,
  lookups: RegistrationLookups,
) {
  await api.put(`/api/members/${memberId}/education`, {
    highestEducation: lookups.resolveEducationId(values.highestEducation),
    fieldOfStudy: values.fieldOfStudy || null,
    occupation: lookups.resolveOccupationId(values.occupation),
    companyName: values.employer || null,
    annualIncome: lookups.resolveIncomeId(values.annualIncome),
  });
}

// ---------- Step 4 — Family details ----------
export async function updateFamilyRequest(memberId: number, values: RegistrationFormValues) {
  await api.put(`/api/members/${memberId}/family`, {
    familyType: values.familyType || null,
    familyValue: values.familyValues || null,
    fatherOccupation: values.fatherOccupation || null,
    motherOccupation: values.motherOccupation || null,
    siblings: values.siblings || null,
    aboutFamily: values.aboutFamily || null,
  });
}

// ---------- Step 6 — About member ----------
export async function updateAboutRequest(memberId: number, values: RegistrationFormValues) {
  await api.put(`/api/members/${memberId}/about`, { aboutMe: values.aboutMe });
}

// ---------- Step 7 — Partner preferences ----------
export async function updatePartnerPreferenceRequest(
  memberId: number,
  values: RegistrationFormValues,
  lookups: RegistrationLookups,
) {
  await api.put(`/api/members/${memberId}/partner-preference`, {
    ageFrom: values.partnerAgeMin || null,
    ageTo: values.partnerAgeMax || null,
    heightFrom: values.partnerHeightMin || null,
    religion: values.partnerReligion ? lookups.resolveReligionId(values.partnerReligion) : null,
    caste: values.partnerCaste ? lookups.resolveCasteId(values.partnerCaste, values.partnerReligion) : null,
    education: values.partnerEducation ? lookups.resolveEducationId(values.partnerEducation) : null,
    country: null,
    aboutPartner: values.partnerAbout || null,
  });
}

// ---------- Optional-step skip ----------
export async function skipStepRequest(memberId: number, step: number) {
  await api.post(`/api/members/${memberId}/skip`, { step });
}

// ---------- Step 8 — Photos ----------
interface UploadPhotoResult {
  photoId: number;
  photoUrl: string;
}

export async function uploadProfilePhotoRequest(memberId: number, file: File): Promise<UploadPhotoResult> {
  const form = new FormData();
  form.append("file", file);
  return api.post<UploadPhotoResult>(`/api/members/${memberId}/photos/profile`, form, { isFormData: true });
}

export async function uploadGalleryPhotoRequest(memberId: number, file: File): Promise<UploadPhotoResult> {
  const form = new FormData();
  form.append("file", file);
  return api.post<UploadPhotoResult>(`/api/members/${memberId}/photos/gallery`, form, { isFormData: true });
}

// ---------- Step 9 — Identity document ----------
export async function uploadDocumentRequest(memberId: number, idType: string, file: File) {
  const form = new FormData();
  form.append("documentType", DOCUMENT_TYPE_MAP[idType] ?? "Other");
  form.append("file", file);
  return api.post(`/api/members/${memberId}/documents`, form, { isFormData: true });
}

// ---------- Step 10 — Final submit ----------
export interface SubmitResult {
  memberId: number;
  status: "READY_FOR_VERIFICATION" | "COMPLETED";
  completionPercentage: number;
}

export async function submitMemberRequest(memberId: number): Promise<SubmitResult> {
  return api.post<SubmitResult>(`/api/members/${memberId}/submit`);
}
