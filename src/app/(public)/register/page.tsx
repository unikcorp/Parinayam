"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormProvider } from "react-hook-form";
import { registrationSteps } from "@/data/registration/types";
import { registrationFieldsByStep } from "@/features/registration-wizard/schema";
import { useRegistrationForm } from "@/features/registration-wizard/hooks/use-registration-form";
import { useRegistrationLookups } from "@/features/registration-wizard/use-registration-lookups";
import { useFieldVisibility } from "@/hooks/use-field-visibility";
import {
  registerSelfRequest,
  updatePersonalDetailsRequest,
  updateLocationRequest,
  updateEducationRequest,
  updateFamilyRequest,
  updateAboutRequest,
  updatePartnerPreferenceRequest,
  skipStepRequest,
  submitMemberRequest,
} from "@/features/registration-wizard/api";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";
import { StepperSidebar } from "@/components/layout/registration-stepper-sidebar";
import { MobileStepHeader } from "@/components/layout/registration-mobile-header";
import { Button } from "@/components/ui/button";
import { FormSkeleton } from "@/components/shared/loading-skeletons";

import { AccountInfoStep } from "@/features/registration-wizard/components/account-info";
import { OtpGate } from "@/features/registration-wizard/components/otp-gate";
import { PersonalStep } from "@/features/registration-wizard/components/personal";
import { EducationStep } from "@/features/registration-wizard/components/education";
import { FamilyStep } from "@/features/registration-wizard/components/family";
import { HoroscopeStep } from "@/features/registration-wizard/components/horoscope";
import { AboutStep } from "@/features/registration-wizard/components/about";
import { PreferencesStep } from "@/features/registration-wizard/components/preferences";
import { PhotosStep } from "@/features/registration-wizard/components/photos";
import { VerificationStep } from "@/features/registration-wizard/components/verification";
import { ReviewStep } from "@/features/registration-wizard/components/review";

