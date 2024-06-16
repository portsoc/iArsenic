import { Stack, TextField, Autocomplete } from "@mui/material";
import { DropdownDivision, DropdownDistrict, DropdownUpazila, DropdownUnion, RegionTranslations } from "../../types";
import { RegionErrors } from "./Region";

type props = {
    dropdownData: DropdownDivision[];
    selectedDivision: DropdownDivision | null;
    setSelectedDivision: (newValue: DropdownDivision | null) => void;
    selectedDistrict: DropdownDistrict | null;
    setSelectedDistrict: (newValue: DropdownDistrict | null) => void;
    selectedUpazila: DropdownUpazila | null;
    setSelectedUpazila: (newValue: DropdownUpazila | null) => void;
    selectedUnion: DropdownUnion | null;
    setSelectedUnion: (newValue: DropdownUnion | null) => void;
    selectedMouza: string | null;
    setSelectedMouza: (newValue: string | null) => void;
    errors: RegionErrors;
    setErrors: (value: React.SetStateAction<RegionErrors>) => void
    rt: RegionTranslations;
};

export default function EnglishRegionSelector({
    dropdownData,
    selectedDivision,
    setSelectedDivision,
    selectedDistrict,
    setSelectedDistrict,
    selectedUpazila,
    setSelectedUpazila,
    selectedUnion,
    setSelectedUnion,
    selectedMouza,
    setSelectedMouza,
    errors,
    setErrors,
    rt,
}: props) {
    return (
        <Stack className='bengali' width='90%' spacing={2}>
            <Autocomplete
                options={dropdownData}
                value={selectedDivision}
                onChange={(_, newValue) => {
                    setSelectedDivision(newValue);
                    setSelectedDistrict(null);
                    setSelectedUpazila(null);
                    setSelectedUnion(null);
                    setErrors(e => ({ ...e, division: false }));
                }}
                getOptionLabel={(option) => rt.Divisions[option.division]}
                renderInput={(params) => {
                    return (
                        <TextField
                            {...params}
                            label={rt.Divisions.Division}
                            error={errors.division}
                            helperText={errors.division ? 'Please select a division' : ''}
                        />
                    );
                }}
            />

            <Autocomplete
                options={selectedDivision ? selectedDivision.districts : []}
                value={selectedDistrict}
                onChange={(_, newValue) => {
                    setSelectedDistrict(newValue);
                    setSelectedUpazila(null);
                    setSelectedUnion(null);
                    setErrors(e => ({ ...e, district: false }));
                }}
                getOptionLabel={(option) => rt.Districts[option.district]}
                renderInput={(params) => {
                    return (
                        <TextField
                            {...params}
                            label={rt.Districts.District}
                            error={errors.district}
                            helperText={errors.district ? 'Please select a district' : ''}
                            disabled={!selectedDivision}
                        />
                    );
                }}
            />

            <Autocomplete
                options={selectedDistrict ? selectedDistrict.upazilas : []}
                value={selectedUpazila}
                onChange={(_, newValue) => {
                    setSelectedUpazila(newValue);
                    setSelectedUnion(null);
                    setErrors(e => ({ ...e, upazila: false }));
                }}
                getOptionLabel={(option) => rt.Upazilas[option.upazila]}
                renderInput={(params) => {
                    return (
                        <TextField
                            {...params}
                            label={rt.Upazilas.Upazila}
                            error={errors.upazila}
                            helperText={errors.upazila ? 'Please select an upazila' : ''}
                            disabled={!selectedDistrict}
                        />
                    );
                }}
            />

            <Autocomplete
                options={selectedUpazila ? selectedUpazila.unions : []}
                value={selectedUnion}
                onChange={(_, newValue) => {
                    setSelectedUnion(newValue);
                    setErrors(e => ({ ...e, union: false }));
                }}
                getOptionLabel={(option) => rt.Unions[option.union]}
                renderInput={(params) => {
                return (
                        <TextField
                            {...params}
                            label={rt.Unions.Union}
                            error={errors.union}
                            helperText={errors.union ? 'Please select a union' : ''}
                            disabled={!selectedUpazila}
                        />
                    );
                }}
            />

            <Autocomplete
                options={selectedUnion ? selectedUnion.mouzas : []}
                value={selectedMouza}
                onChange={(_, newValue) => {
                    setSelectedMouza(newValue);
                    setErrors(e => ({ ...e, mouza: false }));
                }}
                getOptionLabel={(mouza) => rt.Mouzas[mouza]}
                renderInput={(params) => {
                    return (
                        <TextField
                            {...params}
                            label={rt.Mouzas.Mouza}
                            error={errors.mouza}
                            helperText={errors.mouza ? 'Please select a mouza' : ''}
                            disabled={!selectedUnion}
                        />
                    );
                }}
            />
        </Stack>
    );
}
