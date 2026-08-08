"use client";

import { useState } from "react";
import { Camera, FileText, ShieldCheck, UploadCloud, X } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { FieldGroup, SelectField } from "@/components/forms/form-fields";
import { Button } from "@/components/ui/button";
import type { RegistrationFormValues } from "../schema";

const idTypes = ["Aadhaar", "Passport", "PAN", "Other Documents"];

function IdentityDocumentUpload() {
  const { setValue } = useFormContext<RegistrationFormValues>();
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    setFileName(file.name);
    setValue("idDocumentUploaded", true);
  };

  const handleRemove = () => {
    setFileName(null);
    setValue("idDocumentUploaded", false);
  };

  if (fileName) {
    return (
      <div className="flex items-center justify-between rounded-xl border border-card-border px-4 py-3">
        <span className="flex items-center gap-2 truncate text-sm font-semibold text-ink">
          <FileText className="size-4 shrink-0 text-primary" />
          {fileName}
        </span>
        <button
          type="button"
          onClick={handleRemove}
          className="flex size-7 shrink-0 items-center justify-center rounded-full text-faint transition-colors hover:bg-danger-bg hover:text-danger"
        >
          <X className="size-3.5" />
        </button>
      </div>
    );
  }

  return (
    <label
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        handleFile(e.dataTransfer.files?.[0]);
      }}
      className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-8 transition-colors ${
        dragOver ? "border-primary bg-surface-blue" : "border-input hover:border-primary"
      }`}
    >
      <UploadCloud className="size-5 text-primary" />
      <p className="text-sm font-semibold text-primary-deep">Drag &amp; drop, or click to upload</p>
      <p className="text-xs text-faint">A clear photo or scan of your ID</p>
      <input
        type="file"
        accept="image/*,.pdf"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </label>
  );
}

export function VerificationStep() {
  const { watch, setValue } = useFormContext<RegistrationFormValues>();
  const selfieCaptured = watch("selfieCaptured");

  return (
    <div className="flex flex-col gap-7">
      <FieldGroup title="Government ID">
        <div className="mb-4">
          <SelectField<RegistrationFormValues> name="idType" label="ID type" required options={idTypes} />
        </div>
        <IdentityDocumentUpload />
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
