"use client";

import { useRouter } from "next/navigation";
import { registrationSteps } from "@/lib/registration/types";
import { useRegistrationDraft } from "@/lib/registration/use-registration-draft";
import { StepperSidebar } from "@/components/registration/stepper-sidebar";
import { MobileStepHeader } from "@/components/registration/mobile-header";
import { Button } from "@/components/ui/button";

import { PersonalStep } from "@/components/registration/steps/personal";
import { EducationStep } from "@/components/registration/steps/education";
import { FamilyStep } from "@/components/registration/steps/family";
import { HoroscopeStep } from "@/components/registration/steps/horoscope";
import { PreferencesStep } from "@/components/registration/steps/preferences";
import { PhotosStep } from "@/components/registration/steps/photos";
import { VerificationStep } from "@/components/registration/steps/verification";
import { ReviewStep } from "@/components/registration/steps/review";

export default function RegisterPage() {
  const router = useRouter();
  const { data, update, step, setStep, clearDraft } = useRegistrationDraft();

  const lastStep = step === registrationSteps.length - 1;
  const percent = Math.round(((step + 1) / registrationSteps.length) * 100);

  function goNext() {
    if (lastStep) {
      clearDraft();
      router.push("/dashboard");
      return;
    }
    setStep((s) => Math.min(s + 1, registrationSteps.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function saveAndExit() {
    router.push("/");
  }

  return (
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
            {step === 0 && <PersonalStep data={data} update={update} />}
            {step === 1 && <EducationStep data={data} update={update} />}
            {step === 2 && <FamilyStep data={data} update={update} />}
            {step === 3 && <HoroscopeStep data={data} update={update} />}
            {step === 4 && <PreferencesStep data={data} update={update} />}
            {step === 5 && <PhotosStep data={data} update={update} />}
            {step === 6 && <VerificationStep data={data} update={update} />}
            {step === 7 && <ReviewStep data={data} onEditStep={setStep} />}
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
                <Button variant="outline" size="cta" onClick={goBack}>
                  ← Back
                </Button>
              )}
              <Button size="cta" onClick={goNext}>
                {lastStep ? "Submit profile" : "Continue →"}
              </Button>
            </div>
          </div>
        </main>

        {/* mobile sticky nav */}
        <div className="fixed inset-x-0 bottom-0 z-20 flex gap-2.5 border-t border-card-border bg-card/95 px-5 py-3.5 pb-5 backdrop-blur-md lg:hidden">
          {step > 0 && (
            <Button variant="outline" size="cta" onClick={goBack}>
              Back
            </Button>
          )}
          <Button size="cta" className="flex-1" onClick={goNext}>
            {lastStep ? "Submit profile" : "Continue →"}
          </Button>
        </div>
      </div>
    </div>
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
