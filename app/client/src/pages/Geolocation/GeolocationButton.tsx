import { Button, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import MyLocationIcon from '@mui/icons-material/MyLocation';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

type props = {
    setRegionGeovalidated: (geovalidated: boolean) => void,
    geolocation: [number, number] | undefined,
    setGeolocation: (geolocation: [number, number]) => void,
    setDivision: (selectedDivision: string) => void,
    setDistrict: (selectedDistrict: string) => void,
    setUpazila: (selectedUpazila: string) => void,
    setUnion: (selectedUnion: string) => void,
    setMouza: (selectedMouza: string) => void,
}

export default function GeolocationButton({
    setRegionGeovalidated,
    geolocation,
    setGeolocation,
    setDivision,
    setDistrict,
    setUpazila,
    setUnion,
    setMouza,
}: props): JSX.Element {
    const [geolocationFailed, setGeolocationFailed] = useState<boolean>(false);
    const [geolocationSuccess, setGeolocationSuccess] = useState<boolean>(false);

    const [gettingRegionKey, setGettingRegionKey] = useState<boolean>(false);
    const [regionNotFound, setRegionNotFound] = useState<boolean>(false);

    async function getGeolocation() {
        setGettingRegionKey(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    setGeolocation([latitude, longitude]);
                    await setRegionFromGeolocation([latitude, longitude])
                    setGeolocationSuccess(true)
                },
                (error) => {
                    console.error("Error getting geolocation: ", error);
                    setGeolocationFailed(true);
                }
            );
        } else {
            setGeolocationFailed(true);
            console.error("Geolocation is not supported by this browser.");
        }
    }

    async function setRegionFromGeolocation(geolocation: [number, number]) {
        const response = await fetch(
            `/api/v1/geodata/region-from-point?lat=${geolocation[0]}&lon=${geolocation[1]}`
        );

        if (response.status === 404) {
            setGettingRegionKey(false);
            setRegionNotFound(true);

            return;
        }

        if (!response.ok) {
            console.error("Error getting region from geolocation");
            setGeolocationFailed(true);
            setGettingRegionKey(false);
            return;
        }

        const data = await response.json();

        setDistrict(data.division);
        setDivision(data.district);
        setUpazila(data.upazila);
        setUnion(data.union);
        setMouza(data.mouza);

        setRegionGeovalidated(true);
        setGettingRegionKey(false);
    }

    useEffect(() => {
        if (!geolocation) return;

        setGeolocation(geolocation);
        setRegionFromGeolocation(geolocation);
    }, [geolocation]);

    if (geolocationSuccess) {
        return (
            <Button
                sx={{ height: '3rem', color: 'green', borderColor: 'green' }}
                variant='outlined'
                startIcon={<CheckCircleOutlineIcon />}
                disabled
            >
                Geolocation found successfully
            </Button>
        );
    }

    if (geolocationFailed) {
        return (
            <Button
                sx={{ height: '3rem' }}
                variant='outlined'
                startIcon={<ErrorOutlineIcon />}
                onClick={getGeolocation}
                disabled={true}
            >
                Geolocation not supported
            </Button>
        );
    }

    if (gettingRegionKey) {
        return (
            <Button
                sx={{ height: '3rem' }}
                variant='outlined'
                startIcon={<CircularProgress size={20} />}
                onClick={getGeolocation}
                disabled={true}
            >
                Getting Region
            </Button>
        );
    }

    if (regionNotFound) {
        return (
            <Button
                sx={{ height: '3rem' }}
                variant='outlined'
                startIcon={<ErrorOutlineIcon />}
                onClick={getGeolocation}
                disabled={true}
            >
                Region not found
            </Button>
        );
    }

    return (
        <Button
            sx={{ height: '3rem' }}
            variant='outlined'
            startIcon={<MyLocationIcon />}
            onClick={getGeolocation}
        >
            Use Geolocation
        </Button>
    );
}