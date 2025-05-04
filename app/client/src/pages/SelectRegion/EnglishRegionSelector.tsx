import { Stack, TextField, Autocomplete } from "@mui/material";
import {
    DropdownDivision,
    DropdownDistrict,
    DropdownUpazila,
    DropdownUnion,
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
}: props) {
    return (
        <Stack className='english' width='90%' spacing={2}>
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
                getOptionLabel={(option) => option.division}
                renderInput={(params) => {
                    return (
                        <TextField
                            {...params}
                            label="Division"
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
                    setSelectedMouza(null);
                    setErrors(e => ({ ...e, district: false }));
                }}
                getOptionLabel={(option) => option.district}
                renderInput={(params) => {
                    return (
                        <TextField
                            {...params}
                            label="District"
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
                    setSelectedMouza(null);
                    setErrors(e => ({ ...e, upazila: false }));
                }}
                getOptionLabel={(option) => option.upazila}
                renderInput={(params) => {
                    return (
                        <TextField
                            {...params}
                            label="Upazila"
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
                    setSelectedMouza(null);
                    setErrors(e => ({ ...e, union: false }));
                }}
                getOptionLabel={(option) => option.union}
                renderInput={(params) => {
                return (
                        <TextField
                            {...params}
                            label="Union"
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
                getOptionLabel={(mouza) => mouza}
                renderInput={(params) => {
                    return (
                        <TextField
                            {...params}
                            label="Mouza"
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
