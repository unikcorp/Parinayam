// Mirrors the row shape returned by GET /api/members/me and /api/members/:id
// on the server (member.repository.ts getMemberById) — raw DB columns plus
// the display-name joins (religion_name, caste_name, ...).
export interface MemberProfileRow {
  id: number;
  user_id: number;
  member_code: string;
  profile_created_by: string;
  first_name: string;
  last_name: string;
  dob: string;
  gender: "Male" | "Female";
  mobile: string;
  mobile_country_code: string;
  marital_status: string | null;
  mother_tongue_id: number | null;
  religion_id: number | null;
  caste_id: number | null;
  sub_caste_id: number | null;
  other_caste_allowed: boolean | null;
  highest_education_id: number | null;
  field_of_study: string | null;
  occupation_id: number | null;
  company_name: string | null;
  annual_income_id: number | null;
  family_type: string | null;
  family_value: string | null;
  father_occupation: string | null;
  mother_occupation: string | null;
  siblings: string | null;
  about_family: string | null;
  country_id: number | null;
  state_id: number | null;
  district_id: number | null;
  height: string | null;
  weight: string | null;
  body_type: string | null;
  complexion: string | null;
  physical_status: string | null;
  blood_group: string | null;
  diet: string | null;
  smoking_habits: string | null;
  drinking_habits: string | null;
  about_me: string | null;
  profile_completion: number;
  profile_status: "DRAFT" | "READY_FOR_VERIFICATION" | "COMPLETED";
  account_status: "ACTIVE" | "INACTIVE" | "BLOCKED" | "PENDING_APPROVAL";
  show_in_search: boolean;
  show_online_status: boolean;
  current_step: number;
  email: string;
  religion_name: string | null;
  caste_name: string | null;
  sub_caste_name: string | null;
  mtongue_name: string | null;
  country_name: string | null;
  state_name: string | null;
  district_name: string | null;
  highest_education_name: string | null;
  occupation_name: string | null;
  annual_income_label: string | null;
}

export interface MemberProfilePhoto {
  id: number;
  photo_url: string;
  is_profile_photo: boolean;
  sort_order: number;
  approval_status: "PENDING" | "APPROVED" | "REJECTED";
}

export interface MemberProfileDocument {
  document_type: string;
  document_number: string | null;
  file_url: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

export interface MemberProfileHoroscope {
  star_id: number | null;
  dosh_id: number | null;
  star_name: string | null;
  dosh_name: string | null;
  birth_time: string | null;
  birth_place: string | null;
  horoscope_note: string | null;
}

export interface MemberPartnerPreference {
  age_from: number | null;
  age_to: number | null;
  height_from: string | null;
  religion_id: number | null;
  caste_id: number | null;
  education_id: number | null;
  country_id: number | null;
  about_partner: string | null;
  religion_name: string | null;
  caste_name: string | null;
  education_name: string | null;
}

export interface MemberProfileResponse {
  member: MemberProfileRow;
  horoscope: MemberProfileHoroscope | null;
  partnerPreference: MemberPartnerPreference | null;
  photos: MemberProfilePhoto[];
  document: MemberProfileDocument | null;
  lastLoginAt: string | null;
  profileCompletion: number;
}

// GET /api/members/:id/profile — the privacy-safe subset of MemberProfileRow
// returned when browsing another member (no email/mobile, no raw document
// contents). See member.service.ts getPublicProfile for the allowlist.
export interface PublicMemberProfileRow {
  id: number;
  member_code: string;
  profile_created_by: string;
  first_name: string;
  last_name: string;
  dob: string;
  gender: "Male" | "Female";
  marital_status: string | null;
  other_caste_allowed: boolean | null;
  field_of_study: string | null;
  company_name: string | null;
  family_type: string | null;
  family_value: string | null;
  father_occupation: string | null;
  mother_occupation: string | null;
  siblings: string | null;
  about_family: string | null;
  height: string | null;
  weight: string | null;
  body_type: string | null;
  complexion: string | null;
  physical_status: string | null;
  blood_group: string | null;
  diet: string | null;
  smoking_habits: string | null;
  drinking_habits: string | null;
  about_me: string | null;
  religion_name: string | null;
  caste_name: string | null;
  sub_caste_name: string | null;
  mtongue_name: string | null;
  country_name: string | null;
  state_name: string | null;
  district_name: string | null;
  highest_education_name: string | null;
  occupation_name: string | null;
  annual_income_label: string | null;
}

export interface PublicMemberProfileResponse {
  member: PublicMemberProfileRow;
  horoscope: MemberProfileHoroscope | null;
  partnerPreference: MemberPartnerPreference | null;
  photos: MemberProfilePhoto[];
  verified: boolean;
  lastLoginAt: string | null;
}

export function calculateAge(dob: string): number {
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age -= 1;
  }
  return age;
}
