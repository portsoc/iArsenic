import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './map.css';
import { CircularProgress, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { LatLngExpression, GeoJSON } from 'leaflet';
import config from '../../config';
import { SessionData } from '../../types';
import { RegionTranslations } from '../../types';
import RegionTranslationsFetcher from '../../utils/RegionTranslationsFetcher';
import Markers from './markers';
import UpaMap from './upaMap';

export default function Map() {
    const position: LatLngExpression = [23.8041, 90.4152];
    const [interactiveMap, setInteractiveMap] = useState<GeoJSON>();
    const [sessionData, setSessionData] = useState<SessionData[]>();
    const [regionTranslations, setRegionTranslations] = useState<RegionTranslations>();

    async function getInteractiveMap() {
        const res = await fetch(`${config.basePath}/interactive-map.geojson`);
        const mapData = await res.json();
        setInteractiveMap(mapData);
    }

    async function getPredictionPinData() {
        const res = await fetch(`${config.basePath}/api/predictions`);
        const predictions = await res.json();
        setSessionData(predictions.data);
    }

    async function getRegionTranslations() {
        const translations = await RegionTranslationsFetcher();
        setRegionTranslations(translations);
    }

    useEffect(() => {
        getRegionTranslations();
        getInteractiveMap();
        getPredictionPinData();
    }, []);

    if (!interactiveMap || !sessionData || !regionTranslations) return (
        <Stack alignItems='center' justifyContent='center'>
            <CircularProgress />
        </Stack>
    );

    return (
        <Stack direction='column' justifyContent='center' alignItems='center'>
            <MapContainer center={position} zoom={7} scrollWheelZoom={true}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <UpaMap interactiveMap={interactiveMap} regionTranslations={regionTranslations} />
                <Markers sessionData={sessionData} regionTranslations={regionTranslations} />
            </MapContainer>
        </Stack>
    );
}
