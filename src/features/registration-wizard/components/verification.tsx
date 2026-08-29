"use client";

import { useState } from "react";
import { FileText, Loader2, UploadCloud, X } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { FieldGroup, SelectField } from "@/components/forms/form-fields";
import { uploadDocumentRequest } from "../api";
import { ApiError } from "@/lib/api";
import type { RegistrationFormValues } from "../schema";

const idTypes = ["Aadhaar", "Passport", "PAN", "Other Documents"];

function IdentityDocumentUpload({ memberId }: { memberId: number | null }) {
  const { watch, setValue } = useFormContext<RegistrationFormValues>();
  const idType = watch("idType");
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    if (!idType) {
      setError("Select an ID type before uploading your document.");
      return;
    }
    setFileName(file.name);
    setValue("idDocumentUploaded", true);
    setError(null);
    if (!memberId) return;

    setUploading(true);
    try {
      await uploadDocumentRequest(memberId, idType, file);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not upload the document.");
      setFileName(null);
      setValue("idDocumentUploaded", false);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setFileName(null);
    setValue("idDocumentUploaded", false);
  };

  if (fileName) {
    return (
      <div className="flex items-center justify-between rounded-xl border border-card-border px-4 py-3">
        <span className="flex items-center gap-2 truncate text-sm font-semibold text-ink">
          {uploading ? <Loader2 className="size-4 shrink-0 animate-spin text-primary" /> : <FileText className="size-4 shrink-0 text-primary" />}
          {fileName}
        </span>
        <button
          type="button"
          onClick={handleRemove}
          disabled={uploading}
          className="flex size-7 shrink-0 items-center justify-center rounded-full text-faint transition-colors hover:bg-danger-bg hover:text-danger disabled:opacity-50"
        >
          <X className="size-3.5" />
        </button>
      </div>
    );
  }

  return (
    <>
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
      {error && <p className="mt-2 text-xs font-semibold text-destructive">{error}</p>}
    </>
  );
}

export function VerificationStep({ memberId }: { memberId: number | null }) {
  return (
    <div className="flex flex-col gap-7">
      <FieldGroup title="Government ID">
        <div className="mb-4">
          <SelectField<RegistrationFormValues> name="idType" label="ID type" required options={idTypes} />
        </div>
        <IdentityDocumentUpload memberId={memberId} />
      </FieldGroup>
    </div>
  );
}
