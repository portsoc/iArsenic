import { Typography, CircularProgress, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { navigate } from "wouter/use-browser-location";
import { DropdownDistrict, DropdownDivision, DropdownUnion, DropdownUpazila, RegionTranslations } from "../../types";
import EnglishRegionSelector from "./EnglishRegionSelector";
import BengaliRegionSelector from "./BengaliRegionSelector";
import RegionTranslationsFetcher from "../../utils/RegionTranslationsFetcher";
import { useRoute } from "wouter";
import fetchDropdownData from "../../utils/fetchDropdownData";
import { useAccessToken } from "../../utils/useAccessToken";
import PageCard from "../../components/PageCard";
import WellDataEntryLayout from "../../components/WellDataEntryLayout";

export type RegionErrors = {
    division: boolean;
    district: boolean;
    upazila: boolean;
    union: boolean;
    mouza: boolean;
};

export default function Region(): JSX.Element {
    const [, params] = useRoute('/well/:id/select-region');
    const wellId = params?.id;
    const { data: token } = useAccessToken()

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
        mouza: false,
    });
    const [regionTranslations, setRegionTranslations] = useState<RegionTranslations>();

    function handleValidation() {
        const newErrors = {
            division: !selectedDivision,
            district: !selectedDistrict,
            upazila: !selectedUpazila,
            union: !selectedUnion,
            mouza: !selectedMouza,
        };
        setErrors(newErrors);

        return !Object.values(newErrors).some(value => value);
    }

    async function fetchRegionTranslations() {
        const translations = await RegionTranslationsFetcher();
        setRegionTranslations(translations);
    }

    useEffect(() => {
        async function getDropdownData() {
            setDropdownData(await fetchDropdownData());
        }

        getDropdownData();
        fetchRegionTranslations();
    }, []);

    async function handleNext() {
        if (!handleValidation()) return;

        // if validation returns true, we know these values are
        // all strings, check anyway to satisfy TS

        if (!selectedDivision?.division ||
            !selectedDistrict?.district ||
            !selectedUpazila?.upazila ||
            !selectedUnion?.union ||
            !selectedMouza
        ) return;

        const headers: HeadersInit = {};
        if (token) {
            headers['authorization'] = `Bearer ${token.id}`;
        }

        const body: { 
            division: string,
            district: string,
            upazila: string,
            union: string,
            mouza: string,
            geolocation?: [number, number],
        } = {
            division: selectedDivision.division,
            district: selectedDistrict.district,
            upazila: selectedUpazila.upazila,
            union: selectedUnion.union,
            mouza: selectedMouza,
        };

        const res = await fetch(`/api/v1/self/well/${wellId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
            body: JSON.stringify({
                ...body
            })
        });

        if (!res.ok) {
            console.error('Failed to update well:', res);
            return;
        }

        navigate(`/well/${wellId}/staining`);
    }

    if (!regionTranslations) {
        return (
            <Stack direction='column' alignContent='center' justifyContent='center'>
                <CircularProgress />
            </Stack>
        );
    }

    return (
        <WellDataEntryLayout title='Region' onNext={handleNext}>
            <PageCard>
                <Typography marginBottom='1rem' textAlign='center' variant='h5' mb={4}>
                    Enter Region Manually
                </Typography>

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
            </PageCard>
        </WellDataEntryLayout>
    );
}
