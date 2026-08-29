"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FormProvider } from "react-hook-form";
import { registrationSteps } from "@/data/registration/types";
import { useRegistrationForm } from "@/features/registration-wizard/hooks/use-registration-form";
import { useRegistrationLookups } from "@/features/registration-wizard/use-registration-lookups";
import {
  updateAccountInfoRequest,
  updatePersonalDetailsRequest,
  updateLocationRequest,
  updateEducationRequest,
  updateFamilyRequest,
  updateAboutRequest,
  updatePartnerPreferenceRequest,
  idTypeFromDocumentType,
} from "@/features/registration-wizard/api";
import { api, ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";
import { StepperSidebar } from "@/components/layout/registration-stepper-sidebar";
import { MobileStepHeader } from "@/components/layout/registration-mobile-header";
import { RegistrationAdPanel } from "@/components/layout/registration-ad-panel";
import { useAdvertisements } from "@/hooks/use-advertisements";
import { Button } from "@/components/ui/button";
import { FormSkeleton } from "@/components/shared/loading-skeletons";
import type { MemberProfileResponse } from "@/types/member-profile";
import type { RegistrationFormValues } from "@/features/registration-wizard/schema";

import { AccountInfoStep } from "@/features/registration-wizard/components/account-info";
import { PersonalStep } from "@/features/registration-wizard/components/personal";
import { EducationStep } from "@/features/registration-wizard/components/education";
import { FamilyStep } from "@/features/registration-wizard/components/family";
import { HoroscopeStep } from "@/features/registration-wizard/components/horoscope";
import { AboutStep } from "@/features/registration-wizard/components/about";
import { PreferencesStep } from "@/features/registration-wizard/components/preferences";
import { PhotosStep } from "@/features/registration-wizard/components/photos";
import { VerificationStep } from "@/features/registration-wizard/components/verification";
import { ReviewStep } from "@/features/registration-wizard/components/review";

// The OTP gate is registration-only, but Account Info itself (name, DOB,
// gender, religion, marital status) is editable here too — mobile/email/
// password are left out of this step (see AccountInfoStep's
// hideContactAndLogin), those go through Settings → Security instead.
const stepHeadings = [
  "Account info",
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
  "Update your name, date of birth, gender, religion, and marital status.",
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

const DOB_MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function parseDob(dob: string): { dobDay: string; dobMonth: string; dobYear: string } {
  const date = new Date(dob.includes("T") ? dob : `${dob}T00:00:00`);
  return {
    dobDay: String(date.getDate()),
    dobMonth: DOB_MONTH_NAMES[date.getMonth()],
    dobYear: String(date.getFullYear()),
  };
}

function mapProfileToFormValues(data: MemberProfileResponse): Partial<RegistrationFormValues> {
  const { member, horoscope, partnerPreference } = data;
  const { dobDay, dobMonth, dobYear } = parseDob(member.dob);
  return {
    profileCreatedBy: member.profile_created_by,
    firstName: member.first_name,
    lastName: member.last_name,
    gender: member.gender === "Female" ? "female" : "male",
    dobDay,
    dobMonth,
    dobYear,
    mobileCountryCode: member.mobile_country_code,
    mobileNumber: member.mobile,
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
    idType: idTypeFromDocumentType(data.document?.document_type),
  };
}

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof ApiError ? error.message : fallback;
}

// Mirrors stepHeadings above — lets links like /profile/edit?step=photos
// jump straight to a section instead of always starting at step 0.
const editStepKeys = [
  "account",
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

const REVIEW_STEP_INDEX = stepHeadings.length - 1;

export default function ProfileEditPage() {
  const router = useRouter();
  // Not lastStep/goNext from the hook — those were indexed against the
  // 10-step register wizard's own field arrays, and calling goNext() here
  // re-triggered its (differently-scoped) validation, silently doing
  // nothing on "Save & Continue" once a member walked past step 1.
  const { form, step, setStep, goBack } = useRegistrationForm();
  const isLastStep = step === REVIEW_STEP_INDEX;
  const lookups = useRegistrationLookups();
  const { data: ads } = useAdvertisements();
  const ad = ads?.[0];
  const [memberId, setMemberId] = useState<number | null>(null);
  const [accountStatus, setAccountStatus] = useState<
    "ACTIVE" | "INACTIVE" | "BLOCKED" | "PENDING_APPROVAL"
  >("ACTIVE");
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  // Editing an already-complete profile uses the Review "hub" — pick a
  // section, save, land back on Review to pick another, mirroring admin's
  // Edit Member flow. The "resume" case (redirected here for having an
  // incomplete required profile) is the one exception — that needs the
  // normal linear Save & Continue through every remaining step instead,
  // since there's no finished profile yet to revisit section by section.
  const [isResume, setIsResume] = useState(false);
  const hubMode = !isResume;
  const [realCompletion, setRealCompletion] = useState<number | null>(null);
  // Resume-only: the furthest step reached so far, so the sidebar/mobile
  // stepper can't be clicked ahead of it — same "must Save & Continue, no
  // jumping" rule as the initial registration wizard. Doesn't apply in hub
  // mode, where every section is already filled in and free to revisit.
  const [maxStepReached, setMaxStepReached] = useState(0);

  async function refreshCompletion(id: number) {
    try {
      const data = await api.get<{ profile_completion: number }>(`/api/members/${id}/completion`);
      setRealCompletion(data.profile_completion);
    } catch {
      // Non-fatal — the step-index estimate stays as a fallback.
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedStep = params.get("step");
    const resume = params.get("resume") === "1";
    setIsResume(resume);

    const index = editStepKeys.indexOf(requestedStep as (typeof editStepKeys)[number]);
    if (index !== -1) {
      setStep(index);
      // The backend sent us to whichever section is first-incomplete —
      // that's already the legitimate frontier, so seed it here.
      if (resume) setMaxStepReached(index);
    } else if (!resume) {
      // Plain "Edit Profile" click, no section requested — land on the
      // Review hub so the member picks which section to revisit.
      setStep(REVIEW_STEP_INDEX);
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
        setAccountStatus(data.member.account_status);
        form.reset(mapProfileToFormValues(data), { keepDefaultValues: true });
        void refreshCompletion(data.member.id);
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

  const stepEstimate = Math.round((step / stepHeadings.length) * 100);
  const percent = realCompletion ?? stepEstimate;

  // Photos (6) & Verification (7) upload as the member picks files — nothing
  // left to save on Continue for those. Review (8) has no fields of its own.
  async function saveCurrentStep() {
    if (memberId == null) return;
    const values = form.getValues();

    switch (step) {
      case 0:
        await updateAccountInfoRequest(memberId, values, lookups, accountStatus);
        break;
      case 1:
        await updatePersonalDetailsRequest(memberId, values, lookups);
        await updateLocationRequest(memberId, values, lookups);
        break;
      case 2:
        await updateEducationRequest(memberId, values, lookups);
        break;
      case 3:
        await updateFamilyRequest(memberId, values);
        break;
      case 4:
        await updatePersonalDetailsRequest(memberId, values, lookups);
        break;
      case 5:
        await updateAboutRequest(memberId, values);
        break;
      case 6:
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

    if (isLastStep) {
      if (hubMode) {
        // Editing an already-complete profile — every section already saved
        // itself as it was visited, Review is just the hub, not a submit.
        router.push("/profile/me");
        return;
      }
      // Resume flow reaching Review — /dashboard, not /profile/me, so
      // RequireCompleteProfile (the (shell) gate) re-checks fresh and routes
      // on to /plans if a plan still hasn't been chosen, same as straight
      // after registration.
      router.push("/dashboard");
      return;
    }

    const fields = registrationFieldsForStep(step);
    const valid = fields.length === 0 ? true : await form.trigger(fields);
    if (!valid) return;

    setApiError(null);
    setIsSaving(true);
    try {
      await saveCurrentStep();
      await refreshCompletion(memberId);
      // In hub mode, every section is reached from — and saves back to —
      // the Review hub, rather than advancing linearly through the wizard.
      if (hubMode) {
        setStep(REVIEW_STEP_INDEX);
      } else {
        const next = Math.min(step + 1, stepHeadings.length - 1);
        setStep(next);
        setMaxStepReached((s) => Math.max(s, next));
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setApiError(errorMessage(error, "Something went wrong while saving. Please try again."));
    } finally {
      setIsSaving(false);
    }
  }

  // In hub mode every section is already filled in, so clicking any step is
  // fine. In the resume flow (profile still under 60%), the same "must Save
  // & Continue, no jumping ahead" rule as initial registration applies.
  function handleStepClick(index: number) {
    if (!hubMode && index > maxStepReached) return;
    setStep(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleBack() {
    // In hub mode, "Back" from any individual section returns to the
    // Review hub it was opened from, rather than the previous step in
    // sequence.
    if (hubMode) {
      setStep(REVIEW_STEP_INDEX);
    } else {
      goBack();
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveAndExit() {
    if (memberId == null) {
      router.push(hubMode ? "/profile/me" : "/");
      return;
    }
    setIsSaving(true);
    try {
      await saveCurrentStep();
    } catch {
      // Best-effort — still let them exit even if this save failed; their
      // progress up to the previous step is already persisted regardless.
    } finally {
      setIsSaving(false);
    }
    router.push(hubMode ? "/profile/me" : "/");
  }

  // In hub mode, Back only makes sense from within a section (it returns to
  // Review); the Review step itself has nothing to go "back" to.
  const showBackButton = hubMode ? !isLastStep : step > 0;
  const nextButtonLabel = isLastStep
    ? hubMode
      ? "Done"
      : "Continue"
    : hubMode
      ? "Save & Back to Review"
      : "Save & Continue";

  if (isLoadingProfile || lookups.isLoading) {
    return (
      <div className="mx-auto max-w-215 px-5 py-8 lg:px-6">
        <FormSkeleton fields={6} />
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
      <div
        className={cn(
          "lg:grid lg:min-h-screen",
          !hubMode && ad ? "lg:grid-cols-[380px_1fr_360px]" : "lg:grid-cols-[380px_1fr]",
        )}
      >
        <StepperSidebar
          activeIndex={step}
          maxStepReached={hubMode ? undefined : maxStepReached}
          onStepClick={handleStepClick}
          onExit={saveAndExit}
        />

        <div className="flex flex-1 flex-col">
          <MobileStepHeader
            activeIndex={step}
            maxStepReached={hubMode ? undefined : maxStepReached}
            onStepClick={handleStepClick}
            onExit={saveAndExit}
            percent={percent}
          />

          <main className="flex-1 px-5 py-6 pb-28 lg:max-w-215 lg:px-18 lg:py-11 lg:pb-14">
            <div className="mb-2.5 hidden items-center justify-between lg:flex">
              <span className="text-[13px] font-bold tracking-wide text-faint uppercase">
                Step {step + 1} of {stepHeadings.length} · {registrationSteps[step]?.title}
              </span>
              <span className={cn("text-[13px] font-bold", percent >= 60 ? "text-success" : "text-gold-text")}>
                {percent}% complete
              </span>
            </div>
            <div className="relative mt-2 mb-11 hidden h-2.5 overflow-visible rounded-full bg-[#EDEFF3] lg:block">
              <div
                className={cn(
                  "h-full rounded-full transition-[width] duration-500",
                  percent >= 60 ? "bg-progress-success-gradient" : "bg-gold-gradient",
                )}
                style={{ width: `${percent}%` }}
              />
              <div className="absolute top-0 bottom-0 w-px bg-primary-deep/25" style={{ left: "60%" }} />
              <span
                className="absolute top-1/2 -translate-y-1/2 rounded-full bg-primary-deep px-2 py-0.5 text-[11px] font-extrabold text-white shadow-[0_4px_10px_rgba(127,29,29,0.25)] transition-[left] duration-500"
                style={{ left: `${percent}%`, transform: `translate(${percent > 92 ? "-100%" : "-50%"}, calc(-50% + 18px))` }}
              >
                {percent}%
              </span>
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
              {step === 0 && <AccountInfoStep lookups={lookups} hideContactAndLogin />}
              {step === 1 && <PersonalStep lookups={lookups} />}
              {step === 2 && <EducationStep lookups={lookups} />}
              {step === 3 && <FamilyStep />}
              {step === 4 && <HoroscopeStep lookups={lookups} />}
              {step === 5 && <AboutStep />}
              {step === 6 && <PreferencesStep lookups={lookups} />}
              {step === 7 && <PhotosStep memberId={memberId} />}
              {step === 8 && <VerificationStep memberId={memberId} />}
              {step === 9 && <ReviewStep onEditStep={handleStepClick} memberId={memberId} />}
            </div>

            {isLastStep && !hubMode && percent < 60 && (
              <div className="mt-7 rounded-xl border border-gold/30 bg-peach-bg px-4 py-3 text-[13px] font-semibold text-primary-deep">
                To enter the dashboard, your profile progress needs to be 60% or above.
              </div>
            )}

            {/* desktop nav */}
            <div className="mt-7 hidden items-center justify-end lg:flex">
              <div className="flex gap-3">
                {showBackButton && (
                  <Button variant="outline" size="cta" onClick={handleBack} disabled={isSaving}>
                    ← {hubMode ? "Back to Review" : "Back"}
                  </Button>
                )}
                <Button size="cta" onClick={handleNext} disabled={isSaving}>
                  {nextButtonLabel}
                </Button>
              </div>
            </div>
          </main>

          {/* mobile sticky nav */}
          <div className="fixed inset-x-0 bottom-0 z-20 flex gap-2.5 border-t border-card-border bg-card/95 px-5 py-3.5 pb-5 backdrop-blur-md lg:hidden">
            {showBackButton && (
              <Button variant="outline" size="cta" onClick={handleBack} disabled={isSaving}>
                {hubMode ? "Back to Review" : "Back"}
              </Button>
            )}
            <Button size="cta" className="flex-1" onClick={handleNext} disabled={isSaving}>
              {nextButtonLabel}
            </Button>
          </div>
        </div>

        {!hubMode && <RegistrationAdPanel ad={ad} />}
      </div>
    </FormProvider>
  );
}

// Subset of registrationFieldsByStep that applies here — mobileNumber/email/
// password/confirmPassword are left out of step 0 since AccountInfoStep
// hides that group in edit mode (see hideContactAndLogin).
function registrationFieldsForStep(step: number): (keyof RegistrationFormValues)[] {
  const map: (keyof RegistrationFormValues)[][] = [
    ["profileCreatedBy", "firstName", "lastName", "gender", "dobDay", "dobMonth", "dobYear", "religion", "maritalStatus"],
    [
      "height", "weight", "bodyType", "complexion", "physicalStatus", "bloodGroup",
      "motherTongue", "caste", "diet", "smokingHabits", "drinkingHabits",
      "country", "state", "district",
    ],
    ["highestEducation", "fieldOfStudy", "occupation", "employer", "annualIncome"],
    ["familyType", "familyValues", "fatherOccupation", "motherOccupation", "siblings"],
    ["birthTime", "birthPlace", "star", "dosham"],
    [],
    ["partnerHeightMin", "partnerReligion", "partnerCaste", "partnerEducation"],
    [],
    [],
    [],
  ];
  return map[step] ?? [];
}
