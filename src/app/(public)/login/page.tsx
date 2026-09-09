"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Heart, Lock, Check, ChevronDown, Apple, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { SegmentedControl } from "@/components/shared/segmented-control";
import { BrandMark } from "@/components/shared/brand-mark";
import { PasswordInput } from "@/components/shared/password-input";
import { useHasCustomLogo } from "@/hooks/use-branding";
import { useBanners, bannerImageUrl, type BannerSlot } from "@/hooks/use-banners";
import { brand } from "@/data/brand";
import {
  loginSchema,
  loginDefaultValues,
  type LoginFormValues,
} from "@/validation/auth.schema";
import { OTP_LENGTH } from "@/constants/auth";
import { api, ApiError, setAccessToken } from "@/lib/api";
import { useAuth } from "@/context/auth-context";
import { useEffect, useState } from "react";

interface MemberLoginResponse {
  user: { id: number; email: string; roleId: number; memberId: number };
  accessToken: string;
}

interface MemberProfileResponse {
  member: { first_name: string; last_name: string; member_code: string };
}

type SectionKey =
  | "personal_location"
  | "education"
  | "family"
  | "horoscope"
  | "about"
  | "partner_preference"
  | "photos"
  | "identity";

interface CompletionSummary {
  profile_completion: number;
  sections: Record<SectionKey, boolean>;
  mandatory_done: boolean;
  has_selected_plan: boolean;
  can_enter_dashboard: boolean;
}

