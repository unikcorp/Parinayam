"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormProvider } from "react-hook-form";
import { registrationSteps } from "@/data/registration/types";
import { registrationFieldsByStep } from "@/features/registration-wizard/schema";
import { useRegistrationForm } from "@/features/registration-wizard/hooks/use-registration-form";
import { submitRegistrationProfile } from "@/features/registration-wizard/api";
import { StepperSidebar } from "@/components/layout/registration-stepper-sidebar";
import { MobileStepHeader } from "@/components/layout/registration-mobile-header";
import { Button } from "@/components/ui/button";

import { AccountInfoStep } from "@/features/registration-wizard/components/account-info";
import { OtpGate } from "@/features/registration-wizard/components/otp-gate";
import { PersonalStep } from "@/features/registration-wizard/components/personal";
import { EducationStep } from "@/features/registration-wizard/components/education";
import { FamilyStep } from "@/features/registration-wizard/components/family";
import { HoroscopeStep } from "@/features/registration-wizard/components/horoscope";
import { PreferencesStep } from "@/features/registration-wizard/components/preferences";
import { PhotosStep } from "@/features/registration-wizard/components/photos";
import { VerificationStep } from "@/features/registration-wizard/components/verification";
import { ReviewStep } from "@/features/registration-wizard/components/review";

// The OTP screen isn't one of the 9 numbered steps — it's an interstitial
// that interrupts the wizard right after Account Info (step 0), before the
// rest of the profile can be filled in. Tracked separately from `step` so
// the stepper still reads "step 1 of 9" while it's showing.
const ACCOUNT_INFO_STEP = 0;

export default function RegisterPage() {
  const router = useRouter();
  const { form, step, setStep, lastStep, goNext, goBack, clearDraft } = useRegistrationForm();
  const [showOtp, setShowOtp] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const percent = Math.round(((step + 1) / registrationSteps.length) * 100);

  async function handleAccountInfoContinue() {
    const valid = await form.trigger(registrationFieldsByStep[ACCOUNT_INFO_STEP]);
    if (!valid) return;
    setShowOtp(true);
  }

  function handleOtpVerified() {
    setOtpVerified(true);
    setShowOtp(false);
    setStep(ACCOUNT_INFO_STEP + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleNext() {
    if (step === ACCOUNT_INFO_STEP && !otpVerified) {
      await handleAccountInfoContinue();
      return;
    }
    if (lastStep) {
      const valid = await form.trigger();
      if (!valid) return;
      await submitRegistrationProfile(form.getValues());
      clearDraft();
      router.push("/dashboard");
      return;
    }
    const advanced = await goNext();
    if (advanced) window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleBack() {
    goBack();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleSkip() {
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

            <div className="rounded-2xl border border-card-border bg-card p-5 shadow-[0_8px_30px_rgba(127,29,29,0.05)] lg:rounded-[20px] lg:p-10">
              {showOtp ? (
                <OtpGate
                  mobile={`${form.getValues("mobileCountryCode")} ${form.getValues("mobileNumber")}`}
                  onVerified={handleOtpVerified}
                  onChangeNumber={() => setShowOtp(false)}
                />
              ) : (
                <>
                  {step === 0 && <AccountInfoStep />}
                  {step === 1 && <PersonalStep />}
                  {step === 2 && <EducationStep />}
                  {step === 3 && <FamilyStep />}
                  {step === 4 && <HoroscopeStep />}
                  {step === 5 && <PreferencesStep />}
                  {step === 6 && <PhotosStep />}
                  {step === 7 && <VerificationStep />}
                  {step === 8 && <ReviewStep onEditStep={handleStepClick} />}
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
                      <Button variant="outline" size="cta" onClick={handleBack}>
                        ← Back
                      </Button>
                    )}
                    {isSkippableStep && (
                      <Button variant="ghost" size="cta" onClick={handleSkip}>
                        Skip
                      </Button>
                    )}
                    <Button size="cta" onClick={handleNext}>
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
                <Button variant="outline" size="cta" onClick={handleBack}>
                  Back
                </Button>
              )}
              {isSkippableStep && (
                <Button variant="ghost" size="cta" onClick={handleSkip}>
                  Skip
                </Button>
              )}
              <Button size="cta" className="flex-1" onClick={handleNext}>
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
    "Set your initial preferences — you can refine these anytime in Search.",
    "Profiles with real photos get 3x more interests.",
    "A quick check keeps every profile on Parinayam genuine.",
    "One final look before your profile goes live.",
  ][step];
}
