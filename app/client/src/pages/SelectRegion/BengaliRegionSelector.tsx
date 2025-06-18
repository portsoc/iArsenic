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
                getOptionLabel={(option) => rt.Divisions[option.division.toLowerCase()] || option.division}
                noOptionsText=""
                renderInput={(params) => {
                    return (
                        <TextField
                            {...params}
                            label={rt.Divisions.division}
                            error={errors.division}
                            helperText={errors.division ? 'অনুগ্রহ করে একটি বিভাগ নির্বাচন করুন' : ''} // chatgpt generated
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
                getOptionLabel={(option) => rt.Districts[option.district.toLowerCase()] || option.district}
                noOptionsText=""
                renderInput={(params) => {
                    return (
                        <TextField
                            {...params}
                            label={rt.Districts.district}
                            error={errors.district}
                            helperText={errors.district ? 'অনুগ্রহ করে একটি জেলা নির্বাচন করুন' : ''} // chatgpt generated
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
                getOptionLabel={(option) => rt.Upazilas[option.upazila.toLowerCase()] || option.upazila}
                noOptionsText=""
                renderInput={(params) => {
                    return (
                        <TextField
                            {...params}
                            label={rt.Upazilas.upazila}
                            error={errors.upazila}
                            helperText={errors.upazila ? 'অনুগ্রহ করে একটি উপজেলা নির্বাচন করুন' : ''} // chatgpt generated
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
                getOptionLabel={(option) => rt.Unions[option.union.toLowerCase()] || option.union}
                noOptionsText=""
                renderInput={(params) => {
                return (
                        <TextField
                            {...params}
                            label={rt.Unions.union}
                            error={errors.union}
                            helperText={errors.union ? 'অনুগ্রহ করে একটি ইউনিয়ন নির্বাচন করুন' : ''} // chatgpt generated
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
                getOptionLabel={(mouza) => rt.Mouzas[mouza.toLowerCase()] || mouza}
                noOptionsText=""
                renderInput={(params) => {
                    return (
                        <TextField
                            {...params}
                            label={rt.Mouzas.mouza}
                            error={errors.mouza}
                            helperText={errors.mouza ? 'অনুগ্রহ করে একটি মৌজা নির্বাচন করুন' : ''} // chatgpt generated
                            disabled={!selectedUnion}
                        />
                    );
                }}
            />
        </Stack>
    );
}
