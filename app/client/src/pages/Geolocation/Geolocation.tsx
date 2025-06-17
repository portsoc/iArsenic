import { Box, CircularProgress, FormControl, FormControlLabel, Radio, RadioGroup, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { navigate } from "wouter/use-browser-location";
import { Well } from "iarsenic-types";
import { useAccessToken } from "../../utils/useAccessToken";
import GeolocationButton from "./GeolocationButton";
import { useRoute } from "wouter";
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import { LatLngExpression } from "leaflet";
import getMapPin from "../../utils/getMapPin";
import MapFocus from "./MapFocus";
import Collapse from "@mui/material/Collapse";
import WellDataEntryLayout from "../../components/WellDataEntryLayout";
import PageCard from "../../components/PageCard";
import TranslatableText from "../../components/TranslatableText";

export type RegionErrors = {
    withWell: boolean;
};

export default function Region(): JSX.Element {
    const position: LatLngExpression = [23.8041, 90.4152];
    const [, params] = useRoute('/well/:id/region');
    const wellId = params?.id;
    const [well, setWell] = useState<Well>();
    const { data: token } = useAccessToken();

    const [division, setDivision] = useState<string | null>(null);
    const [district, setDistrict] = useState<string | null>(null);
    const [upazila, setUpazila] = useState<string | null>(null);
    const [union, setUnion] = useState<string | null>(null);
    const [mouza, setMouza] = useState<string | null>(null);
    const [withWell, setWithWell] = useState<boolean | null>(null);
    const [errors, setErrors] = useState<RegionErrors>({ withWell: false });
    const [regionGeovalidated, setRegionGeovalidated] = useState<boolean>(false);
    const [geolocation, setGeolocation] = useState<[number, number]>();

    useEffect(() => {
        async function fetchWell() {
            if (!wellId) return;

            const headers: HeadersInit = {};
            if (token) {
                headers['authorization'] = `Bearer ${token.id}`;
            }

            const result = await fetch(`/api/v1/self/well/${wellId}`, { headers });

            if (!result.ok) {
                console.error('Failed to fetch well:', result);
                return;
            }

            const well = await result.json();
            setWell(well);

            if (well.geolocation) {
                setGeolocation(well.geolocation);
                setWithWell(true);
            }
        }

        fetchWell();
    }, [token, wellId]);

    async function handleNext() {
        if (withWell == null) {
            setErrors({ withWell: true });
            return;
        }

        const regionKeyValid = division && district && upazila && union && mouza;

        if (!regionKeyValid) {
            navigate(`/well/${wellId}/select-region`);
            return;
        }

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
            geolocation?: [number, number]
        } = {
            division: division!,
            district: district!,
            upazila: upazila!,
            union: union!,
            mouza: mouza!,
        };

        if (regionGeovalidated && geolocation) {
            body.geolocation = geolocation;
        }

        const res = await fetch(`/api/v1/self/well/${wellId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            console.error('Failed to update well:', res);
            return;
        }

        navigate(`/well/${wellId}/staining`);
    }

    if (!well) {
        return (
            <Stack direction='column' alignContent='center' justifyContent='center'>
                <CircularProgress />
            </Stack>
        );
    }

    return (
        <WellDataEntryLayout
            title={
                <TranslatableText
                    variant="h4"
                    english="Region"
                    bengali="অঞ্চল"
                />
            }
            onNext={handleNext}
        >
            <PageCard>
                <TranslatableText
                    mb='1rem'
                    textAlign="center"
                    variant='h5'
                    english='Are you currently with the well?'
                    bengali='আপনি কি বর্তমানে নলকূপের কাছে আছেন?' // chatgpt generated
                />

                <FormControl
                    error={errors.withWell}
                    component="fieldset"
                    sx={{
                        width: '100%',
                        padding: '1rem',
                        borderRadius: '5px',
                        outline: errors.withWell ? '1px solid red' : 'none',
                    }}
                >
                    <RadioGroup
                        name="well-staining-selector"
                        onChange={event => {
                            setWithWell(event.target.value === 'yes');
                            setErrors({ withWell: false });
                        }}
                    >
                        <FormControlLabel 
                            value="yes" 
                            control={<Radio />} 
                            label={
                                <TranslatableText
                                    variant="body1"
                                    english="Yes"
                                    bengali="হ্যাঁ"
                                />
                            }
                        />
                        <FormControlLabel 
                            value="no" 
                            control={<Radio />} 
                            label={
                                <TranslatableText
                                    variant="body1"
                                    english="No"
                                    bengali="না"
                                />
                            }
                        />
                    </RadioGroup>

                    {errors.withWell && (
                        <TranslatableText 
                            variant='body1'
                            error={true} 
                            english='Please select whether you are currently near the well'
                            bengali='আপনি বর্তমানে নলকূপের কাছে আছেন কি না, তা নির্বাচন করুন' // chatgpt generated
                        />
                    )}
                </FormControl>
            </PageCard>

            <Collapse
                in={withWell || (geolocation != null)}
                sx={{
                    width: '100%',
                }}
            >
                <PageCard sx={{ margin: '0rem 0rem 1rem '}}>
                    <TranslatableText 
                        variant='h5' 
                        mb='2rem'
                        textAlign="center"    
                        english='Identify Region With Geolocation'
                        bengali='অটোমেটিকভাবে জিওলোকেশন ব্যবহার করে অঞ্চল শনাক্ত করুন'
                    />

                    <Stack alignItems='center' width='100%'>
                        <Box mb={4}>
                            <GeolocationButton
                                setRegionGeovalidated={setRegionGeovalidated}
                                geolocation={geolocation}
                                setGeolocation={setGeolocation}
                                setDivision={setDivision}
                                setDistrict={setDistrict}
                                setUpazila={setUpazila}
                                setUnion={setUnion}
                                setMouza={setMouza}
                            />
                        </Box>

                        <Box width='100%' height='400px'>
                            <MapContainer
                                center={geolocation ?? position}
                                zoom={geolocation ? 11 : 7}
                                style={{ width: '100%', height: '100%' }}
                            >
                                <TileLayer
                                    attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                                    crossOrigin="anonymous"
                                />
                                {geolocation && (
                                    <>
                                        <Marker
                                            icon={getMapPin()}
                                            position={geolocation}
                                        />
                                        <MapFocus position={geolocation} />
                                    </>
                                )}
                            </MapContainer>
                        </Box>
                    </Stack>
                </PageCard>
            </Collapse>
        </WellDataEntryLayout>
    );
}
