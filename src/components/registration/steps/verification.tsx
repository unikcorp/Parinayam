import { Camera, ShieldCheck } from "lucide-react";
import type { RegistrationData } from "@/lib/registration/types";
import { FieldGroup, SelectField, TextField } from "@/components/registration/form-fields";
import { Button } from "@/components/ui/button";

const idTypes = ["Aadhaar", "Passport", "PAN card", "Driving licence"];

export function VerificationStep({
  data,
  update,
}: {
  data: RegistrationData;
  update: <K extends keyof RegistrationData>(key: K, value: RegistrationData[K]) => void;
}) {
  return (
    <div className="flex flex-col gap-7">
      <FieldGroup title="Government ID">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <SelectField
            label="ID type"
            required
            value={data.idType}
            onChange={(v) => update("idType", v)}
            options={idTypes}
          />
          <TextField
            label="ID number"
            required
            value={data.idNumber}
            onChange={(v) => update("idNumber", v)}
            placeholder="XXXX XXXX XXXX"
          />
        </div>
      </FieldGroup>

      <FieldGroup title="Live selfie">
        {data.selfieCaptured ? (
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
              onClick={() => update("selfieCaptured", false)}
            >
              Retake
            </Button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => update("selfieCaptured", true)}
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