const MANDATORY_SECTIONS: SectionKey[] = ["personal_location", "education", "about"];
const ALL_SECTIONS: SectionKey[] = [
  "personal_location",
  "education",
  "family",
  "horoscope",
  "about",
  "partner_preference",
  "photos",
  "identity",
];
const SECTION_TO_EDIT_STEP: Record<SectionKey, string> = {
  personal_location: "personal",
  education: "education",
  family: "family",
  horoscope: "horoscope",
  about: "about",
  partner_preference: "preferences",
  photos: "photos",
  identity: "verification",
};

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const hasCustomLogo = useHasCustomLogo();
  // The 4 admin-uploaded Home Page Banner images (Site Settings > Home Page
  // Banner) rotate through this hero slot — falls back to a single
  // placeholder photo until at least one banner is uploaded.
  const { data: banners } = useBanners();
  const bannerSlots: BannerSlot[] = [1, 2, 3, 4];
  const heroImages = bannerSlots
    .map((slot) => bannerImageUrl(banners?.[slot] ?? null))
    .filter((src): src is string => !!src);
  const rotatingImages = heroImages.length > 0 ? heroImages : ["/photos/couple.jpg"];
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    // The banner list can change size once it loads (or if an admin edits
    // it) — clamp back to a valid index rather than leaving every layer
    // hidden with none matching heroIndex.
    setHeroIndex((i) => (i >= rotatingImages.length ? 0 : i));
    if (rotatingImages.length <= 1) return;
    const timer = setInterval(() => {
      setHeroIndex((i) => (i + 1) % rotatingImages.length);
    }, 5000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rotatingImages.length]);

  const [formError, setFormError] = useState<string | null>(null);
  const [pendingDeletion, setPendingDeletion] = useState<{
    identifier: { mobileNumber?: string; email?: string };
    deletionDate: string;
  } | null>(null);
  const [recoveryPassword, setRecoveryPassword] = useState("");
  const [recoveryError, setRecoveryError] = useState<string | null>(null);
  const [recoveryMessage, setRecoveryMessage] = useState<string | null>(null);
  const [recoveryLoading, setRecoveryLoading] = useState(false);
  const [otpRequested, setOtpRequested] = useState(false);
  const {
    control,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: loginDefaultValues,
  });
  const mode = watch("mode");

  // Switching modes (or picking OTP fresh) always starts at "enter phone,
  // generate OTP" again rather than carrying over a stale revealed OTP step.
  useEffect(() => {
    setOtpRequested(false);
  }, [mode]);

  async function handleGenerateOtp() {
    const phoneValid = await trigger("phone");
    if (!phoneValid) return;
    // No SMS provider wired up yet (see onSubmit's login/otp call) — this
    // just reveals the OTP step. The actual mobile number is still
    // validated server-side against real members on submit.
    setOtpRequested(true);
  }

  async function handleRecoverAccount() {
    if (!pendingDeletion) return;
    setRecoveryError(null);
    if (!recoveryPassword) {
      setRecoveryError("Enter your password to recover your account.");
      return;
    }
    setRecoveryLoading(true);
    try {
      await api.post("/api/members/account/cancel-deletion", {
        ...pendingDeletion.identifier,
        password: recoveryPassword,
      });
      setPendingDeletion(null);
      setRecoveryPassword("");
      setRecoveryMessage("Your account has been recovered. Please log in.");
    } catch (error) {
      setRecoveryError(error instanceof ApiError ? error.message : "Could not recover your account.");
    } finally {
      setRecoveryLoading(false);
    }
  }

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

    login({ id: String(user.memberId), name, email: user.email, avatarInitials, premium: false, memberCode }, accessToken);

    // Route straight to wherever this member actually belongs instead of
    // always landing on /dashboard first and letting RequireCompleteProfile
    // bounce them off it a beat later — same rule the (shell) gate applies,
    // checked here too so the very first screen after login is the right one.
    try {
      const summary = await api.get<CompletionSummary>("/api/members/me/completion");
      if (summary.can_enter_dashboard) {
        router.push("/dashboard");
        return;
      }
      const profileReady = summary.profile_completion >= 60;
      if (!profileReady) {
        const firstIncomplete =
          MANDATORY_SECTIONS.find((key) => !summary.sections[key]) ??
          ALL_SECTIONS.find((key) => !summary.sections[key]) ??
          "personal_location";
        router.push(`/profile/edit?step=${SECTION_TO_EDIT_STEP[firstIncomplete]}&resume=1`);
        return;
      }
      router.push("/plans");
    } catch {
      // Completion check failed — fall back to /dashboard, which still
      // gates via RequireCompleteProfile on its own.
      router.push("/dashboard");
    }
  }

  async function onSubmit(values: LoginFormValues) {
    setFormError(null);
    setPendingDeletion(null);
    setRecoveryMessage(null);

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
        email: values.email,
        password: values.password,
      });
      await completeLogin(data);
    } catch (error) {
      if (error instanceof ApiError && error.details?.code === "ACCOUNT_PENDING_DELETION") {
        setPendingDeletion({
          identifier: values.mode === "otp" ? { mobileNumber: values.phone } : { email: values.email },
          deletionDate: String(error.details.deletionDate),
        });
        return;
      }
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

        <div className="relative flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <BrandMark className="flex size-9 items-center justify-center rounded-[11px] bg-white/12 text-lg font-extrabold text-gold-light lg:size-10" />
            {!hasCustomLogo && <span className="text-lg font-extrabold">{brand.name}</span>}
          </Link>

          <Link
            href="/"
            className="group inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-2 text-[13px] font-semibold text-white/85 backdrop-blur-sm transition-colors hover:bg-white/18 hover:text-white"
          >
            <ArrowLeft className="size-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
            <span className="hidden sm:inline">Back to home</span>
          </Link>
        </div>

        <div className="relative mt-8 lg:mt-0 lg:flex lg:flex-1 lg:flex-col lg:justify-center">
          <div className="relative mx-auto mb-8 w-full max-w-[400px]">
            <div className="relative h-[260px] w-full overflow-hidden rounded-[28px] border-4 border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.3)] lg:h-[380px] lg:border-[5px] lg:shadow-[0_30px_70px_rgba(0,0,0,0.3)]">
              {rotatingImages.map((src, i) => (
                <Image
                  key={src}
                  src={src}
                  alt="Happy couple photo"
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 100vw, 400px"
                  className={`object-cover transition-opacity duration-1000 ${i === heroIndex ? "opacity-100" : "opacity-0"}`}
                />
              ))}
            </div>
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
        className="relative -mt-6 flex flex-col rounded-t-[24px] bg-card px-5 pt-6 pb-8 shadow-[0_-16px_44px_rgba(127,29,29,0.12)] lg:mt-0 lg:overflow-y-auto lg:rounded-none lg:px-22 lg:py-18 lg:shadow-none"
      >
        <h2 className="text-[26px] font-extrabold tracking-[-0.02em] text-primary-deep lg:text-[34px]">
          Welcome back
        </h2>
        <p className="mt-1.5 mb-6 text-[14.5px] text-muted-foreground lg:mb-8 lg:text-[15.5px]">
          Sign in with your mobile number or email.
        </p>

        {recoveryMessage && (
          <div className="mb-5.5 rounded-xl border border-success/30 bg-success-bg px-4 py-3 text-[13.5px] font-semibold text-success">
            {recoveryMessage}
          </div>
        )}

        {pendingDeletion ? (
          <div className="mb-5.5 flex flex-col gap-4 rounded-xl border border-destructive/30 bg-destructive/5 p-4.5">
            <p className="text-[14px] font-semibold text-ink">
              This account is scheduled for deletion on{" "}
              <b className="font-extrabold text-primary-deep">
                {new Date(pendingDeletion.deletionDate).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </b>
              . Would you like to cancel the deletion and recover your account?
            </p>

            <div>
              <label className="mb-1.5 block text-[13px] font-bold text-primary-deep">Password</label>
              <PasswordInput
                value={recoveryPassword}
                onChange={(e) => setRecoveryPassword(e.target.value)}
                placeholder="Enter your password to confirm"
                className="h-auto rounded-xl px-4 py-3.5 text-[15px]"
              />
            </div>
            {recoveryError && <p className="text-xs font-semibold text-destructive">{recoveryError}</p>}

            <div className="flex flex-col gap-2.5 sm:flex-row">
              <Button
                type="button"
                className="flex-1"
                disabled={recoveryLoading}
                onClick={handleRecoverAccount}
              >
                Cancel Deletion &amp; Recover Account
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setPendingDeletion(null);
                  setRecoveryPassword("");
                  setRecoveryError(null);
                }}
              >
                Continue with Deletion
              </Button>
            </div>
          </div>
        ) : (
          <>
        {formError && (
          <div className="mb-5.5 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-[13.5px] font-semibold text-destructive">
            {formError}
          </div>
        )}

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

        {mode === "otp" ? (
          <>
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
          </>
        ) : (
          <>
            <label className="mb-2 block text-[13px] font-bold text-primary-deep">
              Email
            </label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="email"
                  placeholder="you@example.com"
                  className="h-auto rounded-xl border-primary px-4 py-3.5 text-[15px] font-semibold ring-4 ring-surface-blue"
                />
              )}
            />
            {errors.email && (
              <p className="mt-1.5 mb-1 text-xs font-semibold text-destructive">
                {errors.email.message}
              </p>
            )}
          </>
        )}

        {mode === "otp" ? (
          otpRequested && (
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
                <button
                  type="button"
                  onClick={() => setOtpRequested(false)}
                  className="font-bold text-faint hover:text-primary-deep"
                >
                  Change number
                </button>
                <span className="text-faint">
                  Resend in <b className="font-bold text-primary-deep">00:24</b>
                </span>
              </div>
            </>
          )
        ) : (
          <>
            <label className="mt-4 mb-2 block text-[13px] font-bold text-primary-deep">
              Password
            </label>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <PasswordInput
                  {...field}
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
              <Link href="/forgot-password" className="font-bold text-primary">
                Forgot password?
              </Link>
            </div>
          </>
        )}

        {mode === "otp" && !otpRequested ? (
          <Button
            size="cta"
            type="button"
            onClick={handleGenerateOtp}
            className="w-full text-base"
          >
            Generate OTP
          </Button>
        ) : (
          <Button
            size="cta"
            type="submit"
            disabled={isSubmitting}
            className="w-full text-base"
          >
            Sign in
          </Button>
        )}

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-faint lg:hidden">
          <Lock className="size-3.5" /> Privacy protected
          <Check className="size-3.5" /> 100% verified profiles
        </div>

        <div className="mt-6 text-center text-[13.5px] text-faint">
          Not registered yet?{" "}
          <Link href="/register" className="font-bold text-primary hover:underline">
            Register now
          </Link>
        </div>
          </>
        )}
      </form>
    </div>
  );
}
