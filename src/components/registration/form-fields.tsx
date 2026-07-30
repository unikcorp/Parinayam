"use client";

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
  className,
  children,
}: {
  label: string;
  required?: boolean;
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
    </div>
  );
}

export function TextField({
  label,
  required,
  value,
  onChange,
  placeholder,
  type = "text",
  className,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
}) {
  return (
    <Field label={label} required={required} className={className}>
      <Input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="h-auto rounded-xl px-4 py-3.5 text-[15px]"
      />
    </Field>
  );
}

export function SelectField({
  label,
  required,
  value,
  onChange,
  options,
  className,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  className?: string;
}) {
  return (
    <Field label={label} required={required} className={className}>
      <Select value={value} onValueChange={(v) => v && onChange(v)}>
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
    </Field>
  );
}

export function ChipGroup({
  label,
  required,
  value,
  onChange,
  options,
  className,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  className?: string;
}) {
  return (
    <Field label={label} required={required} className={className}>
      <div className="flex flex-wrap gap-2.5">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => onChange(o)}
            className={cn(
              "rounded-full px-5 py-2.5 text-sm font-bold transition-colors",
              value === o
                ? "bg-primary text-white"
                : "border border-input text-muted-foreground hover:border-primary hover:text-primary"
            )}
          >
            {o}
          </button>
        ))}
      </div>
    </Field>
  );
}

export function SegmentedField({
  label,
  required,
  value,
  onChange,
  options,
  className,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  className?: string;
}) {
  return (
    <Field label={label} required={required} className={className}>
      <div className="flex overflow-hidden rounded-xl border border-input">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => onChange(o)}
            className={cn(
              "flex-1 py-3.5 text-sm font-bold",
              value === o
                ? "bg-surface-blue text-primary"
                : "bg-card text-muted-foreground"
            )}
          >
            {o}
          </button>
        ))}
      </div>
    </Field>
  );
}

export function TextareaField({
  label,
  required,
  value,
  onChange,
  placeholder,
  rows = 4,
  className,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
}) {
  return (
    <Field label={label} required={required} className={className}>
      <textarea
        value={value}
        placeholder={placeholder}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        className="w-full resize-none rounded-xl border border-input bg-transparent px-4 py-3.5 text-[15px] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      />
    </Field>
  );
}
