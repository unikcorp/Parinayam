"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SegmentedControl } from "@/components/shared/segmented-control";
import { brand } from "@/data/brand";

const communities = [brand.community, "Nair", "Ezhava", "Iyer", "Any community"];

const districts = [
  "Kerala — All districts",
  "Ernakulam",
  "Thrissur",
  "Kozhikode",
  "Thiruvananthapuram",
  "Kottayam",
];

const ageRanges = ["21 – 27", "24 – 30", "28 – 35", "35 – 45", "45+"];
const maritalStatuses = ["Never married", "Divorced", "Widowed", "Awaiting divorce"];
const educationLevels = ["Any education", "Graduate", "Postgraduate", "Doctorate"];

export function HeroSearchCard() {
  const [searchMode, setSearchMode] = useState<"quick" | "advanced">("quick");
  const [lookingFor, setLookingFor] = useState<"bride" | "groom">("bride");
  const [ageRange, setAgeRange] = useState(ageRanges[1]);
  const [community, setCommunity] = useState(communities[0]);
  const [district, setDistrict] = useState(districts[0]);
  const [maritalStatus, setMaritalStatus] = useState(maritalStatuses[0]);
  const [education, setEducation] = useState(educationLevels[0]);

  return (
    <div className="relative z-10 rounded-[20px] border border-[#F0F1F5] bg-card p-5 shadow-[0_24px_60px_rgba(127,29,29,0.14)] lg:p-7">
      <SegmentedControl
        value={searchMode}
        onChange={setSearchMode}
        className="mb-4 lg:mb-5"
        options={[
          { label: "Quick Search", value: "quick" },
          { label: "Advanced Search", value: "advanced" },
        ]}
      />

      <div
        className={`grid grid-cols-1 gap-4 lg:items-end lg:gap-4 ${
          searchMode === "advanced"
            ? "lg:grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_auto]"
            : "lg:grid-cols-[1fr_1fr_1.1fr_1.1fr_auto]"
        }`}
      >
        <Field label="Looking for">
          <Select value={lookingFor} onValueChange={(v) => v && setLookingFor(v as "bride" | "groom")}>
            <SelectTrigger className="h-12 w-full rounded-xl px-3.5 text-[15px] font-semibold capitalize">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bride">Bride</SelectItem>
              <SelectItem value="groom">Groom</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <Field label="Age">
          <Select value={ageRange} onValueChange={(v) => v && setAgeRange(v)}>
            <SelectTrigger className="h-12 w-full rounded-xl px-3.5 text-[15px] font-semibold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ageRanges.map((a) => (
                <SelectItem key={a} value={a}>
                  {a}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Community">
          <Select value={community} onValueChange={(v) => v && setCommunity(v)}>
            <SelectTrigger className="h-12 w-full rounded-xl px-3.5 text-[15px] font-semibold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {communities.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Location">
          <Select value={district} onValueChange={(v) => v && setDistrict(v)}>
            <SelectTrigger className="h-12 w-full rounded-xl px-3.5 text-[15px] font-semibold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {districts.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        {searchMode === "advanced" && (
          <>
            <Field label="Marital status">
              <Select value={maritalStatus} onValueChange={(v) => v && setMaritalStatus(v)}>
                <SelectTrigger className="h-12 w-full rounded-xl px-3.5 text-[15px] font-semibold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {maritalStatuses.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Education">
              <Select value={education} onValueChange={(v) => v && setEducation(v)}>
                <SelectTrigger className="h-12 w-full rounded-xl px-3.5 text-[15px] font-semibold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {educationLevels.map((e) => (
                    <SelectItem key={e} value={e}>
                      {e}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </>
        )}

        <Button
          variant="gold"
          size="cta"
          className="w-full lg:w-auto"
          render={<Link href="/register" />}
        >
          Search <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold tracking-wide text-faint uppercase">
        {label}
      </label>
      {children}
    </div>
  );
}
