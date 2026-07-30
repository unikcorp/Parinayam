import type { RegistrationData } from "@/lib/registration/types";
import {
  ChipGroup,
  FieldGroup,
  SegmentedField,
  SelectField,
  TextField,
} from "@/components/registration/form-fields";

const heights = ["4' 10\"", "5' 0\"", "5' 2\"", "5' 4\" (163 cm)", "5' 6\"", "5' 8\"", "6' 0\""];
const maritalStatuses = ["Never married", "Divorced", "Widowed", "Awaiting divorce"];
const languages = ["Malayalam", "Tamil", "Kannada", "Telugu", "Hindi", "English"];
const religions = ["Hindu", "Christian", "Muslim", "Other"];
const castes = ["Nair", "Ezhava", "Iyer", "Menon", "Other"];
const subCastes = ["Veluthedathu Nair", "Illam", "Other"];
const states = ["Kerala", "Tamil Nadu", "Karnataka"];
const districts = ["Ernakulam", "Thrissur", "Kozhikode", "Thiruvananthapuram", "Kottayam"];

export function PersonalStep({
  data,
  update,
}: {
  data: RegistrationData;
  update: <K extends keyof RegistrationData>(key: K, value: RegistrationData[K]) => void;
}) {
  return (
    <div className="flex flex-col gap-7">
      <FieldGroup title="">
        <ChipGroup
          label="Profile created for"
          required
          value={data.profileFor}
          onChange={(v) => update("profileFor", v)}
          options={["Myself", "My daughter", "My son", "Sibling", "Relative"]}
          className="mb-7"
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <TextField
            label="Full name"
            required
            value={data.fullName}
            onChange={(v) => update("fullName", v)}
            placeholder="Anjali Menon"
          />
          <SegmentedField
            label="Gender"
            required
            value={data.gender === "female" ? "Female" : "Male"}
            onChange={(v) => update("gender", v === "Female" ? "female" : "male")}
            options={["Female", "Male"]}
          />
          <TextField
            label="Date of birth"
            required
            type="date"
            value={data.dob}
            onChange={(v) => update("dob", v)}
          />
          <SelectField
            label="Height"
            required
            value={data.height || heights[3]}
            onChange={(v) => update("height", v)}
            options={heights}
          />
          <SelectField
            label="Marital status"
            required
            value={data.maritalStatus}
            onChange={(v) => update("maritalStatus", v)}
            options={maritalStatuses}
          />
          <SelectField
            label="Mother tongue"
            required
            value={data.motherTongue}
            onChange={(v) => update("motherTongue", v)}
            options={languages}
          />
        </div>
      </FieldGroup>

      <FieldGroup title="Religion & community">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <SelectField
            label="Religion"
            required
            value={data.religion}
            onChange={(v) => update("religion", v)}
            options={religions}
          />
          <SelectField
            label="Caste"
            required
            value={data.caste}
            onChange={(v) => update("caste", v)}
            options={castes}
          />
          <SelectField
            label="Sub caste"
            value={data.subCaste}
            onChange={(v) => update("subCaste", v)}
            options={subCastes}
          />
        </div>
      </FieldGroup>

      <FieldGroup title="Location">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <TextField
            label="Country"
            required
            value={data.country}
            onChange={(v) => update("country", v)}
          />
          <SelectField
            label="State"
            required
            value={data.state}
            onChange={(v) => update("state", v)}
            options={states}
          />
          <SelectField
            label="District"
            required
            value={data.district}
            onChange={(v) => update("district", v)}
            options={districts}
          />
        </div>
      </FieldGroup>
    </div>
  );
}
