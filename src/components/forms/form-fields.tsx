"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
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

export function PasswordField<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  required,
  placeholder,
  className,
}: {
  name: Path<TFieldValues>;
  label: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
}) {
  const { control, formState: { errors } } = useFormContext<TFieldValues>();
  const error = errors[name]?.message as string | undefined;
  const [visible, setVisible] = useState(false);

  return (
    <Field label={label} required={required} error={error} className={className}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="relative">
            <Input
              type={visible ? "text" : "password"}
              value={String(field.value ?? "")}
              placeholder={placeholder}
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={field.onBlur}
              className="h-auto rounded-xl px-4 py-3.5 pr-11 text-[15px]"
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setVisible((v) => !v)}
              aria-label={visible ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-faint hover:text-primary"
            >
              {visible ? <EyeOff className="size-4.5" /> : <Eye className="size-4.5" />}
            </button>
          </div>
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
              <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
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

// A plain <select>/base-ui Select forces scrolling through the whole list —
// fine for a handful of options, but painful for country/state/district
// (250+ countries, dozens of states). This lets the user type straight into
// the field to filter it, instead of a separate search bar bolted on top.
export function SearchableSelectField<TFieldValues extends FieldValues = FieldValues>({
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
          <SearchableCombobox
            value={String(field.value ?? "")}
            onChange={field.onChange}
            onBlur={field.onBlur}
            options={options}
            placeholder={`Select ${label.toLowerCase()}`}
          />
        )}
      />
    </Field>
  );
}

export function SearchableCombobox({
  value,
  onChange,
  onBlur,
  options,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  options: string[];
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);

  // Keep the displayed text in sync when the field's real value changes from
  // outside (e.g. resetting the form, or a dependent field getting cleared).
  useEffect(() => {
    if (!open) setQuery(value);
  }, [value, open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || q === value.toLowerCase()) return options;
    return options.filter((o) => o.toLowerCase().includes(q));
  }, [options, query, value]);

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery(value);
      }
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open, value]);

  function selectOption(option: string) {
    onChange(option);
    setQuery(option);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        role="combobox"
        aria-expanded={open}
        value={query}
        placeholder={placeholder}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (filtered[0]) selectOption(filtered[0]);
          } else if (e.key === "Escape") {
            setOpen(false);
            setQuery(value);
          }
        }}
        onBlur={() => {
          // Outside-click handles closing when an option is clicked; this
          // covers tabbing away without picking anything.
          window.setTimeout(() => {
            if (!containerRef.current?.contains(document.activeElement)) {
              setOpen(false);
              setQuery(value);
              onBlur?.();
            }
          }, 0);
        }}
        className="h-auto w-full rounded-xl border border-input bg-transparent px-4 py-3.5 text-[15px] font-semibold outline-none placeholder:font-normal placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      />
      {open && (
        <div className="absolute z-50 mt-1.5 max-h-64 w-full overflow-y-auto rounded-lg border border-input bg-popover py-1 text-popover-foreground shadow-md ring-1 ring-foreground/10">
          {filtered.length === 0 ? (
            <div className="px-3.5 py-2 text-sm text-muted-foreground">No matches</div>
          ) : (
            filtered.map((option) => (
              <button
                key={option}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => selectOption(option)}
                className={cn(
                  "flex w-full items-center px-3.5 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground",
                  option === value && "bg-accent/60 font-semibold",
                )}
              >
                {option}
              </button>
            ))
          )}
        </div>
      )}
    </div>
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
