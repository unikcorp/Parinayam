"use client";

import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { OTP_LENGTH } from "@/constants/auth";

export function OtpGate({
  mobile,
  onVerified,
  onChangeNumber,
}: {
  mobile: string;
  onVerified: () => void;
  onChangeNumber: () => void;
}) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(false);

  function handleVerify() {
    if (otp.length < OTP_LENGTH) {
      setError(true);
      return;
    }
    onVerified();
  }

  return (
    <div className="flex flex-col items-center gap-6 py-6 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-surface-blue text-primary">
        <ShieldCheck className="size-6" />
      </span>
      <div>
        <p className="text-[15px] font-bold text-primary-deep">
          Enter the {OTP_LENGTH}-digit code sent to
        </p>
        <p className="text-[15px] font-bold text-primary">{mobile}</p>
      </div>

      <InputOTP
        maxLength={OTP_LENGTH}
        value={otp}
        onChange={(value) => {
          setOtp(value);
          setError(false);
        }}
      >
        <InputOTPGroup className="gap-2">
          {Array.from({ length: OTP_LENGTH }, (_, i) => i).map((i) => (
            <InputOTPSlot
              key={i}
              index={i}
              className="h-13.5 w-11 rounded-[13px]! border-input text-xl font-extrabold text-primary-deep data-[active=true]:border-primary data-[active=true]:ring-4 data-[active=true]:ring-surface-blue"
            />
          ))}
        </InputOTPGroup>
      </InputOTP>
      {error && (
        <p className="text-xs font-semibold text-destructive">Enter the full {OTP_LENGTH}-digit code</p>
      )}

      <p className="text-[13px] text-faint">
        Resend in <b className="font-bold text-primary-deep">00:24</b>
      </p>

      <div className="flex w-full max-w-xs flex-col gap-3">
        <Button size="cta" type="button" onClick={handleVerify} className="w-full text-base">
          Verify &amp; continue
        </Button>
        <button type="button" onClick={onChangeNumber} className="text-[13px] font-bold text-primary">
          Change number
        </button>
      </div>
    </div>
  );
}
