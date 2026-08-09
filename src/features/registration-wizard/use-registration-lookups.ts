"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface ReligionRow {
  religion_id: number;
  religion_name: string;
  status: "APPROVED" | "UNAPPROVED";
}
interface CasteRow {
  caste_id: number;
  caste_name: string;
  religion_id: number;
  religion_name: string;
  status: "APPROVED" | "UNAPPROVED";
}
interface SubCasteRow {
  sub_caste_id: number;
  sub_caste_name: string;
  caste_id: number;
  caste_name: string;
  status: "APPROVED" | "UNAPPROVED";
}
interface CountryRow {
  country_id: number;
  country_name: string;
  status: "APPROVED" | "UNAPPROVED";
}
interface StateRow {
  state_id: number;
  state_name: string;
  country_name: string;
  status: "APPROVED" | "UNAPPROVED";
}
interface DistrictRow {
  district_id: number;
  district_name: string;
  state_name: string;
  status: "APPROVED" | "UNAPPROVED";
}
interface EducationRow {
  edu_id: number;
  edu_name: string;
  status: "APPROVED" | "UNAPPROVED";
}
interface OccupationRow {
  ocp_id: number;
  ocp_name: string;
  status: "APPROVED" | "UNAPPROVED";
}
interface MotherTongueRow {
  mtongue_id: number;
  mtongue_name: string;
  status: "APPROVED" | "UNAPPROVED";
}
interface IncomeRow {
  id: number;
  income: string;
  status: "APPROVED" | "UNAPPROVED";
}
interface StarRow {
  star_id: number;
  star: string;
  status: "APPROVED" | "UNAPPROVED" | null;
}
interface DoshRow {
  dosh_id: number;
  dosh: string;
  status: "APPROVED" | "UNAPPROVED" | null;
}

const LIST = "?limit=100";

/**
 * Same "Add New Details" master data admin's forms use, filtered to
 * APPROVED rows only — mirrors admin's useMemberFormLookups hook, just
 * fetching over the client's own thin `api` wrapper instead of axios.
 */
