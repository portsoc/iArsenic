import { Stack, TextField, Autocomplete } from "@mui/material";
import {
    DropdownDivision,
    DropdownDistrict,
    DropdownUpazila,
    DropdownUnion,
    RegionTranslations,
} from "../../types";
import { RegionErrors } from "./RegionSelector";

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

export default function BengaliRegionSelector({
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
                    setSelectedMouza(null);
                    setErrors(e => ({ ...e, division: false }));
                }}
                getOptionLabel={(option) => rt.Divisions[option.division] || option.division}
                noOptionsText=""
                renderInput={(params) => {
                    return (
                        <TextField
                            {...params}
                            label={rt.Divisions.Division}
                            error={errors.division}
                            helperText={errors.division ? 'BENGALI PLACEHOLDER' : ''}
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
                    setSelectedMouza(null);
                    setErrors(e => ({ ...e, district: false }));
                }}
                getOptionLabel={(option) => rt.Districts[option.district] || option.district}
                noOptionsText=""
                renderInput={(params) => {
                    return (
                        <TextField
                            {...params}
                            label={rt.Districts.District}
                            error={errors.district}
                            helperText={errors.district ? 'BENGALI PLACEHOLDER' : ''}
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
                    setSelectedMouza(null);
                    setErrors(e => ({ ...e, upazila: false }));
                }}
                getOptionLabel={(option) => rt.Upazilas[option.upazila] || option.upazila}
                noOptionsText=""
                renderInput={(params) => {
                    return (
                        <TextField
                            {...params}
                            label={rt.Upazilas.Upazila}
                            error={errors.upazila}
                            helperText={errors.upazila ? 'BENGALI PLACEHOLER' : ''}
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
                    setSelectedMouza(null);
                    setErrors(e => ({ ...e, union: false }));
                }}
                getOptionLabel={(option) => rt.Unions[option.union] || option.union}
                noOptionsText=""
                renderInput={(params) => {
                return (
                        <TextField
                            {...params}
                            label={rt.Unions.Union}
                            error={errors.union}
                            helperText={errors.union ? 'BENGALI PLACEHOLER' : ''}
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
                getOptionLabel={(mouza) => rt.Mouzas[mouza] || mouza}
                noOptionsText=""
                renderInput={(params) => {
                    return (
                        <TextField
                            {...params}
                            label={rt.Mouzas.Mouza}
                            error={errors.mouza}
                            helperText={errors.mouza ? 'BENGALI PLACEHOLER' : ''}
                            disabled={!selectedUnion}
                        />
                    );
                }}
            />
        </Stack>
    );
}
