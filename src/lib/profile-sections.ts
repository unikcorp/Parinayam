import type { DetailSectionData } from "@/components/profile/detail-section";
import type { MemberPartnerPreference, MemberProfileHoroscope, MemberProfileRow } from "@/types/member-profile";

const fallback = (v: string | number | null | undefined) =>
  v === null || v === undefined || v === "" ? "Not added yet" : String(v);

// About Me / Partner Expectation free text goes through admin moderation —
// a viewer who isn't the owner never sees unapproved text at all (the
// server nulls it out before it reaches the client, same as an unapproved
// photo), so this only ever has something to say on the owner's own page.
function moderatedText(
  text: string | null | undefined,
  status: "PENDING" | "APPROVED" | "REJECTED" | undefined,
  rejectionReason: string | null | undefined,
): string {
  if (!text) return "Not added yet";
  if (status === "REJECTED") {
    return rejectionReason ? `Rejected by admin: ${rejectionReason} — please edit and resubmit.` : "Rejected by admin — please edit and resubmit.";
  }
  if (status !== "APPROVED") return "Waiting for admin approval.";
  return text;
}

// Only the columns actually rendered below — satisfied structurally by both
// the full MemberProfileRow (/profile/me) and the trimmed, privacy-safe
// PublicMemberProfileRow (/profile/[id]), so this one helper serves both
// without either view drifting out of sync on the mapping.
type ProfileSectionMember = Pick<
  MemberProfileRow,
  | "height"
  | "weight"
  | "body_type"
  | "complexion"
  | "physical_status"
  | "blood_group"
  | "mtongue_name"
  | "marital_status"
  | "religion_name"
  | "caste_name"
  | "sub_caste_name"
  | "other_caste_allowed"
  | "highest_education_name"
  | "field_of_study"
  | "occupation_name"
  | "company_name"
  | "annual_income_label"
  | "family_type"
  | "family_value"
  | "father_occupation"
  | "mother_occupation"
  | "siblings"
  | "diet"
  | "smoking_habits"
  | "drinking_habits"
>;

// Shared between /profile/me (editable) and /profile/[id] (read-only) so the
// two views never drift out of sync on which real columns map to which rows.
export function buildProfileSections({
  member,
  horoscope,
  partnerPreference,
  editable,
}: {
  member: ProfileSectionMember;
  horoscope: MemberProfileHoroscope | null;
  partnerPreference: MemberPartnerPreference | null;
  editable: boolean;
}): DetailSectionData[] {
  const editHref = (step: string) => (editable ? `/profile/edit?step=${step}` : undefined);

  return [
    {
      key: "personal",
      icon: "lifestyle",
      title: "Personal details",
      editHref: editHref("personal"),
      rows: [
        ["Height", fallback(member.height)],
        ["Weight", fallback(member.weight)],
        ["Body type", fallback(member.body_type)],
        ["Complexion", fallback(member.complexion)],
        ["Physical status", fallback(member.physical_status)],
        ["Blood group", fallback(member.blood_group)],
        ["Mother tongue", fallback(member.mtongue_name)],
        ["Marital status", fallback(member.marital_status)],
      ],
    },
    {
      key: "religion",
      icon: "religion",
      title: "Religion & community",
      editHref: editHref("personal"),
      rows: [
        ["Religion", fallback(member.religion_name)],
        ["Caste", fallback(member.caste_name)],
        ["Sub caste", fallback(member.sub_caste_name)],
        [
          "Willing to marry outside caste",
          member.other_caste_allowed == null ? "Not added yet" : member.other_caste_allowed ? "Yes" : "No",
        ],
      ],
    },
    {
      key: "education",
      icon: "education",
      title: "Education & career",
      editHref: editHref("education"),
      rows: [
        ["Highest education", fallback(member.highest_education_name)],
        ["Field of study", fallback(member.field_of_study)],
        ["Occupation", fallback(member.occupation_name)],
        ["Company", fallback(member.company_name)],
        ["Annual income", fallback(member.annual_income_label)],
      ],
    },
    {
      key: "family",
      icon: "family",
      title: "Family details",
      editHref: editHref("family"),
      rows: [
        ["Family type", fallback(member.family_type)],
        ["Family values", fallback(member.family_value)],
        ["Father's occupation", fallback(member.father_occupation)],
        ["Mother's occupation", fallback(member.mother_occupation)],
        ["Siblings", fallback(member.siblings)],
      ],
    },
    {
      key: "lifestyle",
      icon: "lifestyle",
      title: "Lifestyle",
      editHref: editHref("personal"),
      rows: [
        ["Diet", fallback(member.diet)],
        ["Smoking", fallback(member.smoking_habits)],
        ["Drinking", fallback(member.drinking_habits)],
      ],
    },
    {
      key: "horoscope",
      icon: "religion",
      title: "Horoscope",
      editHref: editHref("horoscope"),
      rows: [
        ["Star", fallback(horoscope?.star_name)],
        ["Dosham", fallback(horoscope?.dosh_name)],
        ["Birth time", fallback(horoscope?.birth_time)],
        ["Birth place", fallback(horoscope?.birth_place)],
      ],
    },
    {
      key: "preferences",
      icon: "family",
      title: "Partner preferences",
      editHref: editHref("preferences"),
      rows: [
        [
          "Age range",
          partnerPreference ? `${fallback(partnerPreference.age_from)} - ${fallback(partnerPreference.age_to)}` : "Not added yet",
        ],
        ["Min height", fallback(partnerPreference?.height_from)],
        [
          "About partner",
          moderatedText(
            partnerPreference?.about_partner,
            partnerPreference?.about_partner_status,
            partnerPreference?.about_partner_rejection_reason,
          ),
        ],
      ],
    },
  ];
}
