import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './map.css';
import { CircularProgress, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { LatLngExpression, GeoJSON } from 'leaflet';
import { Well, WellSchema } from 'iarsenic-types';
import { RegionTranslations } from '../../types';
import RegionTranslationsFetcher from '../../utils/RegionTranslationsFetcher';
import Markers from './markers';
import UpaMap from './upaMap';
import { useAccessToken } from '../../utils/useAccessToken';

export default function Map() {
    const highlightId = new URLSearchParams(window.location.search).get('highlight');

    const position: LatLngExpression = [23.8041, 90.4152];
    const [interactiveMap, setInteractiveMap] = useState<GeoJSON>();
    const { data: token } = useAccessToken()
    const [wells, setWells] = useState<Well[]>();
    const [regionTranslations, setRegionTranslations] = useState<RegionTranslations>();

    async function getInteractiveMap() {
        const res = await fetch(`/interactive-map.geojson`);
        const mapData = await res.json();
        setInteractiveMap(mapData);
    }

    async function getPredictionPinData() {
        const headers: HeadersInit = {}

        if (token) headers['authorization'] = `Bearer ${token.id}`

        const res = await fetch(`/api/v1/wells`, {
            headers
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch well data:, ${res}`);
        }

        const data = await res.json();
        const wells = data.wells;

        const parsedWells = [];
        for (const well of wells) {
            parsedWells.push(
                WellSchema.parse({
                    ...well,
                    createdAt: new Date(well.createdAt),
                })
            );
        }

        setWells(parsedWells);
    }

    async function getRegionTranslations() {
        const translations = await RegionTranslationsFetcher();
        setRegionTranslations(translations);
    }

    useEffect(() => {

        getRegionTranslations();
        getInteractiveMap();
    }, []);

    useEffect(() => {
        getPredictionPinData();
    }, []);

    if (!interactiveMap || !regionTranslations || !wells) return (
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
                    crossOrigin="anonymous"
                />

                <UpaMap interactiveMap={interactiveMap} regionTranslations={regionTranslations} />
                <Markers wells={wells} regionTranslations={regionTranslations} highlightId={highlightId} />
            </MapContainer>
        </Stack>
    );
}
