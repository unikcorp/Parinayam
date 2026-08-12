"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Heart, Lock, Check, ChevronDown, Apple } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { SegmentedControl } from "@/components/shared/segmented-control";
import { ImageSlot } from "@/components/shared/image-slot";
import { brand } from "@/data/brand";
import {
  loginSchema,
  loginDefaultValues,
  type LoginFormValues,
} from "@/validation/auth.schema";
import { OTP_LENGTH } from "@/constants/auth";
import { api, ApiError, setAccessToken } from "@/lib/api";
import { useAuth } from "@/context/auth-context";
import { useState } from "react";

interface MemberLoginResponse {
  user: { id: number; email: string; roleId: number; memberId: number };
  accessToken: string;
}

interface MemberProfileResponse {
  member: { first_name: string; last_name: string; member_code: string };
}

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: loginDefaultValues,
  });
  const mode = watch("mode");

  async function completeLogin({ user, accessToken }: MemberLoginResponse) {
    // Set before the profile fetch below so it goes out with the right
    // Authorization header instead of round-tripping through a 401 + refresh.
    setAccessToken(accessToken);

    let name = user.email;
    let avatarInitials = user.email.slice(0, 2).toUpperCase();
    let memberCode: string | null = null;
    try {
      const profile = await api.get<MemberProfileResponse>(
        `/api/members/${user.memberId}`,
      );
      name = `${profile.member.first_name} ${profile.member.last_name}`.trim();
      avatarInitials =
        `${profile.member.first_name[0] ?? ""}${profile.member.last_name[0] ?? ""}`.toUpperCase();
      memberCode = profile.member.member_code;
    } catch {
      // Profile fetch is a display-name nicety — login already succeeded, don't block on it.
    }

    login(
      {
        id: String(user.memberId),
        name,
        email: user.email,
        avatarInitials,
        premium: false,
        memberCode,
      },
      accessToken,
    );
    router.push("/dashboard");
  }

  async function onSubmit(values: LoginFormValues) {
    setFormError(null);

    try {
      if (values.mode === "otp") {
        // The OTP digits themselves are still a client-side dummy check (no
        // SMS provider wired up) — but the mobile number is validated
        // server-side against real members, same as password login.
        const data = await api.post<MemberLoginResponse>(
          "/api/members/login/otp",
          {
            mobileNumber: values.phone,
          },
        );
        await completeLogin(data);
        return;
      }

      const data = await api.post<MemberLoginResponse>("/api/members/login", {
        mobileNumber: values.phone,
        password: values.password,
      });
      await completeLogin(data);
    } catch (error) {
      setFormError(
        error instanceof ApiError
          ? error.message
          : "Something went wrong. Please try again.",
      );
    }
  }

  return (
    <div className="lg:grid lg:h-screen lg:grid-cols-[1fr_620px] lg:overflow-hidden">
      {/* BRAND PANEL */}
      <aside className="bg-dark-panel-gradient relative overflow-hidden px-6 pt-10 pb-14 text-white lg:flex lg:flex-col lg:rounded-none lg:px-16 lg:py-14">
        <div className="absolute -top-30 -right-30 size-95 rounded-full bg-white/5" />
        <div className="absolute -bottom-40 -left-25 size-105 rounded-full bg-gold-light/8" />

        <Link href="/" className="relative flex items-center gap-2.5 lg:mb-0">
          <span className="flex size-9 items-center justify-center rounded-[11px] bg-white/12 text-lg font-extrabold text-gold-light lg:size-10">
            {brand.logoLetter}
          </span>
          <span className="text-lg font-extrabold">{brand.name}</span>
        </Link>

        <div className="relative mt-8 lg:mt-0 lg:flex lg:flex-1 lg:flex-col lg:justify-center">
          <div className="relative mx-auto mb-8 w-full max-w-[400px]">
            <ImageSlot
              label="Happy couple photo"
              className="h-[260px] w-full rounded-[28px] border-4 border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.3)] lg:h-[380px] lg:border-[5px] lg:shadow-[0_30px_70px_rgba(0,0,0,0.3)]"
            />
            <div className="animate-float absolute -right-4 -bottom-5 flex items-center gap-2.5 rounded-2xl bg-card px-4 py-3 text-primary-deep shadow-[0_16px_40px_rgba(0,0,0,0.25)]">
              <span className="flex size-9 items-center justify-center rounded-full bg-success-bg text-success">
                <Heart className="size-4 fill-current" />
              </span>
              <div>
                <div className="text-[13px] font-extrabold">
                  Meera &amp; Kiran
                </div>
                <div className="text-[11px] text-faint">
                  Married Jan 2026 · Guruvayur
                </div>
              </div>
            </div>
          </div>
          <h1 className="hidden text-center text-[32px] leading-[1.2] font-extrabold tracking-[-0.02em] lg:block">
            Your story continues here.
          </h1>
          <p className="mx-auto mt-3 hidden max-w-md text-center text-base leading-[1.7] text-white/70 lg:block">
            3,200+ couples found each other on {brand.name}. Sign in to see
            who&apos;s waiting to meet you.
          </p>
        </div>

        <div className="relative mt-6 hidden justify-center gap-7 text-[13px] font-semibold text-white/60 lg:flex">
          <span>🔒 Privacy protected</span>
          <span>✓ 100% verified profiles</span>
        </div>
      </aside>

      {/* FORM */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative -mt-6 flex flex-col rounded-t-[24px] bg-card px-5 pt-6 pb-8 shadow-[0_-16px_44px_rgba(127,29,29,0.12)] lg:mt-0 lg:justify-center lg:rounded-none lg:px-22 lg:py-18 lg:shadow-none"
      >
        <h2 className="text-[26px] font-extrabold tracking-[-0.02em] text-primary-deep lg:text-[34px]">
          Welcome back
        </h2>
        <p className="mt-1.5 mb-6 text-[14.5px] text-muted-foreground lg:mb-8 lg:text-[15.5px]">
          Sign in with your mobile number or email.
        </p>

        <Controller
          name="mode"
          control={control}
          render={({ field }) => (
            <SegmentedControl
              value={field.value}
              onChange={field.onChange}
              className="mb-5.5 w-full lg:mb-7"
              options={[
                { label: "OTP Login", value: "otp" },
                { label: "Password", value: "password" },
              ]}
            />
          )}
        />

        <label className="mb-2 block text-[13px] font-bold text-primary-deep">
          Mobile number
        </label>
        <div className="mb-1 flex gap-2.5">
          <div className="flex items-center gap-1.5 rounded-xl border border-input px-4 py-3.5 text-[15px] font-semibold whitespace-nowrap">
            🇮🇳 +91 <ChevronDown className="size-3 text-faint" />
          </div>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                className="h-auto flex-1 rounded-xl border-primary px-4 py-3.5 text-[15px] font-semibold ring-4 ring-surface-blue"
              />
            )}
          />
        </div>
        {errors.phone && (
          <p className="mb-4 text-xs font-semibold text-destructive">
            {errors.phone.message}
          </p>
        )}

        {mode === "otp" ? (
          <>
            <label className="mt-4 mb-2 block text-[13px] font-bold text-primary-deep">
              Enter OTP{" "}
              <span className="font-semibold text-faint">
                — sent to your number
              </span>
            </label>
            <Controller
              name="otp"
              control={control}
              render={({ field }) => (
                <InputOTP
                  maxLength={OTP_LENGTH}
                  value={field.value}
                  onChange={field.onChange}
                  containerClassName="mb-3"
                >
                  <InputOTPGroup className="w-full justify-between gap-2 lg:gap-3">
                    {Array.from({ length: OTP_LENGTH }, (_, i) => i).map(
                      (i) => (
                        <InputOTPSlot
                          key={i}
                          index={i}
                          className="h-13.5 flex-1 rounded-[13px]! border-input text-xl font-extrabold text-primary-deep data-[active=true]:border-primary data-[active=true]:ring-4 data-[active=true]:ring-surface-blue lg:h-15"
                        />
                      ),
                    )}
                  </InputOTPGroup>
                </InputOTP>
              )}
            />
            {errors.otp && (
              <p className="mb-2 text-xs font-semibold text-destructive">
                {errors.otp.message}
              </p>
            )}
            <div className="mb-7 flex justify-between text-[13px]">
              <span className="text-faint">
                Resend in <b className="font-bold text-primary-deep">00:24</b>
              </span>
              <Link href="#" className="font-bold text-primary">
                Forgot password?
              </Link>
            </div>
          </>
        ) : (
          <>
            <label className="mt-4 mb-2 block text-[13px] font-bold text-primary-deep">
              Password
            </label>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="password"
                  placeholder="Enter your password"
                  className="h-auto rounded-xl px-4 py-3.5 text-[15px]"
                />
              )}
            />
            {errors.password && (
              <p className="mt-1.5 text-xs font-semibold text-destructive">
                {errors.password.message}
              </p>
            )}
            <div className="mt-2 mb-7 flex justify-end text-[13px]">
              <Link href="#" className="font-bold text-primary">
                Forgot password?
              </Link>
            </div>
          </>
        )}

        <Button
          size="cta"
          type="submit"
          disabled={isSubmitting}
          className="w-full text-base"
        >
          Sign in
        </Button>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-faint lg:hidden">
          <Lock className="size-3.5" /> Privacy protected
          <Check className="size-3.5" /> 100% verified profiles
        </div>
      </form>
    </div>
  );
}
