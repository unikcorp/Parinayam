"use client";

import { useRouter } from "next/navigation";
import { FormProvider } from "react-hook-form";
import { registrationSteps } from "@/data/registration/types";
import { useRegistrationForm } from "@/features/registration-wizard/hooks/use-registration-form";
import { submitRegistrationProfile } from "@/features/registration-wizard/api";
import { StepperSidebar } from "@/components/layout/registration-stepper-sidebar";
import { MobileStepHeader } from "@/components/layout/registration-mobile-header";
import { Button } from "@/components/ui/button";

import { PersonalStep } from "@/features/registration-wizard/components/personal";
import { EducationStep } from "@/features/registration-wizard/components/education";
import { FamilyStep } from "@/features/registration-wizard/components/family";
import { HoroscopeStep } from "@/features/registration-wizard/components/horoscope";
import { PreferencesStep } from "@/features/registration-wizard/components/preferences";
import { PhotosStep } from "@/features/registration-wizard/components/photos";
import { VerificationStep } from "@/features/registration-wizard/components/verification";
import { ReviewStep } from "@/features/registration-wizard/components/review";

export default function ProfileEditPage() {
  const router = useRouter();
  const { form, step, setStep, lastStep, goNext, goBack, clearDraft } = useRegistrationForm();

  const percent = Math.round(((step + 1) / registrationSteps.length) * 100);

  async function handleNext() {
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

  function saveAndExit() {
    router.push("/dashboard");
  }

  return (
    <FormProvider {...form}>
      <div className="lg:grid lg:min-h-screen lg:grid-cols-[380px_1fr]">
        <StepperSidebar activeIndex={step} />

        <div className="flex flex-1 flex-col">
          <MobileStepHeader activeIndex={step} onStepClick={setStep} onExit={saveAndExit} />

          <main className="flex-1 px-5 py-6 pb-28 lg:max-w-215 lg:px-18 lg:py-11 lg:pb-14">
            {/* desktop progress header */}
            <div className="mb-2.5 hidden items-center justify-between lg:flex">
              <span className="text-[13px] font-bold tracking-wide text-faint uppercase">
                Step {step + 1} of {registrationSteps.length} ·{" "}
                {registrationSteps[step].title}
              </span>
              <span className="text-[13px] font-bold text-success">
                {percent}% complete
              </span>
            </div>
            <div className="mb-9 hidden h-2 overflow-hidden rounded-full bg-[#EDEFF3] lg:block">
              <div
                className="bg-progress-success-gradient h-full transition-[width] duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>

            <h1 className="mb-2 text-2xl font-extrabold tracking-[-0.02em] text-primary-deep lg:text-[32px]">
              {stepHeading(step)}
            </h1>
            <p className="mb-6 text-[15px] text-muted-foreground lg:mb-9">
              {stepSubheading(step)}
            </p>

            <div className="rounded-2xl border border-card-border bg-card p-5 shadow-[0_8px_30px_rgba(127,29,29,0.05)] lg:rounded-[20px] lg:p-10">
              {step === 0 && <PersonalStep />}
              {step === 1 && <EducationStep />}
              {step === 2 && <FamilyStep />}
              {step === 3 && <HoroscopeStep />}
              {step === 4 && <PreferencesStep />}
              {step === 5 && <PhotosStep />}
              {step === 6 && <VerificationStep />}
              {step === 7 && <ReviewStep onEditStep={setStep} />}
            </div>

            {/* desktop nav */}
            <div className="mt-7 hidden items-center justify-between lg:flex">
              <button
                type="button"
                onClick={saveAndExit}
                className="text-[15px] font-bold text-faint"
              >
                Save &amp; exit
              </button>
              <div className="flex gap-3">
                {step > 0 && (
                  <Button variant="outline" size="cta" onClick={handleBack}>
                    ← Back
                  </Button>
                )}
                <Button size="cta" onClick={handleNext}>
                  {lastStep ? "Submit profile" : "Continue →"}
                </Button>
              </div>
            </div>
          </main>

          {/* mobile sticky nav */}
          <div className="fixed inset-x-0 bottom-0 z-20 flex gap-2.5 border-t border-card-border bg-card/95 px-5 py-3.5 pb-5 backdrop-blur-md lg:hidden">
            {step > 0 && (
              <Button variant="outline" size="cta" onClick={handleBack}>
                Back
              </Button>
            )}
            <Button size="cta" className="flex-1" onClick={handleNext}>
              {lastStep ? "Submit profile" : "Continue →"}
            </Button>
          </div>
        </div>
      </div>
    </FormProvider>
  );
}

function stepHeading(step: number) {
  return [
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
