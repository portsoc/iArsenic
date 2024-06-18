import { Typography, Button, CircularProgress, Stack } from "@mui/material";
import config from "../../config";
import { useEffect, useState } from "react";
import { navigate } from "wouter/use-browser-location";
import { DropdownDistrict, DropdownDivision, DropdownUnion, DropdownUpazila, RegionTranslations } from "../../types";
import PredictorsStorage from "../../utils/PredictorsStorage";
import EnglishRegionSelector from "./EnglishRegionSelector";
import BengaliRegionSelector from "./BengaliRegionSelector";

export type RegionErrors = {
    division: boolean;
    district: boolean;
    upazila: boolean;
    union: boolean;
    mouza: boolean;
};

export default function Region(): JSX.Element {
    const [dropdownData, setDropdownData] = useState<DropdownDivision[]>([]);
    const [selectedDivision, setSelectedDivision] = useState<DropdownDivision | null>(null);
    const [selectedDistrict, setSelectedDistrict] = useState<DropdownDistrict | null>(null);
    const [selectedUpazila, setSelectedUpazila] = useState<DropdownUpazila | null>(null);
    const [selectedUnion, setSelectedUnion] = useState<DropdownUnion | null>(null);
    const [selectedMouza, setSelectedMouza] = useState<string | null>(null);
    const [errors, setErrors] = useState<RegionErrors>({
        division: false,
        district: false,
        upazila: false,
        union: false,
        mouza: false
    });
    const [regionTranslations, setRegionTranslations] = useState<RegionTranslations>();

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

    async function fetchRegionTranslations() {
        const response = await fetch(`${config.basePath}/region-translations.json`);
        const data = await response.json();
        setRegionTranslations(data);
    }

    useEffect(() => {
        fetchDropdownData();
        fetchRegionTranslations();
    }, []);

    if (!regionTranslations) {
        return (
            <Stack direction='column' alignContent='center' justifyContent='center'>
                <CircularProgress />
            </Stack>
        );
    }

    return (
        <>
            <Typography alignSelf='center' variant="h4">Region</Typography>

            <EnglishRegionSelector
                dropdownData={dropdownData}
                selectedDivision={selectedDivision}
                setSelectedDivision={setSelectedDivision}
                selectedDistrict={selectedDistrict}
                setSelectedDistrict={setSelectedDistrict}
                selectedUpazila={selectedUpazila}
                setSelectedUpazila={setSelectedUpazila}
                selectedUnion={selectedUnion}
                setSelectedUnion={setSelectedUnion}
                selectedMouza={selectedMouza}
                setSelectedMouza={setSelectedMouza}
                errors={errors}
                setErrors={setErrors}
            />

            <BengaliRegionSelector
                dropdownData={dropdownData}
                selectedDivision={selectedDivision}
                setSelectedDivision={setSelectedDivision}
                selectedDistrict={selectedDistrict}
                setSelectedDistrict={setSelectedDistrict}
                selectedUpazila={selectedUpazila}
                setSelectedUpazila={setSelectedUpazila}
                selectedUnion={selectedUnion}
                setSelectedUnion={setSelectedUnion}
                selectedMouza={selectedMouza}
                setSelectedMouza={setSelectedMouza}
                errors={errors}
                setErrors={setErrors}
                rt={regionTranslations}
            />

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