// The OTP screen isn't one of the 9 numbered steps — it's an interstitial
// that interrupts the wizard right after Account Info (step 0), before the
// rest of the profile can be filled in. Tracked separately from `step` so
// the stepper still reads "step 1 of 9" while it's showing.
const ACCOUNT_INFO_STEP = 0;

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof ApiError ? error.message : fallback;
}

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { form, step, setStep, lastStep, goNext, goBack } = useRegistrationForm();
  const lookups = useRegistrationLookups();
  const { isStepEnabled, disabledSteps } = useFieldVisibility();
  const isStepEnabledAt = (index: number) => isStepEnabled(registrationSteps[index].key);
  const [showOtp, setShowOtp] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  // The furthest step the member has actually reached via Next/Skip/OTP —
  // the stepper only lets them click back to an already-reached step, not
  // jump ahead past ones they haven't gotten to (which would bypass the
  // per-step validation/save that Next and Skip each do).
  const [maxStepReached, setMaxStepReached] = useState(0);
  const [memberId, setMemberId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [realCompletion, setRealCompletion] = useState<number | null>(null);

  // Real, field-based percentage from the backend (same calculation the
  // dashboard-entry gate uses) once the account exists — the step-index
  // estimate below only covers the brief window before Step 1 is saved.
  async function refreshCompletion(id: number) {
    try {
      const data = await api.get<{ profile_completion: number }>(`/api/members/${id}/completion`);
      setRealCompletion(data.profile_completion);
    } catch {
      // Non-fatal — the step-index estimate stays as a fallback.
    }
  }

  const stepEstimate = Math.round((step / registrationSteps.length) * 100);
  const percent = realCompletion ?? stepEstimate;

  // Step 1 doesn't just save — it's the moment the account itself gets
  // created, so it calls the real signup endpoint instead of a plain PUT.
  async function handleAccountInfoContinue() {
    const valid = await form.trigger(registrationFieldsByStep[ACCOUNT_INFO_STEP]);
    if (!valid) return;

    setApiError(null);
    setIsSaving(true);
    try {
      const values = form.getValues();
      const result = await registerSelfRequest(values, lookups);
      setMemberId(result.memberId);
      // registerSelfRequest already swaps the access token in, but the
      // session's user object (name shown in the header, etc.) only lives in
      // AuthContext — without this, it keeps showing whoever was logged in
      // here before (or "Guest"), correcting itself only on a full reload
      // that re-fetches /api/members/me from scratch.
      login(
        {
          id: String(result.memberId),
          name: `${values.firstName} ${values.lastName}`.trim(),
          email: values.email,
          avatarInitials: `${values.firstName[0] ?? ""}${values.lastName[0] ?? ""}`.toUpperCase(),
          premium: false,
          memberCode: null,
        },
        result.accessToken,
      );
      setShowOtp(true);
      await refreshCompletion(result.memberId);
    } catch (error) {
      setApiError(errorMessage(error, "Could not create your account. Please try again."));
    } finally {
      setIsSaving(false);
    }
  }

  function handleOtpVerified() {
    setOtpVerified(true);
    setShowOtp(false);
    let next = ACCOUNT_INFO_STEP + 1;
    while (!isStepEnabledAt(next) && next < registrationSteps.length - 1) next++;
    setStep(next);
    setMaxStepReached((s) => Math.max(s, next));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Saves whichever section the wizard is currently on, mirroring admin's
  // AddMembers.tsx: each step talks to its own endpoint. Personal Details
  // and Horoscope are two different client steps but both save through the
  // same server endpoint (Horoscope resends the personal fields alongside
  // the newly-filled horoscope ones — every field there is optional, so
  // this can't blank anything out). Photos & Verification upload as the
  // member picks files, so Continue has nothing left to save for them.
  async function saveCurrentStep() {
    if (memberId == null) return;
    const values = form.getValues();

    switch (step) {
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
    if (step === ACCOUNT_INFO_STEP && !otpVerified) {
      await handleAccountInfoContinue();
      return;
    }
    if (memberId == null) {
      setApiError("Something went wrong — please restart registration.");
      return;
    }

    if (lastStep) {
      setApiError(null);
      setIsSaving(true);
      try {
        await submitMemberRequest(memberId);
        router.push("/dashboard");
      } catch (error) {
        setApiError(errorMessage(error, "Could not submit your profile. Please try again."));
      } finally {
        setIsSaving(false);
      }
      return;
    }

    const fields = registrationFieldsByStep[step];
    const valid = fields.length === 0 ? true : await form.trigger(fields);
    if (!valid) return;

    setApiError(null);
    setIsSaving(true);
    try {
      await saveCurrentStep();
      await refreshCompletion(memberId);
      const advanced = await goNext(isStepEnabledAt);
      if (advanced) {
        let next = Math.min(step + 1, registrationSteps.length - 1);
        while (!isStepEnabledAt(next) && next < registrationSteps.length - 1) next++;
        setMaxStepReached((s) => Math.max(s, next));
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (error) {
      setApiError(errorMessage(error, "Something went wrong while saving. Please try again."));
    } finally {
      setIsSaving(false);
    }
  }

  function handleBack() {
    goBack(isStepEnabledAt);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleSkip() {
    // Best-effort progress bookkeeping only — nothing here can lose data,
    // since Skip never touches any of the actual profile fields.
    if (memberId != null) {
      skipStepRequest(memberId, Math.min(step + 1, 9)).catch(() => {});
    }
    let next = Math.min(step + 1, registrationSteps.length - 1);
    while (!isStepEnabledAt(next) && next < registrationSteps.length - 1) next++;
    setStep(next);
    setMaxStepReached((s) => Math.max(s, next));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Steps past Account Info are only reachable once the phone is verified —
  // otherwise clicking ahead in the stepper would let someone skip the OTP
  // gate entirely. Beyond that, clicking is only allowed to a step already
  // reached via Next/Skip — clicking ahead would skip that step's own
  // validation/save (or the OTP gate, for step 1) — and a step an admin has
  // turned off entirely is never a valid destination.
  function handleStepClick(index: number) {
    if (index > ACCOUNT_INFO_STEP && !otpVerified) return;
    if (index > maxStepReached) return;
    if (!isStepEnabledAt(index)) return;
    setShowOtp(false);
    setStep(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveAndExit() {
    // Nothing to save before an account even exists (Account Info hasn't
    // been submitted/OTP-verified yet) — just leave.
    if (memberId == null || step <= ACCOUNT_INFO_STEP) {
      router.push("/");
      return;
    }
    setIsSaving(true);
    try {
      await saveCurrentStep();
    } catch {
      // Best-effort — still let them exit even if this save failed; nothing
      // here is destructive, and their progress up to the previous step is
      // already persisted regardless.
    } finally {
      setIsSaving(false);
    }
    router.push("/");
  }

  // Only Account Info (step 0) and Review (the last step) are required to
  // move forward — every step in between can be skipped, same as admin's
  // Add Member wizard.
  const isSkippableStep = step > ACCOUNT_INFO_STEP && !lastStep;

  return (
    <FormProvider {...form}>
      <div className="lg:grid lg:min-h-screen lg:grid-cols-[380px_1fr]">
        <StepperSidebar
          activeIndex={step}
          maxStepReached={maxStepReached}
          disabledSteps={disabledSteps}
          onStepClick={otpVerified ? handleStepClick : undefined}
          onExit={saveAndExit}
        />

        <div className="flex flex-1 flex-col">
          <MobileStepHeader
            activeIndex={step}
            maxStepReached={maxStepReached}
            disabledSteps={disabledSteps}
            onStepClick={otpVerified ? handleStepClick : () => {}}
            onExit={saveAndExit}
            percent={percent}
          />

          <main className="flex-1 px-5 py-6 pb-28 lg:max-w-215 lg:px-18 lg:py-11 lg:pb-14">
            {/* desktop progress header */}
            <div className="mb-2.5 hidden items-center justify-between lg:flex">
              <span className="text-[13px] font-bold tracking-wide text-faint uppercase">
                Step {step + 1} of {registrationSteps.length} ·{" "}
                {showOtp ? "Verify mobile" : registrationSteps[step].title}
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
              {/* 60% dashboard-entry threshold marker */}
              <div className="absolute top-0 bottom-0 w-px bg-primary-deep/25" style={{ left: "60%" }} />
              <span
                className="absolute top-1/2 -translate-y-1/2 rounded-full bg-primary-deep px-2 py-0.5 text-[11px] font-extrabold text-white shadow-[0_4px_10px_rgba(127,29,29,0.25)] transition-[left] duration-500"
                style={{ left: `${percent}%`, transform: `translate(${percent > 92 ? "-100%" : "-50%"}, calc(-50% + 18px))` }}
              >
                {percent}%
              </span>
            </div>

            <h1 className="mb-2 text-2xl font-extrabold tracking-[-0.02em] text-primary-deep lg:text-[32px]">
              {showOtp ? "Verify your mobile number" : stepHeading(step)}
            </h1>
            <p className="mb-6 text-[15px] text-muted-foreground lg:mb-9">
              {showOtp ? "We've sent a code to confirm it's really you." : stepSubheading(step)}
            </p>

            {apiError && (
              <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive">
                {apiError}
              </div>
            )}

            <div className="rounded-2xl border border-card-border bg-card p-5 shadow-[0_8px_30px_rgba(127,29,29,0.05)] lg:rounded-[20px] lg:p-10">
              {showOtp ? (
                <OtpGate
                  mobile={`${form.getValues("mobileCountryCode")} ${form.getValues("mobileNumber")}`}
                  onVerified={handleOtpVerified}
                  onChangeNumber={() => setShowOtp(false)}
                />
              ) : lookups.isLoading ? (
                // Steps below read from `lookups` the instant they mount — a
                // dropdown handed an already-selected value before its own
                // option list has arrived can end up stuck, so nothing here
                // renders until the real religion/caste/country/... lists
                // are actually in.
                <FormSkeleton fields={5} className="py-4" />
              ) : (
                <>
                  {step === 0 && <AccountInfoStep lookups={lookups} />}
                  {step === 1 && <PersonalStep lookups={lookups} />}
                  {step === 2 && <EducationStep lookups={lookups} />}
                  {step === 3 && <FamilyStep />}
                  {step === 4 && <HoroscopeStep lookups={lookups} />}
                  {step === 5 && <AboutStep />}
                  {step === 6 && <PreferencesStep lookups={lookups} />}
                  {step === 7 && <PhotosStep memberId={memberId} />}
                  {step === 8 && <VerificationStep memberId={memberId} />}
                  {step === 9 && <ReviewStep onEditStep={handleStepClick} memberId={memberId} />}
                </>
              )}
            </div>

            {!showOtp && (
              <>
                {lastStep && percent < 60 && (
                  <div className="mt-7 rounded-xl border border-gold/30 bg-peach-bg px-4 py-3 text-[13px] font-semibold text-primary-deep">
                    To enter the dashboard, your profile progress needs to be 60% or above.
                  </div>
                )}
                {/* desktop nav */}
                <div className="mt-7 hidden items-center justify-end lg:flex">
                  <div className="flex gap-3">
                    {step > 0 && (
                      <Button variant="outline" size="cta" onClick={handleBack} disabled={isSaving}>
                        ← Back
                      </Button>
                    )}
                    {isSkippableStep && (
                      <Button variant="ghost" size="cta" onClick={handleSkip} disabled={isSaving}>
                        Skip
                      </Button>
                    )}
                    <Button size="cta" onClick={handleNext} disabled={isSaving}>
                      {lastStep ? "Submit profile" : "Save & Continue"}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </main>

          {/* mobile sticky nav */}
          {!showOtp && (
            <div className="fixed inset-x-0 bottom-0 z-20 flex gap-2.5 border-t border-card-border bg-card/95 px-5 py-3.5 pb-5 backdrop-blur-md lg:hidden">
              {step > 0 && (
                <Button variant="outline" size="cta" onClick={handleBack} disabled={isSaving}>
                  Back
                </Button>
              )}
              {isSkippableStep && (
                <Button variant="ghost" size="cta" onClick={handleSkip} disabled={isSaving}>
                  Skip
                </Button>
              )}
              <Button size="cta" className="flex-1" onClick={handleNext} disabled={isSaving}>
                {lastStep ? "Submit profile" : "Save & Continue"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </FormProvider>
  );
}

function stepHeading(step: number) {
  return [
    "Create your account",
    "Tell us about yourself",
    "Your education & career",
    "Tell us about your family",
    "Horoscope details",
    "About you",
    "Who are you looking for?",
    "Add your photos",
    "Verify your identity",
    "Review your profile",
  ][step];
}

function stepSubheading(step: number) {
  return [
    "This is how you'll sign in and how matches can reach you. Fields marked * are required.",
    "This creates the basics of the profile. Fields marked * are required.",
    "Helps us find matches with compatible career goals.",
    "Family plays a big role in Kerala matchmaking traditions.",
    "Optional, but most members prefer horoscope-matched profiles.",
    "Optional, but it's what other members actually read when evaluating a match.",
    "Set your initial preferences — you can refine these anytime in Search.",
    "Profiles with real photos get 3x more interests.",
    "A quick check keeps every profile on Parinayam genuine.",
    "One final look before your profile goes live.",
  ][step];
}
