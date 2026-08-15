"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { FormProvider } from "react-hook-form";
import { registrationSteps } from "@/data/registration/types";
import { useRegistrationForm } from "@/features/registration-wizard/hooks/use-registration-form";
import { useRegistrationLookups } from "@/features/registration-wizard/use-registration-lookups";
import {
  updatePersonalDetailsRequest,
  updateLocationRequest,
  updateEducationRequest,
  updateFamilyRequest,
  updateAboutRequest,
  updatePartnerPreferenceRequest,
} from "@/features/registration-wizard/api";
import { api, ApiError } from "@/lib/api";
import { StepperSidebar } from "@/components/layout/registration-stepper-sidebar";
import { MobileStepHeader } from "@/components/layout/registration-mobile-header";
import { Button } from "@/components/ui/button";
import type { MemberProfileResponse } from "@/types/member-profile";
import type { RegistrationFormValues } from "@/features/registration-wizard/schema";

import { PersonalStep } from "@/features/registration-wizard/components/personal";
import { EducationStep } from "@/features/registration-wizard/components/education";
import { FamilyStep } from "@/features/registration-wizard/components/family";
import { HoroscopeStep } from "@/features/registration-wizard/components/horoscope";
import { AboutStep } from "@/features/registration-wizard/components/about";
import { PreferencesStep } from "@/features/registration-wizard/components/preferences";
import { PhotosStep } from "@/features/registration-wizard/components/photos";
import { VerificationStep } from "@/features/registration-wizard/components/verification";
import { ReviewStep } from "@/features/registration-wizard/components/review";

// The 9 sections this wizard variant covers — Account Info and the OTP gate
// are registration-only, so editing starts straight at Personal Details.
const stepHeadings = [
  "Tell us about yourself",
  "Your education & career",
  "Tell us about your family",
  "Horoscope details",
  "About you",
  "Who are you looking for?",
  "Add your photos",
  "Verify your identity",
  "Review your profile",
];
const stepSubheadings = [
  "Update the basics of your profile. Fields marked * are required.",
  "Helps us find matches with compatible career goals.",
  "Family plays a big role in Kerala matchmaking traditions.",
  "Optional, but most members prefer horoscope-matched profiles.",
  "Optional, but it's what other members actually read when evaluating a match.",
  "Refine who you're hoping to match with.",
  "Profiles with real photos get 3x more interests.",
  "A quick check keeps every profile on Parinayam genuine.",
  "One final look before saving your changes.",
];

function mapProfileToFormValues(data: MemberProfileResponse): Partial<RegistrationFormValues> {
  const { member, horoscope, partnerPreference } = data;
  return {
    firstName: member.first_name,
    lastName: member.last_name,
    gender: member.gender === "Female" ? "female" : "male",
    religion: member.religion_name ?? "",
    maritalStatus: member.marital_status ?? "",

    height: member.height ?? "",
    weight: member.weight ?? "",
    bodyType: member.body_type ?? "",
    complexion: member.complexion ?? "",
    physicalStatus: member.physical_status ?? "",
    bloodGroup: member.blood_group ?? "",
    motherTongue: member.mtongue_name ?? "",
    caste: member.caste_name ?? "",
    subCaste: member.sub_caste_name ?? "",
    willingToMarryOtherCaste: member.other_caste_allowed ?? false,
    diet: member.diet ?? "",
    smokingHabits: member.smoking_habits ?? "",
    drinkingHabits: member.drinking_habits ?? "",
    country: member.country_name ?? "",
    state: member.state_name ?? "",
    district: member.district_name ?? "",

    highestEducation: member.highest_education_name ?? "",
    fieldOfStudy: member.field_of_study ?? "",
    occupation: member.occupation_name ?? "",
    employer: member.company_name ?? "",
    annualIncome: member.annual_income_label ?? "",

    familyType: member.family_type ?? "",
    familyValues: member.family_value ?? "",
    fatherOccupation: member.father_occupation ?? "",
    motherOccupation: member.mother_occupation ?? "",
    siblings: member.siblings ?? "",
    aboutFamily: member.about_family ?? "",

    birthTime: horoscope?.birth_time ?? "",
    birthPlace: horoscope?.birth_place ?? "",
    star: horoscope?.star_name ?? "",
    dosham: horoscope?.dosh_name ?? "",
    horoscopeNote: horoscope?.horoscope_note ?? "",

    aboutMe: member.about_me ?? "",

    partnerAgeMin: partnerPreference?.age_from ?? 27,
    partnerAgeMax: partnerPreference?.age_to ?? 34,
    partnerHeightMin: partnerPreference?.height_from ?? "",
    partnerReligion: partnerPreference?.religion_name ?? "",
    partnerCaste: partnerPreference?.caste_name ?? "",
    partnerEducation: partnerPreference?.education_name ?? "",
    partnerAbout: partnerPreference?.about_partner ?? "",

    photoCount: data.photos.length,
    idDocumentUploaded: !!data.document,
  };
}

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof ApiError ? error.message : fallback;
}

