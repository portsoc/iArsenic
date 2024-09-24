import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './map.css';
import { CircularProgress, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { LatLngExpression, GeoJSON } from 'leaflet';
import config from '../../config';
import { Well, AccessToken } from 'shared';
import { RegionTranslations } from '../../types';
import RegionTranslationsFetcher from '../../utils/RegionTranslationsFetcher';
import Markers from './markers';
import UpaMap from './upaMap';
import AccessTokenRepo from '../../utils/AccessTokenRepo';

export default function Map() {
    const position: LatLngExpression = [23.8041, 90.4152];
    const [interactiveMap, setInteractiveMap] = useState<GeoJSON>();
    const [token, setToken] = useState<AccessToken>();
    const [wells, setWells] = useState<Well[]>();
    const [regionTranslations, setRegionTranslations] = useState<RegionTranslations>();

    async function getInteractiveMap() {
        const res = await fetch(`${config.basePath}/interactive-map.geojson`);
        const mapData = await res.json();
        setInteractiveMap(mapData);
    }

    async function getPredictionPinData() {
        if (!token) return;

        const res = await fetch(`${config.basePath}/api/v1/well/`, {
            headers: {
                'authorization': `Bearer ${token.id}`
            }
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch well data:, ${res}`);
        }

        const data = await res.json();
        setWells(data.wells);
    }

    async function getRegionTranslations() {
        const translations = await RegionTranslationsFetcher();
        setRegionTranslations(translations);
    }

    useEffect(() => {
        async function fetchToken() {
            const token = await AccessTokenRepo.get();
            if (token == null) return;

            setToken(token);
        }

        fetchToken();
        getRegionTranslations();
        getInteractiveMap();
    }, []);

    useEffect(() => {
        getPredictionPinData();
    },  [token]);

    if (!interactiveMap || !wells || !regionTranslations) return (
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
                <Markers wells={wells} regionTranslations={regionTranslations} />
            </MapContainer>
        </Stack>
    );
}
