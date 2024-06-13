import { Typography, Autocomplete, TextField, Button, Stack } from "@mui/material";
import config from "../../config";
import { useEffect, useState } from "react";
import { navigate } from "wouter/use-browser-location";
import { DropdownDistrict, DropdownDivision, DropdownUnion, DropdownUpazila } from "../../types";
import PredictorsStorage from "../../utils/PredictorsStorage";

export default function Region(): JSX.Element {
    const [dropdownData, setDropdownData] = useState<DropdownDivision[]>([]);
    const [selectedDivision, setSelectedDivision] = useState<DropdownDivision | null>(null);
    const [selectedDistrict, setSelectedDistrict] = useState<DropdownDistrict | null>(null);
    const [selectedUpazila, setSelectedUpazila] = useState<DropdownUpazila | null>(null);
    const [selectedUnion, setSelectedUnion] = useState<DropdownUnion | null>(null);
    const [selectedMouza, setSelectedMouza] = useState<string | null>(null);
    const [errors, setErrors] = useState({
        division: false,
        district: false,
        upazila: false,
        union: false,
        mouza: false
    });

    const districtOptions = selectedDivision?.districts || [];
    const upazilaOptions = selectedDistrict?.upazilas || [];
    const unionOptions = selectedUpazila?.unions || [];

    async function fetchDropdownData() {
        const response = await fetch(`${config.basePath}/model5/dropdown-data.json`);
        const data = await response.json();
        setDropdownData(data);
    }

    function handleValidation() {
        const newErrors = {
            division: !selectedDivision,
            district: !selectedDistrict,
            upazila: !selectedUpazila,
            union: !selectedUnion,
            mouza: !selectedMouza
        };
        setErrors(newErrors);

        return !Object.values(newErrors).some(value => value);
    }

    useEffect(() => {
        fetchDropdownData();
    }, []);

    return (
        <>
            <Typography alignSelf='center' variant="h4">Region</Typography>

            <Stack width='90%' spacing={2}>
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
                    getOptionLabel={(option) => option.division}
                    renderInput={(params) => {
                        return (
                            <TextField {...params} label="Division"
                                error={errors.division}
                                helperText={errors.division ? 'Please select a division' : ''}
                            />
                        );
                    }}
                />

                <Autocomplete
                    options={districtOptions}
                    value={selectedDistrict}
                    onChange={(_, newValue) => {
                        setSelectedDistrict(newValue);
                        setSelectedUpazila(null);
                        setSelectedUnion(null);
                        setErrors(e => ({ ...e, district: false }));
                    }}
                    getOptionLabel={(option) => option.district}
                    renderInput={(params) => {
                        return (
                            <TextField {...params} label="District"
                                error={errors.district}
                                helperText={errors.district ? 'Please select a district' : ''}
                                disabled={!selectedDivision}
                            />
                        );
                    }}
                />

                <Autocomplete
                    options={upazilaOptions}
                    value={selectedUpazila}
                    onChange={(_, newValue) => {
                        setSelectedUpazila(newValue);
                        setSelectedUnion(null);
                        setErrors(e => ({ ...e, upazila: false }));
                    }}
                    getOptionLabel={(option) => option.upazila}
                    renderInput={(params) => {
                        return (
                            <TextField {...params} label="Upazila"
                                error={errors.upazila}
                                helperText={errors.upazila ? 'Please select an upazila' : ''}
                                disabled={!selectedDistrict}
                            />
                        );
                    }}
                />

                <Autocomplete
                    options={unionOptions}
                    value={selectedUnion}
                    onChange={(_, newValue) => {
                        setSelectedUnion(newValue);
                        setErrors(e => ({ ...e, union: false }));
                    }}
                    getOptionLabel={(option) => option.union}
                    renderInput={(params) => {
                    return (
                            <TextField {...params} label="Union"
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
                            <TextField {...params} label="Mouza"
                                error={errors.mouza}
                                helperText={errors.mouza ? 'Please select a mouza' : ''}
                                disabled={!selectedUnion}
                            />
                        );
                    }}
                />
            </Stack>

            <Button
                sx={{ width: '90%', height: '4rem' }}
                variant='contained'
                onClick={() => {
                    if (!handleValidation()) return;

                    // if validation returns true, we know these values are
                    // all strings, check anyway to satisfy TS

                    if (!selectedDivision?.division ||
                        !selectedDistrict?.district ||
                        !selectedUpazila?.upazila ||
                        !selectedUnion?.union ||
                        !selectedMouza
                    ) return;

                    PredictorsStorage.set({
                        regionKey: {
                            division: selectedDivision?.division,
                            district: selectedDistrict?.district,
                            upazila: selectedUpazila?.upazila,
                            union: selectedUnion?.union,
                            mouza: selectedMouza,
                        }
                    });
                    navigate(`${config.basePath}/staining`);
                }}
            >
                Next Step
            </Button>
        </>
    );
}
