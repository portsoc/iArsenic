import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './map.css';
import { CircularProgress, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { LatLngExpression, GeoJSON } from 'leaflet';
import { Well, AccessToken, Prediction, WellSchema, PredictionSchema } from 'iarsenic-types';
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
    const [predictions, setPredictions] = useState<Prediction[]>();
    const [regionTranslations, setRegionTranslations] = useState<RegionTranslations>();

    async function getInteractiveMap() {
        const res = await fetch(`/interactive-map.geojson`);
        const mapData = await res.json();
        setInteractiveMap(mapData);
    }

    async function getPredictionPinData() {
        if (!token) return;

        const res = await fetch(`/api/v1/wells`, {
            headers: {
                'authorization': `Bearer ${token.id}`
            }
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch well data:, ${res}`);
        }

        const data = (await res.json());
        const wells = data.wells

        const parsedWells = []
        for (const well of wells) {
            parsedWells.push(
                WellSchema.parse({
                    ...well,
                    createdAt: new Date(well.createdAt),
                })
            )
        }

        setWells(parsedWells);
    }

    async function getWellPredictions() {
        if (!token || !wells) return;
    
        const BATCH_SIZE = 25;
        const parsedPredictions = [];

        const geoWells = wells.filter(w => Array.isArray(w.geolocation))
    
        for (let i = 0; i < geoWells.length; i += BATCH_SIZE) {
            const batch = wells.slice(i, i + BATCH_SIZE);
            const query = batch.map(w => `wellId=${encodeURIComponent(w.id)}`).join('&');
    
            const res = await fetch(`/api/v1/prediction/query?${query}`, {
                method: 'GET',
                headers: {
                    authorization: `Bearer ${token.id}`,
                },
            });
    
            if (!res.ok) {
                console.warn(`Failed to fetch predictions: ${res.status}`);
                continue;
            }
    
            const data = await res.json();
    
            for (const p of data.predictions) {
                parsedPredictions.push(
                    PredictionSchema.parse({
                        ...p,
                        createdAt: new Date(p.createdAt),
                    })
                );
            }
        }
    
        setPredictions(parsedPredictions);
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
    }, [token]);

    useEffect(() => {
        if (!wells) return
        getWellPredictions()
    }, [wells])

    if (!interactiveMap || !regionTranslations || !predictions || !wells) return (
        <Stack alignItems='center' justifyContent='center'>
            <CircularProgress />
        </Stack>
    );

    return (
        <Stack direction='column' justifyContent='center' alignItems='center'>
            <MapContainer center={position} zoom={7} scrollWheelZoom={true}>
                <TileLayer
                    attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    crossOrigin="anonymous"
                />

                <UpaMap interactiveMap={interactiveMap} regionTranslations={regionTranslations} />
                <Markers wells={wells} predictions={predictions} regionTranslations={regionTranslations} />
            </MapContainer>
        </Stack>
    );
    
}
