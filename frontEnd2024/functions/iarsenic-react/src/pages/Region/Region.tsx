import { Typography, Autocomplete, TextField, Button, Stack, CircularProgress } from "@mui/material";
import config from "../../config";
import { useEffect, useState } from "react";
import { navigate } from "wouter/use-browser-location";
import { DropdownDistrict, DropdownDivision, DropdownUnion, DropdownUpazila, RegionTranslations } from "../../types";
import PredictorsStorage from "../../utils/PredictorsStorage";
import LanguageSelector from "../../utils/LanguageSelector";

export default function Region(): JSX.Element {
    const [language, setLanguage] = useState<'english' | 'bengali'>();
    const [translations, setTranslations] = useState<RegionTranslations>();
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

    async function fetchTranslations() {
        const response = await fetch(`${config.basePath}/region-translations.json`);
        const data = await response.json();

        setTranslations(data);
    }

    useEffect(() => {
        fetchDropdownData();
        setLanguage(LanguageSelector.get());
    }, []);

    useEffect(() => {
        if (language === 'bengali') {
            fetchTranslations();
        }

    }, [language]);

    if ((!language || !dropdownData) || (language === 'bengali' && !translations)) {
        return (
            <Stack alignContent='center' justifyContent='center'>
                <CircularProgress />
            </Stack>
        );
    }

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
                    getOptionLabel={(option) => {
                        if (language === 'english') return option.division;
                        if (!translations) throw new Error('Translations not loaded');
                        return translations.Districts[option.division];
                    }}
                    renderInput={(params) => {
                        const label = (() => {
                            if (language === 'english') return "Division";
                            if (!translations) throw new Error('Translations not loaded');
                            return translations.Divisions['Division'];
                        })();

                        return (
                            <TextField
                                {...params}
                                label={label}
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
                    getOptionLabel={(option) => {
                        if (language === 'english') return option.district;
                        if (!translations) throw new Error('Translations not loaded');
                        return translations.Districts[option.district];
                    }}
                    renderInput={(params) => {
                        const label = (() => {
                            if (language === 'english') return "District";
                            if (!translations) throw new Error('Translations not loaded');
                            return translations.Districts['District'];
                        })();

                        return (
                            <TextField
                                {...params}
                                label={label}
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
                    getOptionLabel={(option) => {
                        if (language === 'english') return option.upazila;
                        if (!translations) throw new Error('Translations not loaded');
                        return translations.Upazilas[option.upazila];
                    }}
                    renderInput={(params) => {
                        const label = (() => {
                            if (language === 'english') return "Upazila";
                            if (!translations) throw new Error('Translations not loaded');
                            return translations.Districts['Upazila'];
                        })();

                        return (
                            <TextField
                                {...params}
                                label={label}
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
                    getOptionLabel={(option) => {
                        if (language === 'english') return option.union;
                        if (!translations) throw new Error('Translations not loaded');
                        return translations.Unions[option.union];
                    }}
                    renderInput={(params) => {
                        const label = (() => {
                            if (language === 'english') return "Union";
                            if (!translations) throw new Error('Translations not loaded');
                            return translations.Unions['Union'];
                        })();

                        return (
                            <TextField
                                {...params}
                                label={label}
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
                    getOptionLabel={(option) => {
                        if (language === 'english') return option;
                        if (!translations) throw new Error('Translations not loaded');
                        return translations.Mouzas[option];
                    }}
                    renderInput={(params) => {
                        const label = (() => {
                            if (language === 'english') return "Mouza";
                            if (!translations) throw new Error('Translations not loaded');
                            return translations.Mouzas['Mouza'];
                        })();

                        return (
                            <TextField
                                {...params}
                                label={label}
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
