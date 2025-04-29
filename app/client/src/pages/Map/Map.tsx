import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './map.css';
import { CircularProgress, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { LatLngExpression, GeoJSON } from 'leaflet';
import { Well, AccessToken, Prediction } from 'iarsenic-types';
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

        const res = await fetch(`/api/v1/well/`, {
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

    async function getWellPredictions() {
        if (!token || !wells) return;
    
        // use body because query parameters might get too long
        const res = await fetch('/api/v1/prediction', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'authorization': `Bearer ${token.id}`,
            },
            body: JSON.stringify({ wellIds: wells.map(w => w.id) })
          });
    
        if (!res.ok) {
            throw new Error(`Failed to fetch predictions: ${res.status}`);
        }
    
        const data = await res.json();
        setPredictions(data.predictions);
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

    if (!interactiveMap || !wells || !regionTranslations || !predictions) return (
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
                <Markers wells={wells} predictions={predictions} regionTranslations={regionTranslations} />
            </MapContainer>
        </Stack>
    );
}
