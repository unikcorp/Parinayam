"use client";

import { Camera, ShieldCheck } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { FieldGroup, SelectField, TextField } from "@/components/forms/form-fields";
import { Button } from "@/components/ui/button";
import type { RegistrationFormValues } from "../schema";

const idTypes = ["Aadhaar", "Passport", "PAN card", "Driving licence"];

export function VerificationStep() {
  const { watch, setValue } = useFormContext<RegistrationFormValues>();
  const selfieCaptured = watch("selfieCaptured");

  return (
    <div className="flex flex-col gap-7">
      <FieldGroup title="Government ID">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <SelectField<RegistrationFormValues> name="idType" label="ID type" required options={idTypes} />
          <TextField<RegistrationFormValues> name="idNumber" label="ID number" required placeholder="XXXX XXXX XXXX" />
        </div>
      </FieldGroup>

      <FieldGroup title="Live selfie">
        {selfieCaptured ? (
          <div className="flex items-center gap-3.5 rounded-2xl bg-success-bg px-5 py-4 text-success">
            <ShieldCheck className="size-6" />
            <div>
              <div className="text-[15px] font-bold">Selfie captured</div>
              <div className="text-[13px] text-success/80">
                We&apos;ll match this against your profile photo.
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="ml-auto"
              onClick={() => setValue("selfieCaptured", false)}
            >
              Retake
            </Button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setValue("selfieCaptured", true)}
            className="flex w-full flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-input py-10 text-faint hover:border-primary hover:text-primary"
          >
            <span className="flex size-14 items-center justify-center rounded-full bg-muted">
              <Camera className="size-6" />
            </span>
            <span className="text-sm font-bold">Tap to capture a live selfie</span>
          </button>
        )}
      </FieldGroup>
    </div>
  );
}
