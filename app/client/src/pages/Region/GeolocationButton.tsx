import { Button, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import MyLocationIcon from '@mui/icons-material/MyLocation';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { DropdownDistrict, DropdownDivision, DropdownUnion, DropdownUpazila } from "../../types";
import { RegionKey } from "iarsenic-types";

type props = {
    dropdownData: DropdownDivision[],
    setRegionGeovalidated: (geovalidated: boolean) => void,
    geolocation: [number, number] | undefined,
    setGeolocation: (geolocation: [number, number]) => void,
    setSelectedDivision: (selectedDivision: DropdownDivision) => void,
    setSelectedDistrict: (selectedDistrict: DropdownDistrict) => void,
    setSelectedUpazila: (selectedUpazila: DropdownUpazila) => void,
    setSelectedUnion: (selectedUnion: DropdownUnion) => void,
    setSelectedMouza: (selectedMouza: string) => void,
}

export default function GeolocationButton({
    dropdownData,
    setRegionGeovalidated,
    geolocation,
    setGeolocation,
    setSelectedDivision,
    setSelectedDistrict,
    setSelectedUpazila,
    setSelectedUnion,
    setSelectedMouza,
}: props): JSX.Element {
    const [geolocationFailed, setGeolocationFailed] = useState<boolean>(false);
    const [gettingRegionKey, setGettingRegionKey] = useState<boolean>(false);
    const [regionNotFound, setRegionNotFound] = useState<boolean>(false);

    function getGeolocation() {
        setGettingRegionKey(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setGeolocation([latitude, longitude]);
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

    async function setRegionFromGeolocation(geolocation: [number, number], dropdownData: DropdownDivision[]) {
        const response = await fetch(
            `/api/gps-region?lat=${geolocation[0]}&lon=${geolocation[1]}`
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

        if (!data.regionKey) return;

        const geoRegionKey = data.regionKey as RegionKey;
        if (!geoRegionKey.division || !dropdownData) return;
        const selectedDivision = dropdownData.find(d => d.division === geoRegionKey.division);

        if (!selectedDivision) {
            setGettingRegionKey(false);
            return;
        }
        setSelectedDivision(selectedDivision);

        const selectedDistrict = selectedDivision.districts.find(d => d.district === geoRegionKey.district);

        if (!selectedDistrict) {
            setGettingRegionKey(false);
            return;
        }
        setSelectedDistrict(selectedDistrict);

        const selectedUpazila = selectedDistrict.upazilas.find(u => u.upazila === geoRegionKey.upazila);

        if (!selectedUpazila) {
            setGettingRegionKey(false);
            return;
        }
        setSelectedUpazila(selectedUpazila);

        const selectedUnion = selectedUpazila.unions.find(u => u.union === geoRegionKey.union);

        if (!selectedUnion) {
            setGettingRegionKey(false);
            return;
        }
        setSelectedUnion(selectedUnion);

        if (!geoRegionKey.mouza) {
            setGettingRegionKey(false);
            return;
        }
        setSelectedMouza(geoRegionKey.mouza);
        setRegionGeovalidated(true);
        setGettingRegionKey(false);
    }

    useEffect(() => {
        if (!geolocation) return;

        setGeolocation(geolocation);
        setRegionFromGeolocation(geolocation, dropdownData);
    }, [geolocation]);

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