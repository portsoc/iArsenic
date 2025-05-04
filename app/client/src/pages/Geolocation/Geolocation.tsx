import { Typography, Button, Stack, FormControl, FormControlLabel, Radio, RadioGroup, Card, Box, CircularProgress, Collapse } from "@mui/material";
import { useEffect, useState } from "react";
import { navigate } from "wouter/use-browser-location";
import { AccessToken, Well } from "iarsenic-types";
import AccessTokenRepo from "../../utils/AccessTokenRepo";
import GeolocationButton from "./GeolocationButton";
import { useRoute } from "wouter";
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import { LatLngExpression } from "leaflet";
import getMapPin from "../../utils/getMapPin";
import MapFocus from "./MapFocus";

export type RegionErrors = {
    division: boolean;
    district: boolean;
    upazila: boolean;
    union: boolean;
    mouza: boolean;
    withWell: boolean;
};

export default function Region(): JSX.Element {
    const position: LatLngExpression = [23.8041, 90.4152];
    const [, params] = useRoute('/well/:id/region');
    const wellId = params?.id;
    const [well, setWell] = useState<Well>();
    const [token, setToken] = useState<AccessToken>();

    const [division, setDivision] = useState<string | null>(null);
    const [district, setDistrict] = useState<string | null>(null);
    const [upazila, setUpazila] = useState<string | null>(null);
    const [union, setUnion] = useState<string | null>(null);
    const [mouza, setMouza] = useState<string | null>(null);
    const [withWell, setWithWell] = useState<boolean>(false);
    const [errors, setErrors] = useState<RegionErrors>({
        division: false,
        district: false,
        upazila: false,
        union: false,
        mouza: false,
        withWell: false,
    });
    const [regionGeovalidated, setRegionGeovalidated] = useState<boolean>(false);
    const [geolocation, setGeolocation] = useState<[number, number]>();

    useEffect(() => {
        async function fetchToken() {
            const token = await AccessTokenRepo.get();
            if (token == null) return;

            setToken(token);
        }

        fetchToken();
    }, []);

    useEffect(() => {
        async function fetchWell() {
            if (!wellId) return;

            const headers: HeadersInit = {};

            if (token) {
                headers['authorization'] = `Bearer ${token.id}`;
            }

            const result = await fetch(
                `/api/v1/self/well/${wellId}`, {
                    headers,
                }
            );

            if (!result.ok) {
                console.error('Failed to fetch well:', result);
                return;
            }

            const well = await result.json();

            setWell(well);

            if (well.geolocation) {
                setGeolocation(well.geolocation)
                setWithWell(true)
            }
        }

        fetchWell();
    }, [token, wellId]);

    if (!well) {
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
                }}
            >
                <Typography marginBottom='1rem' textAlign='center' variant='h5'>
                    Are you currently with the well?
                </Typography>

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
                            setErrors(e => ({ ...e, wellStaining: false }));
                        }}
                    >
                        <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                        <FormControlLabel value="no" control={<Radio />} label="No" />
                    </RadioGroup>
                    {errors.withWell &&
                        <Typography color="error">
                            Please select whether you are currently near the well
                        </Typography>
                    }
                </FormControl>
            </Card>

            <Collapse 
                in={withWell || (geolocation != null)} 
                sx={{
                    margin: '0 1rem 1rem 1rem',
                    width: '100%',
                }}
            >
                <Card
                    raised
                    variant='outlined'
                    sx={{
                        padding: '1rem',
                        alignItems: 'center',
                    }}
                >
                    <Typography marginBottom='1rem' textAlign='center' variant='h5' mb={4}>
                        Identify Region With Geolocation
                    </Typography>

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
                </Card>
            </Collapse>

            <Button
                sx={{ width: '90%', height: '4rem' }}
                variant='contained'
                onClick={async () => {
                    const regionKeyValid = division &&
                        district &&
                        upazila &&
                        union &&
                        mouza;

                    const headers: HeadersInit = {};
                    if (token) {
                        headers['authorization'] = `Bearer ${token.id}`;
                    }
                
                    if (!regionKeyValid) {
                        console.log('regionKey not valid')
                        navigate(`/well/${wellId}/select-region`);
                        return;
                    }
                
                    const body: { 
                        division: string,
                        district: string,
                        upazila: string,
                        union: string,
                        mouza: string,
                        geolocation?: [number, number] 
                    } = {
                        division: division,
                        district: district,
                        upazila: upazila,
                        union: union,
                        mouza: mouza,
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
                }}
            >
                Next Step
            </Button>
        </>
    );
}
