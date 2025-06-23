import { Box, CircularProgress, FormControl, FormControlLabel, Radio, RadioGroup, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { navigate } from "wouter/use-browser-location";
import { useRoute } from "wouter";
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import { LatLngExpression } from "leaflet";
import getMapPin from "../../utils/getMapPin";
import MapFocus from "./MapFocus";
import Collapse from "@mui/material/Collapse";
import WellDataEntryLayout from "../../components/WellDataEntryLayout";
import PageCard from "../../components/PageCard";
import TranslatableText from "../../components/TranslatableText";
import GeolocationButton from "./GeolocationButton";
import { useWells } from "../../utils/useWells";

export type RegionErrors = {
    withWell: boolean;
};

export default function Region(): JSX.Element {
    const position: LatLngExpression = [23.8041, 90.4152];
    const [, params] = useRoute('/well/:id/region');
    const wellId = params?.id;

    const { getWell, updateWell } = useWells();
    const { data: well, isLoading } = getWell(wellId);
    const updateWellMutation = updateWell();

    const [division, setDivision] = useState<string>();
    const [district, setDistrict] = useState<string>();
    const [upazila, setUpazila] = useState<string>();
    const [union, setUnion] = useState<string>();
    const [mouza, setMouza] = useState<string>();
    const [withWell, setWithWell] = useState<boolean>();
    const [errors, setErrors] = useState<RegionErrors>({ withWell: false });
    const [regionGeovalidated, setRegionGeovalidated] = useState<boolean>(false);
    const [geolocation, setGeolocation] = useState<[number, number] | ''>('');

    useEffect(() => {
        if (!well) return

        if (well.geolocation) {
            setGeolocation(well.geolocation)
            setWithWell(true)
        } 
    }, [well]);

    async function handleNext() {
        if (!wellId) return;

        if (withWell == null) {
            setErrors({ withWell: true });
            return;
        }

        const regionKeyValid = division && district && upazila && union && mouza;

        if (!regionKeyValid) {
            navigate(`/well/${wellId}/select-region`);
            return;
        }

        try {
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

            await updateWellMutation.mutateAsync({
                wellId,
                data: body,
            });

            navigate(`/well/${wellId}/staining`);
        } catch (err) {
            console.error('Failed to update well:', err);
        }
    }

    if (isLoading || !well) {
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
                        value={
                            withWell === undefined ?
                            '' : 
                            withWell ?
                            'yes' :
                            'no'
                        }
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
                in={withWell || (geolocation !== '')}
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
                                center={
                                    geolocation === '' ? 
                                    position :
                                    geolocation
                                }
                                zoom={geolocation === '' ? 6 : 11}
                                style={{ width: '100%', height: '100%' }}
                            >
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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
