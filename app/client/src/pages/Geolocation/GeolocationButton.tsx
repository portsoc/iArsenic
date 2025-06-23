import { Button, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import MyLocationIcon from '@mui/icons-material/MyLocation';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import TranslatableText from "../../components/TranslatableText";

type props = {
    setRegionGeovalidated: (geovalidated: boolean) => void,
    geolocation: [number, number] | '',
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
                    await setRegionFromGeolocation([latitude, longitude]);
                    setGeolocationSuccess(true);
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
                <TranslatableText
                    variant='body1'
                    english='Geolocation found successfully'
                    bengali='জিওলোকেশন সফলভাবে পাওয়া গেছে' // chatgpt generated
                />
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
                <TranslatableText
                    variant='body1'
                    english='Geolocation not supported'
                    bengali='জিওলোকেশন সমর্থিত নয়' // chatgpt generated
                />
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
                <TranslatableText
                    variant='body1'
                    english='Getting Region'
                    bengali='অঞ্চলের তথ্য সংগ্রহ করা হচ্ছে' // chatgpt generated
                />
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
                <TranslatableText
                    variant='body1'
                    english='Region not found'
                    bengali='অঞ্চল পাওয়া যায়নি' // chatgpt generated
                />
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
            <TranslatableText
                variant='body1'
                english='Use Geolocation'
                bengali='জিওলোকেশন ব্যবহার করুন' // chatgpt generated
            />
        </Button>
    );
}