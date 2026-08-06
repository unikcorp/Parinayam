"use client";

import { Controller, useFormContext, type FieldValues, type Path } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export function FieldGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-[#F3F5F9] pt-7 first:border-t-0 first:pt-0">
      {title && (
        <div className="mb-4 text-[15px] font-extrabold text-primary-deep">{title}</div>
      )}
      {children}
    </div>
  );
}

export function Field({
  label,
  required,
  error,
  className,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label className="mb-2 block text-[13px] font-bold text-primary-deep">
        {label}
        {required && " *"}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs font-semibold text-destructive">{error}</p>}
    </div>
  );
}

export function TextField<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  required,
  placeholder,
  type = "text",
  className,
}: {
  name: Path<TFieldValues>;
  label: string;
  required?: boolean;
  placeholder?: string;
  type?: string;
  className?: string;
}) {
  const { control, formState: { errors } } = useFormContext<TFieldValues>();
  const error = errors[name]?.message as string | undefined;

  return (
    <Field label={label} required={required} error={error} className={className}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Input
            type={type}
            value={String(field.value ?? "")}
            placeholder={placeholder}
            onChange={(e) => field.onChange(e.target.value)}
            onBlur={field.onBlur}
            className="h-auto rounded-xl px-4 py-3.5 text-[15px]"
          />
        )}
      />
    </Field>
  );
}

export function SelectField<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  required,
  options,
  className,
}: {
  name: Path<TFieldValues>;
  label: string;
  required?: boolean;
  options: string[];
  className?: string;
}) {
  const { control, formState: { errors } } = useFormContext<TFieldValues>();
  const error = errors[name]?.message as string | undefined;

  return (
    <Field label={label} required={required} error={error} className={className}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select value={String(field.value ?? "")} onValueChange={(v) => v && field.onChange(v)}>
            <SelectTrigger className="h-auto w-full rounded-xl px-4 py-3.5 text-[15px] font-semibold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {options.map((o) => (
                <SelectItem key={o} value={o}>
                  {o}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </Field>
  );
}

export function ChipGroup<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  required,
  options,
  className,
}: {
  name: Path<TFieldValues>;
  label: string;
  required?: boolean;
  options: string[];
  className?: string;
}) {
  const { control } = useFormContext<TFieldValues>();

  return (
    <Field label={label} required={required} className={className}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="flex flex-wrap gap-2.5">
            {options.map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => field.onChange(o)}
                className={cn(
                  "rounded-full px-5 py-2.5 text-sm font-bold transition-colors",
                  field.value === o
                    ? "bg-primary text-white"
                    : "border border-input text-muted-foreground hover:border-primary hover:text-primary"
                )}
              >
                {o}
              </button>
            ))}
          </div>
        )}
      />
    </Field>
  );
}

export function SegmentedField<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  required,
  options,
  className,
}: {
  name: Path<TFieldValues>;
  label: string;
  required?: boolean;
  options: string[];
  className?: string;
}) {
  const { control } = useFormContext<TFieldValues>();

  return (
    <Field label={label} required={required} className={className}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="flex overflow-hidden rounded-xl border border-input">
            {options.map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => field.onChange(o)}
                className={cn(
                  "flex-1 py-3.5 text-sm font-bold",
                  field.value === o
                    ? "bg-surface-blue text-primary"
                    : "bg-card text-muted-foreground"
                )}
              >
                {o}
              </button>
            ))}
          </div>
        )}
      />
    </Field>
  );
}

export function TextareaField<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  required,
  placeholder,
  rows = 4,
  className,
}: {
  name: Path<TFieldValues>;
  label: string;
  required?: boolean;
  placeholder?: string;
  rows?: number;
  className?: string;
}) {
  const { control } = useFormContext<TFieldValues>();

  return (
    <Field label={label} required={required} className={className}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <textarea
            value={String(field.value ?? "")}
            placeholder={placeholder}
            rows={rows}
            onChange={(e) => field.onChange(e.target.value)}
            onBlur={field.onBlur}
            className="w-full resize-none rounded-xl border border-input bg-transparent px-4 py-3.5 text-[15px] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        )}
      />
    </Field>
  );
}
