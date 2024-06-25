import { Typography, Button, CircularProgress, Stack } from "@mui/material";
import config from "../../config";
import { useEffect, useState } from "react";
import { navigate } from "wouter/use-browser-location";
import { DropdownDistrict, DropdownDivision, DropdownUnion, DropdownUpazila, RegionKey, RegionTranslations } from "../../types";
import PredictorsStorage from "../../utils/PredictorsStorage";
import EnglishRegionSelector from "./EnglishRegionSelector";
import BengaliRegionSelector from "./BengaliRegionSelector";
import MyLocationIcon from '@mui/icons-material/MyLocation';

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
    const [geolocation, setGeolocation] = useState<[number, number]>(); // latitude, longitude
    const [geolocationFailed, setGeolocationFailed] = useState<boolean>(false);

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

    function getGeolocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
                    console.log(`${latitude}, ${longitude}`);
                    setGeolocation([latitude, longitude]);
                },
                (error) => {
                    console.error("Error getting geolocation: ", error);
                }
            );
        } else {
            setGeolocationFailed(true);
            console.error("Geolocation is not supported by this browser.");
        }
    }

    async function setRegionFromGeolocation(geolocation: [number, number]) {
        const response = await fetch(
            `${config.basePath}/api/gps-region?lat=${geolocation[0]}&lon=${geolocation[1]}`
        );

        if (!response.ok) {
            console.error("Error getting region from geolocation");
            return;
        }

        const data = await response.json();

        if (!data.regionKey) return;

        const geoRegionKey = data.regionKey as RegionKey;
        if (!geoRegionKey.division || !dropdownData) return;
        const selectedDivision = dropdownData.find(d => d.division === geoRegionKey.division);

        if (!selectedDivision) return;
        setSelectedDivision(selectedDivision);

        const selectedDistrict = selectedDivision.districts.find(d => d.district === geoRegionKey.district);

        if (!selectedDistrict) return;
        setSelectedDistrict(selectedDistrict);

        const selectedUpazila = selectedDistrict.upazilas.find(u => u.upazila === geoRegionKey.upazila);

        if (!selectedUpazila) return;
        setSelectedUpazila(selectedUpazila);

        const selectedUnion = selectedUpazila.unions.find(u => u.union === geoRegionKey.union);

        if (!selectedUnion) return;
        setSelectedUnion(selectedUnion);

        if (!geoRegionKey.mouza) return;
        setSelectedMouza(geoRegionKey.mouza);
    }

    useEffect(() => {
        fetchDropdownData();
        fetchRegionTranslations();
        getGeolocation();
    }, []);

    useEffect(() => {
        if (!geolocation) return;

        setRegionFromGeolocation(geolocation);
    }, [geolocation]);

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

            {geolocationFailed ? (
                    <Typography>
                        Geolocation is not supported.
                    </Typography>
                ) : (
                    <Button
                        sx={{ height: '3rem' }}
                        variant='outlined'
                        startIcon={<MyLocationIcon />}
                        onClick={getGeolocation}
                    >
                        Use Geolocation
                    </Button>
                )
            }

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
