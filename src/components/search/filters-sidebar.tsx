"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RangeFilter } from "@/components/shared/range-filter";
import type { RegistrationLookups } from "@/features/registration-wizard/use-registration-lookups";
import type { SearchFilters } from "@/types/profile";

const HEIGHT_OPTIONS = ["4' 10\"", "5' 0\"", "5' 2\"", "5' 4\" (163 cm)", "5' 6\"", "5' 8\"", "6' 0\""];
const maritalStatusOptions = ["Any", "Never Married", "Divorced", "Widowed", "Awaiting Divorce"];
const ANY = "Any";

export function FiltersSidebar({
  lookups,
  onApply,
  className,
}: {
  lookups: RegistrationLookups;
  onApply: (filters: SearchFilters) => void;
  className?: string;
}) {
  const [age, setAge] = useState<[number, number]>([21, 45]);
  const [minHeight, setMinHeight] = useState(ANY);
  const [religion, setReligion] = useState(ANY);
  const [caste, setCaste] = useState(ANY);
  const [subCaste, setSubCaste] = useState(ANY);
  const [education, setEducation] = useState(ANY);
  const [occupation, setOccupation] = useState(ANY);
  const [annualIncome, setAnnualIncome] = useState(ANY);
  const [maritalStatus, setMaritalStatus] = useState(ANY);
  const [country, setCountry] = useState(ANY);
  const [state, setState] = useState(ANY);
  const [district, setDistrict] = useState(ANY);

  function resetAll() {
    setAge([21, 45]);
    setMinHeight(ANY);
    setReligion(ANY);
    setCaste(ANY);
    setSubCaste(ANY);
    setEducation(ANY);
    setOccupation(ANY);
    setAnnualIncome(ANY);
    setMaritalStatus(ANY);
    setCountry(ANY);
    setState(ANY);
    setDistrict(ANY);
    onApply({ ageMin: 21, ageMax: 45 });
  }

  function apply() {
    onApply({
      ageMin: age[0],
      ageMax: age[1],
      minHeight: minHeight === ANY ? undefined : minHeight,
      religion: religion === ANY ? undefined : lookups.resolveReligionId(religion) ?? undefined,
      caste: caste === ANY ? undefined : lookups.resolveCasteId(caste, religion) ?? undefined,
      subCaste: subCaste === ANY ? undefined : lookups.resolveSubCasteId(subCaste, caste) ?? undefined,
      education: education === ANY ? undefined : lookups.resolveEducationId(education) ?? undefined,
      occupation: occupation === ANY ? undefined : lookups.resolveOccupationId(occupation) ?? undefined,
      annualIncome: annualIncome === ANY ? undefined : lookups.resolveIncomeId(annualIncome) ?? undefined,
      maritalStatus: maritalStatus === ANY ? undefined : maritalStatus,
      country: country === ANY ? undefined : lookups.resolveCountryId(country) ?? undefined,
      state: state === ANY ? undefined : lookups.resolveStateId(state, country) ?? undefined,
      district: district === ANY ? undefined : lookups.resolveDistrictId(district, state) ?? undefined,
    });
  }

  function selectField(label: string, value: string, setValue: (v: string) => void, options: string[]) {
    return (
      <div>
        <label className="mb-2 block text-[13px] font-bold text-primary-deep">{label}</label>
        <Select value={value} onValueChange={(v) => v && setValue(v)}>
          <SelectTrigger className="h-auto w-full rounded-xl px-3.5 py-3 text-sm font-semibold">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ANY}>Any</SelectItem>
            {options.map((o) => (
              <SelectItem key={o} value={o}>
                {o}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <aside className={className}>
      <div className="mb-5 flex items-center justify-between">
        <div className="text-[17px] font-extrabold text-primary-deep">Filters</div>
        <button type="button" className="text-[13px] font-bold text-primary" onClick={resetAll}>
          Reset all
        </button>
      </div>

      <div className="mb-5.5">
        <RangeFilter label="Age range" value={age} onChange={setAge} min={18} max={70} />
      </div>

      <div className="flex flex-col gap-4">
        {selectField("Minimum height", minHeight, setMinHeight, HEIGHT_OPTIONS)}
        {selectField("Religion", religion, (v) => {
          setReligion(v);
          setCaste(ANY);
          setSubCaste(ANY);
        }, lookups.religionOptions)}
        {selectField("Caste", caste, (v) => {
          setCaste(v);
          setSubCaste(ANY);
        }, religion === ANY ? [] : lookups.casteOptions(religion))}
        {selectField("Sub caste", subCaste, setSubCaste, caste === ANY ? [] : lookups.subCasteOptions(caste))}
        {selectField("Education", education, setEducation, lookups.educationOptions)}
        {selectField("Occupation", occupation, setOccupation, lookups.occupationOptions)}
        {selectField("Annual income", annualIncome, setAnnualIncome, lookups.incomeOptions)}
        {selectField("Marital status", maritalStatus, setMaritalStatus, maritalStatusOptions.filter((o) => o !== ANY))}
        {selectField("Country", country, (v) => {
          setCountry(v);
          setState(ANY);
          setDistrict(ANY);
        }, lookups.countryOptions)}
        {selectField("State", state, (v) => {
          setState(v);
          setDistrict(ANY);
        }, country === ANY ? [] : lookups.stateOptions(country))}
        {selectField("District", district, setDistrict, state === ANY ? [] : lookups.districtOptions(state))}
      </div>

      <Button size="cta" className="mt-6 w-full" onClick={apply}>
        Apply filters
      </Button>
    </aside>
  );
}
