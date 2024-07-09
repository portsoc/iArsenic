import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './map.css';
import { CircularProgress, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { LatLngExpression } from 'leaflet';
import config from '../../config';
import { SessionData } from '../../types';
import ReactDOMServer from 'react-dom/server';
import { RegionTranslations } from '../../types';
import RegionTranslationsFetcher from '../../utils/RegionTranslationsFetcher';
import Markers from './markers';

export default function Map() {
    const position: LatLngExpression = [23.8041, 90.4152];
    const [interactiveMap, setInteractiveMap] = useState();
    const [sessionData, setSessionData] = useState<SessionData[]>();
    const [regionTranslations, setRegionTranslations] = useState<RegionTranslations>();

    async function getInteractiveMap() {
        const res = await fetch(`${config.basePath}/api/interactive-map`);
        const mapData = await res.json();
        console.log(mapData);
        setInteractiveMap(mapData);
    }

    async function getPredictionPinData() {
        const res = await fetch(`${config.basePath}/api/predictions`);
        const predictions = await res.json();
        setSessionData(predictions.data);
    }

    // todo put in separate component file
    function getGeoJSONLayer() {
        if (!interactiveMap || !regionTranslations) {
            return (
                <Stack alignItems='center'>
                    <CircularProgress />
                </Stack>
            );
        }

        return (
            <GeoJSON
                data={interactiveMap}
                style={(feature) => ({
                    fillColor: getColor(feature?.properties.as),
                    weight: 1,
                    opacity: 1,
                    color: 'white',
                    dashArray: '3',
                    fillOpacity: 0.7,
                })}
                onEachFeature={(feature, layer) => { // TODO create feature typing
                    layer.bindPopup(ReactDOMServer.renderToString(
                        <>
                            <Typography className='english' variant='body1'>
                                Mean As: {Math.floor(feature.properties.as)}
                            </Typography>

                            <Typography className='bengali' variant='body1'>
                                BENGALI PLACEHOLDER
                            </Typography>

                            <Typography className='english' variant='body1'>
                                Division: {feature.properties.div}
                            </Typography>

                            <Typography className='bengali' variant='body1'>{`
                                ${regionTranslations.Divisions.Division}:
                                ${regionTranslations.Divisions[feature.properties.div]}
                            `}</Typography>

                            <Typography className='english' variant='body1'>
                                District: {feature.properties.dis}
                            </Typography>

                            <Typography className='bengali' variant='body1'>{`
                                ${regionTranslations.Districts.District}:
                                ${regionTranslations.Districts[feature.properties.dis]}
                            `}</Typography>

                            <Typography className='english' variant='body1'>
                                Upazila: {feature.properties.upa}
                            </Typography>

                            <Typography className='bengali' variant='body1'>{`
                                ${regionTranslations.Upazilas.Upazila}:
                                ${regionTranslations.Upazilas[feature.properties.upa]}
                            `}</Typography>
                        </>
                    ));
                }}
            />
        );
    }

    // colourise geojson regions based on mean arsenic
    function getColor(as: number) {
        return as === null ? 'gray' :
            as < 10 ? 'rgba(100, 149, 237, 0.5)' :
            as < 50 ? 'rgba(144, 238, 144, 0.5)' :
            'rgba(255, 69, 0, 0.5)';
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
                {getGeoJSONLayer()}
                <Markers sessionData={sessionData} regionTranslations={regionTranslations} />
            </MapContainer>
        </Stack>
    );
}
