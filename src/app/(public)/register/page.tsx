"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { FormProvider } from "react-hook-form";
import { registrationSteps } from "@/data/registration/types";
import { registrationFieldsByStep } from "@/features/registration-wizard/schema";
import { useRegistrationForm } from "@/features/registration-wizard/hooks/use-registration-form";
import { useRegistrationLookups } from "@/features/registration-wizard/use-registration-lookups";
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
import { ApiError } from "@/lib/api";
import { StepperSidebar } from "@/components/layout/registration-stepper-sidebar";
import { MobileStepHeader } from "@/components/layout/registration-mobile-header";
import { Button } from "@/components/ui/button";

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
  const { form, step, setStep, lastStep, goNext, goBack } = useRegistrationForm();
  const lookups = useRegistrationLookups();
  const [showOtp, setShowOtp] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [memberId, setMemberId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const percent = Math.round(((step + 1) / registrationSteps.length) * 100);

  // Step 1 doesn't just save — it's the moment the account itself gets
  // created, so it calls the real signup endpoint instead of a plain PUT.
  async function handleAccountInfoContinue() {
    const valid = await form.trigger(registrationFieldsByStep[ACCOUNT_INFO_STEP]);
    if (!valid) return;

    setApiError(null);
    setIsSaving(true);
    try {
      const result = await registerSelfRequest(form.getValues(), lookups);
      setMemberId(result.memberId);
      setShowOtp(true);
    } catch (error) {
      setApiError(errorMessage(error, "Could not create your account. Please try again."));
    } finally {
      setIsSaving(false);
    }
  }

  function handleOtpVerified() {
    setOtpVerified(true);
    setShowOtp(false);
    setStep(ACCOUNT_INFO_STEP + 1);
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

  function handleSkip() {
    // Best-effort progress bookkeeping only — nothing here can lose data,
    // since Skip never touches any of the actual profile fields.
    if (memberId != null) {
      skipStepRequest(memberId, Math.min(step + 1, 9)).catch(() => {});
    }
    setStep((s) => Math.min(s + 1, registrationSteps.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Steps past Account Info are only reachable once the phone is verified —
  // otherwise clicking ahead in the stepper would let someone skip the OTP
  // gate entirely.
  function handleStepClick(index: number) {
    if (index > ACCOUNT_INFO_STEP && !otpVerified) return;
    setShowOtp(false);
    setStep(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function saveAndExit() {
    router.push("/");
  }

  // Only Account Info (step 0) and Review (the last step) are required to
  // move forward — every step in between can be skipped, same as admin's
  // Add Member wizard.
  const isSkippableStep = step > ACCOUNT_INFO_STEP && !lastStep;

  return (
    <FormProvider {...form}>
      <div className="lg:grid lg:min-h-screen lg:grid-cols-[380px_1fr]">
        <StepperSidebar activeIndex={step} onStepClick={otpVerified ? handleStepClick : undefined} />

        <div className="flex flex-1 flex-col">
          <MobileStepHeader
            activeIndex={step}
            onStepClick={otpVerified ? handleStepClick : () => {}}
            onExit={saveAndExit}
          />

          <main className="flex-1 px-5 py-6 pb-28 lg:max-w-215 lg:px-18 lg:py-11 lg:pb-14">
            {/* desktop progress header */}
            <div className="mb-2.5 hidden items-center justify-between lg:flex">
              <span className="text-[13px] font-bold tracking-wide text-faint uppercase">
                Step {step + 1} of {registrationSteps.length} ·{" "}
                {showOtp ? "Verify mobile" : registrationSteps[step].title}
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
                <div className="flex items-center justify-center gap-2 py-16 text-sm text-faint">
                  <Loader2 className="size-4 animate-spin" /> Loading form options…
                </div>
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
                  {step === 9 && <ReviewStep onEditStep={handleStepClick} />}
                </>
              )}
            </div>

            {!showOtp && (
              <>
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
