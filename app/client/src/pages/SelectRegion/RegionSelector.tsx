import { Typography, Button, CircularProgress, Stack, Card } from "@mui/material";
import { useEffect, useState } from "react";
import { navigate } from "wouter/use-browser-location";
import { DropdownDistrict, DropdownDivision, DropdownUnion, DropdownUpazila, RegionTranslations } from "../../types";
import { AccessToken } from "iarsenic-types";
import AccessTokenRepo from "../../utils/AccessTokenRepo";
import EnglishRegionSelector from "./EnglishRegionSelector";
import BengaliRegionSelector from "./BengaliRegionSelector";
import RegionTranslationsFetcher from "../../utils/RegionTranslationsFetcher";
import { useRoute } from "wouter";
import fetchDropdownData from "../../utils/fetchDropdownData";

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
    const [token, setToken] = useState<AccessToken>();

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
        async function fetchToken() {
            const token = await AccessTokenRepo.get();
            if (token == null) return;

            setToken(token);
        }

        async function getDropdownData() {
            setDropdownData(await fetchDropdownData());
        }

        getDropdownData()
        fetchRegionTranslations();
        fetchToken();
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

            <Card
                raised
                variant='outlined'
                sx={{ 
                    width: '100%', 
                    margin: '0 1rem 1rem 1rem', 
                    padding: '1rem',
                    alignItems: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
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
            </Card>

            <Button
                sx={{ width: '90%', height: '4rem' }}
                variant='contained'
                onClick={async () => {
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
                }}
            >
                Next Step
            </Button>
        </>
    );
}
