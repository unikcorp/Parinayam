"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { ImageSlot } from "@/components/shared/image-slot";
import { BrandMark } from "@/components/shared/brand-mark";
import { PasswordInput } from "@/components/shared/password-input";
import { useHasCustomLogo } from "@/hooks/use-branding";
import { brand } from "@/data/brand";
import {
  forgotPasswordSchema,
  forgotPasswordDefaultValues,
  type ForgotPasswordFormValues,
} from "@/validation/auth.schema";
import { OTP_LENGTH } from "@/constants/auth";
import { api, ApiError } from "@/lib/api";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const hasCustomLogo = useHasCustomLogo();
  const [formError, setFormError] = useState<string | null>(null);
  const [otpRequested, setOtpRequested] = useState(false);
  const [isRequestingOtp, setIsRequestingOtp] = useState(false);
  const [done, setDone] = useState(false);
  const {
    control,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: forgotPasswordDefaultValues,
  });

  async function handleRequestOtp() {
    const emailValid = await trigger("email");
    if (!emailValid) return;

    setFormError(null);
    setIsRequestingOtp(true);
    try {
      // No email provider wired up yet (same dummy-OTP convention as login) —
      // this just confirms the email belongs to a real member and reveals
      // the OTP + new-password step.
      await api.post("/api/members/password/forgot", { email: getValues("email") });
      setOtpRequested(true);
    } catch (error) {
      setFormError(error instanceof ApiError ? error.message : "Something went wrong. Please try again.");
    } finally {
      setIsRequestingOtp(false);
    }
  }

  async function onSubmit(values: ForgotPasswordFormValues) {
    setFormError(null);
    try {
      await api.post("/api/members/password/reset", {
        email: values.email,
        otp: values.otp,
        newPassword: values.newPassword,
      });
      setDone(true);
    } catch (error) {
      setFormError(error instanceof ApiError ? error.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <div className="lg:grid lg:h-screen lg:grid-cols-[1fr_620px] lg:overflow-hidden">
      {/* BRAND PANEL */}
      <aside className="bg-dark-panel-gradient relative overflow-hidden px-6 pt-10 pb-14 text-white lg:flex lg:flex-col lg:rounded-none lg:px-16 lg:py-14">
        <div className="absolute -top-30 -right-30 size-95 rounded-full bg-white/5" />
        <div className="absolute -bottom-40 -left-25 size-105 rounded-full bg-gold-light/8" />

        <div className="relative flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <BrandMark className="flex size-9 items-center justify-center rounded-[11px] bg-white/12 text-lg font-extrabold text-gold-light lg:size-10" />
            {!hasCustomLogo && <span className="text-lg font-extrabold">{brand.name}</span>}
          </Link>

          <Link
            href="/login"
            className="group inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-2 text-[13px] font-semibold text-white/85 backdrop-blur-sm transition-colors hover:bg-white/18 hover:text-white"
          >
            <ArrowLeft className="size-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
            <span className="hidden sm:inline">Back to sign in</span>
          </Link>
        </div>

        <div className="relative mt-8 lg:mt-0 lg:flex lg:flex-1 lg:flex-col lg:justify-center">
          <div className="relative mx-auto mb-8 w-full max-w-[400px]">
            <ImageSlot
              label="Happy couple photo"
              className="h-[260px] w-full rounded-[28px] border-4 border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.3)] lg:h-[380px] lg:border-[5px] lg:shadow-[0_30px_70px_rgba(0,0,0,0.3)]"
            />
          </div>
          <h1 className="hidden text-center text-[32px] leading-[1.2] font-extrabold tracking-[-0.02em] lg:block">
            Let&apos;s get you back in.
          </h1>
          <p className="mx-auto mt-3 hidden max-w-md text-center text-base leading-[1.7] text-white/70 lg:block">
            Verify your email to set a new password.
          </p>
        </div>
      </aside>

      {/* FORM */}
      <div className="relative -mt-6 flex flex-col rounded-t-[24px] bg-card px-5 pt-6 pb-8 shadow-[0_-16px_44px_rgba(127,29,29,0.12)] lg:mt-0 lg:justify-center lg:rounded-none lg:px-22 lg:py-18 lg:shadow-none">
        {done ? (
          <div className="flex flex-col items-center gap-4 py-10 text-center">
            <span className="flex size-16 items-center justify-center rounded-full bg-success-bg">
              <Check className="size-8 text-success" strokeWidth={3} />
            </span>
            <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-primary-deep">Password reset</h2>
            <p className="max-w-sm text-[14.5px] text-muted-foreground">
              Your password has been changed. You can now sign in with your new password.
            </p>
            <Button size="cta" className="mt-2 w-full max-w-xs" onClick={() => router.push("/login")}>
              Back to sign in
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <h2 className="text-[26px] font-extrabold tracking-[-0.02em] text-primary-deep lg:text-[34px]">
              Forgot password
            </h2>
            <p className="mt-1.5 mb-6 text-[14.5px] text-muted-foreground lg:mb-8 lg:text-[15.5px]">
              Enter your email to receive an OTP and set a new password.
            </p>

            {formError && (
              <div className="mb-5.5 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-[13.5px] font-semibold text-destructive">
                {formError}
              </div>
            )}

            <label className="mb-2 block text-[13px] font-bold text-primary-deep">Email</label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="email"
                  disabled={otpRequested}
                  placeholder="you@example.com"
                  className="h-auto rounded-xl border-primary px-4 py-3.5 text-[15px] font-semibold ring-4 ring-surface-blue"
                />
              )}
            />
            {errors.email && <p className="mt-1.5 mb-4 text-xs font-semibold text-destructive">{errors.email.message}</p>}

            {otpRequested && (
              <>
                <label className="mt-4 mb-2 block text-[13px] font-bold text-primary-deep">
                  Enter OTP <span className="font-semibold text-faint">— sent to your number</span>
                </label>
                <Controller
                  name="otp"
                  control={control}
                  render={({ field }) => (
                    <InputOTP maxLength={OTP_LENGTH} value={field.value} onChange={field.onChange} containerClassName="mb-3">
                      <InputOTPGroup className="w-full justify-between gap-2 lg:gap-3">
                        {Array.from({ length: OTP_LENGTH }, (_, i) => i).map((i) => (
                          <InputOTPSlot
                            key={i}
                            index={i}
                            className="h-13.5 flex-1 rounded-[13px]! border-input text-xl font-extrabold text-primary-deep data-[active=true]:border-primary data-[active=true]:ring-4 data-[active=true]:ring-surface-blue lg:h-15"
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  )}
                />
                {errors.otp && <p className="mb-2 text-xs font-semibold text-destructive">{errors.otp.message}</p>}

                <label className="mt-4 mb-2 block text-[13px] font-bold text-primary-deep">New password</label>
                <Controller
                  name="newPassword"
                  control={control}
                  render={({ field }) => (
                    <PasswordInput
                      {...field}
                      placeholder="Enter a new password"
                      className="h-auto rounded-xl px-4 py-3.5 text-[15px]"
                    />
                  )}
                />
                {errors.newPassword && (
                  <p className="mt-1.5 text-xs font-semibold text-destructive">{errors.newPassword.message}</p>
                )}

                <label className="mt-4 mb-2 block text-[13px] font-bold text-primary-deep">Confirm password</label>
                <Controller
                  name="confirmPassword"
                  control={control}
                  render={({ field }) => (
                    <PasswordInput
                      {...field}
                      placeholder="Re-enter your new password"
                      className="h-auto rounded-xl px-4 py-3.5 text-[15px]"
                    />
                  )}
                />
                {errors.confirmPassword && (
                  <p className="mt-1.5 mb-2 text-xs font-semibold text-destructive">{errors.confirmPassword.message}</p>
                )}
              </>
            )}

            <div className="mt-6">
              {!otpRequested ? (
                <Button
                  size="cta"
                  type="button"
                  disabled={isRequestingOtp}
                  onClick={handleRequestOtp}
                  className="w-full text-base"
                >
                  {isRequestingOtp ? "Sending…" : "Generate OTP"}
                </Button>
              ) : (
                <Button size="cta" type="submit" disabled={isSubmitting} className="w-full text-base">
                  Reset password
                </Button>
              )}
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-faint lg:hidden">
              <Lock className="size-3.5" /> Privacy protected
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