export function useRegistrationLookups() {
  const religions = useQuery({
    queryKey: ["registration-lookups", "religions"],
    queryFn: () => api.get<ReligionRow[]>(`/api/religion${LIST}`),
  });
  const castes = useQuery({
    queryKey: ["registration-lookups", "castes"],
    queryFn: () => api.get<CasteRow[]>(`/api/caste${LIST}`),
  });
  const subCastes = useQuery({
    queryKey: ["registration-lookups", "sub-castes"],
    queryFn: () => api.get<SubCasteRow[]>(`/api/sub-caste${LIST}`),
  });
  const countries = useQuery({
    queryKey: ["registration-lookups", "countries"],
    queryFn: () => api.get<CountryRow[]>(`/api/country${LIST}`),
  });
  const states = useQuery({
    queryKey: ["registration-lookups", "states"],
    queryFn: () => api.get<StateRow[]>(`/api/state${LIST}`),
  });
  const districts = useQuery({
    queryKey: ["registration-lookups", "districts"],
    queryFn: () => api.get<DistrictRow[]>(`/api/district${LIST}`),
  });
  const educations = useQuery({
    queryKey: ["registration-lookups", "educations"],
    queryFn: () => api.get<EducationRow[]>(`/api/education${LIST}`),
  });
  const occupations = useQuery({
    queryKey: ["registration-lookups", "occupations"],
    queryFn: () => api.get<OccupationRow[]>(`/api/occupation${LIST}`),
  });
  const motherTongues = useQuery({
    queryKey: ["registration-lookups", "mother-tongues"],
    queryFn: () => api.get<MotherTongueRow[]>(`/api/mother-tongue${LIST}`),
  });
  const incomes = useQuery({
    queryKey: ["registration-lookups", "incomes"],
    queryFn: () => api.get<IncomeRow[]>(`/api/income${LIST}`),
  });
  const stars = useQuery({
    queryKey: ["registration-lookups", "stars"],
    queryFn: () => api.get<StarRow[]>(`/api/star${LIST}`),
  });
  const doshes = useQuery({
    queryKey: ["registration-lookups", "doshes"],
    queryFn: () => api.get<DoshRow[]>(`/api/dosh${LIST}`),
  });

  const approved = {
    religions: (religions.data ?? []).filter((r) => r.status === "APPROVED"),
    castes: (castes.data ?? []).filter((c) => c.status === "APPROVED"),
    subCastes: (subCastes.data ?? []).filter((s) => s.status === "APPROVED"),
    countries: (countries.data ?? []).filter((c) => c.status === "APPROVED"),
    states: (states.data ?? []).filter((s) => s.status === "APPROVED"),
    districts: (districts.data ?? []).filter((d) => d.status === "APPROVED"),
    educations: (educations.data ?? []).filter((e) => e.status === "APPROVED"),
    occupations: (occupations.data ?? []).filter((o) => o.status === "APPROVED"),
    motherTongues: (motherTongues.data ?? []).filter((m) => m.status === "APPROVED"),
    incomes: (incomes.data ?? []).filter((i) => i.status === "APPROVED"),
    stars: (stars.data ?? []).filter((s) => s.status === "APPROVED"),
    doshes: (doshes.data ?? []).filter((d) => d.status === "APPROVED"),
  };

  const uniq = (values: string[]) => Array.from(new Set(values));

  return {
    religionOptions: uniq(approved.religions.map((r) => r.religion_name)),
    casteOptions: (religionName: string) =>
      uniq(approved.castes.filter((c) => c.religion_name === religionName).map((c) => c.caste_name)),
    subCasteOptions: (casteName: string) =>
      uniq(approved.subCastes.filter((s) => s.caste_name === casteName).map((s) => s.sub_caste_name)),
    motherTongueOptions: uniq(approved.motherTongues.map((m) => m.mtongue_name)),
    educationOptions: uniq(approved.educations.map((e) => e.edu_name)),
    occupationOptions: uniq(approved.occupations.map((o) => o.ocp_name)),
    incomeOptions: uniq(approved.incomes.map((i) => i.income)),
    countryOptions: uniq(approved.countries.map((c) => c.country_name)),
    stateOptions: (country: string) =>
      uniq(approved.states.filter((s) => s.country_name === country).map((s) => s.state_name)),
    districtOptions: (state: string) =>
      uniq(approved.districts.filter((d) => d.state_name === state).map((d) => d.district_name)),
    starOptions: uniq(approved.stars.map((s) => s.star)),
    doshOptions: uniq(approved.doshes.map((d) => d.dosh)),

    // Name -> id, resolved right before an API call (the form stores names).
    resolveReligionId: (name: string) => approved.religions.find((r) => r.religion_name === name)?.religion_id ?? null,
    resolveCasteId: (name: string, religionName: string) =>
      approved.castes.find((c) => c.caste_name === name && c.religion_name === religionName)?.caste_id ?? null,
    resolveSubCasteId: (name: string, casteName: string) =>
      approved.subCastes.find((s) => s.sub_caste_name === name && s.caste_name === casteName)?.sub_caste_id ?? null,
    resolveMotherTongueId: (name: string) =>
      approved.motherTongues.find((m) => m.mtongue_name === name)?.mtongue_id ?? null,
    resolveEducationId: (name: string) => approved.educations.find((e) => e.edu_name === name)?.edu_id ?? null,
    resolveOccupationId: (name: string) => approved.occupations.find((o) => o.ocp_name === name)?.ocp_id ?? null,
    resolveIncomeId: (name: string) => approved.incomes.find((i) => i.income === name)?.id ?? null,
    resolveCountryId: (name: string) => approved.countries.find((c) => c.country_name === name)?.country_id ?? null,
    resolveStateId: (name: string, countryName: string) =>
      approved.states.find((s) => s.state_name === name && s.country_name === countryName)?.state_id ?? null,
    resolveDistrictId: (name: string, stateName: string) =>
      approved.districts.find((d) => d.district_name === name && d.state_name === stateName)?.district_id ?? null,
    resolveStarId: (name: string) => approved.stars.find((s) => s.star === name)?.star_id ?? null,
    resolveDoshId: (name: string) => approved.doshes.find((d) => d.dosh === name)?.dosh_id ?? null,

    isLoading:
      religions.isLoading ||
      castes.isLoading ||
      subCastes.isLoading ||
      countries.isLoading ||
      states.isLoading ||
      districts.isLoading ||
      educations.isLoading ||
      occupations.isLoading ||
      motherTongues.isLoading ||
      incomes.isLoading ||
      stars.isLoading ||
      doshes.isLoading,
  };
}

export type RegistrationLookups = ReturnType<typeof useRegistrationLookups>;