// Mirrors stepHeadings above — lets links like /profile/edit?step=photos
// jump straight to a section instead of always starting at step 0.
const editStepKeys = [
  "personal",
  "education",
  "family",
  "horoscope",
  "about",
  "preferences",
  "photos",
  "verification",
  "review",
] as const;

export default function ProfileEditPage() {
  const router = useRouter();
  const { form, step, setStep, lastStep, goNext, goBack } = useRegistrationForm();
  const lookups = useRegistrationLookups();
  const [memberId, setMemberId] = useState<number | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  // True when we arrived via a single-section "Edit" link from My Profile
  // (e.g. /profile/edit?step=education) rather than the full wizard — in
  // that case Save should return to My Profile instead of advancing steps.
  const [isSingleSectionEdit, setIsSingleSectionEdit] = useState(false);

  useEffect(() => {
    const requestedStep = new URLSearchParams(window.location.search).get("step");
    const index = editStepKeys.indexOf(requestedStep as (typeof editStepKeys)[number]);
    if (index !== -1) {
      setStep(index);
      setIsSingleSectionEdit(true);
    }
    // Only read the deep link once, on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await api.get<MemberProfileResponse>("/api/members/me");
        if (cancelled) return;
        setMemberId(data.member.id);
        form.reset(mapProfileToFormValues(data), { keepDefaultValues: true });
      } catch (error) {
        if (!cancelled) setLoadError(errorMessage(error, "Could not load your profile."));
      } finally {
        if (!cancelled) setIsLoadingProfile(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const percent = Math.round(((step + 1) / stepHeadings.length) * 100);

  // Photos (5) & Verification (6) upload as the member picks files — nothing
  // left to save on Continue for those. Review (7) has no fields of its own.
  async function saveCurrentStep() {
    if (memberId == null) return;
    const values = form.getValues();

    switch (step) {
      case 0:
        await updatePersonalDetailsRequest(memberId, values, lookups);
        await updateLocationRequest(memberId, values, lookups);
        break;
      case 1:
        await updateEducationRequest(memberId, values, lookups);
        break;
      case 2:
        await updateFamilyRequest(memberId, values);
        break;
      case 3:
        await updatePersonalDetailsRequest(memberId, values, lookups);
        break;
      case 4:
        await updateAboutRequest(memberId, values);
        break;
      case 5:
        await updatePartnerPreferenceRequest(memberId, values, lookups);
        break;
      default:
        break;
    }
  }

  async function handleNext() {
    if (memberId == null) {
      setApiError("Something went wrong — please reload the page.");
      return;
    }

    if (lastStep) {
      router.push("/profile/me");
      return;
    }

    const fields = registrationFieldsForStep(step);
    const valid = fields.length === 0 ? true : await form.trigger(fields);
    if (!valid) return;

    setApiError(null);
    setIsSaving(true);
    try {
      await saveCurrentStep();
      if (isSingleSectionEdit) {
        router.push("/profile/me");
        return;
      }
      const advanced = await goNext();
      if (advanced) window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setApiError(errorMessage(error, "Something went wrong while saving. Please try again."));
    } finally {
      setIsSaving(false);
    }
  }

  function handleBack() {
    goBack();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function saveAndExit() {
    router.push("/profile/me");
  }

  if (isLoadingProfile || lookups.isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-24 text-sm text-faint">
        <Loader2 className="size-4 animate-spin" /> Loading your profile…
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex flex-col items-center gap-3 py-24 text-center">
        <p className="text-sm font-semibold text-destructive">{loadError}</p>
        <Button size="sm" onClick={() => window.location.reload()}>
          Try again
        </Button>
      </div>
    );
  }

  return (
    <FormProvider {...form}>
      <div className="lg:grid lg:min-h-screen lg:grid-cols-[380px_1fr]">
        {/* Both sidebars render the full 10-step registration list (incl.
            Account Info, not part of this edit-only wizard), so indices are
            shifted by 1 to line up — see registrationFieldsForStep's comment. */}
        <StepperSidebar activeIndex={step + 1} onStepClick={(i) => i > 0 && setStep(i - 1)} onExit={saveAndExit} />

        <div className="flex flex-1 flex-col">
          <MobileStepHeader
            activeIndex={step + 1}
            onStepClick={(i) => i > 0 && setStep(i - 1)}
            onExit={saveAndExit}
          />

          <main className="flex-1 px-5 py-6 pb-28 lg:max-w-215 lg:px-18 lg:py-11 lg:pb-14">
            <div className="mb-2.5 hidden items-center justify-between lg:flex">
              <span className="text-[13px] font-bold tracking-wide text-faint uppercase">
                Step {step + 1} of {stepHeadings.length} · {registrationSteps[step + 1]?.title}
              </span>
              <span className="text-[13px] font-bold text-success">{percent}% complete</span>
            </div>
            <div className="mb-9 hidden h-2 overflow-hidden rounded-full bg-[#EDEFF3] lg:block">
              <div
                className="bg-progress-success-gradient h-full transition-[width] duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>

            <h1 className="mb-2 text-2xl font-extrabold tracking-[-0.02em] text-primary-deep lg:text-[32px]">
              {stepHeadings[step]}
            </h1>
            <p className="mb-6 text-[15px] text-muted-foreground lg:mb-9">{stepSubheadings[step]}</p>

            {apiError && (
              <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive">
                {apiError}
              </div>
            )}

            <div className="rounded-2xl border border-card-border bg-card p-5 shadow-[0_8px_30px_rgba(127,29,29,0.05)] lg:rounded-[20px] lg:p-10">
              {step === 0 && <PersonalStep lookups={lookups} />}
              {step === 1 && <EducationStep lookups={lookups} />}
              {step === 2 && <FamilyStep />}
              {step === 3 && <HoroscopeStep lookups={lookups} />}
              {step === 4 && <AboutStep />}
              {step === 5 && <PreferencesStep lookups={lookups} />}
              {step === 6 && <PhotosStep memberId={memberId} />}
              {step === 7 && <VerificationStep memberId={memberId} />}
              {step === 8 && <ReviewStep onEditStep={setStep} />}
            </div>

            {/* desktop nav */}
            <div className="mt-7 hidden items-center justify-between lg:flex">
              <button type="button" onClick={saveAndExit} className="text-[15px] font-bold text-faint">
                Save &amp; exit
              </button>
              <div className="flex gap-3">
                {step > 0 && (
                  <Button variant="outline" size="cta" onClick={handleBack} disabled={isSaving}>
                    ← Back
                  </Button>
                )}
                <Button size="cta" onClick={handleNext} disabled={isSaving}>
                  {lastStep || isSingleSectionEdit ? "Save" : "Save & Continue"}
                </Button>
              </div>
            </div>
          </main>

          {/* mobile sticky nav */}
          <div className="fixed inset-x-0 bottom-0 z-20 flex gap-2.5 border-t border-card-border bg-card/95 px-5 py-3.5 pb-5 backdrop-blur-md lg:hidden">
            {step > 0 && (
              <Button variant="outline" size="cta" onClick={handleBack} disabled={isSaving}>
                Back
              </Button>
            )}
            <Button size="cta" className="flex-1" onClick={handleNext} disabled={isSaving}>
              {lastStep || isSingleSectionEdit ? "Save" : "Save & Continue"}
            </Button>
          </div>
        </div>
      </div>
    </FormProvider>
  );
}

// Subset of registrationFieldsByStep that applies here — Account Info (step
// 0 there) doesn't exist in this wizard, so everything shifts down by one.
function registrationFieldsForStep(step: number): (keyof RegistrationFormValues)[] {
  const map: (keyof RegistrationFormValues)[][] = [
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
  return map[step] ?? [];
}
