import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './map.css';
import { CircularProgress, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import L, { LatLngExpression } from 'leaflet';
import config from '../../config';
import { SessionData } from '../../types';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import ReactDOMServer from 'react-dom/server';
import { RegionTranslations } from '../../types';
import RegionTranslationsFetcher from '../../utils/RegionTranslationsFetcher';

function createCustomIcon(color: string) {
    return L.icon({
        iconUrl: `${config.basePath}/map-markers/${color}.png`,
        shadowUrl: markerShadow,
        iconSize: [25, 41],
        shadowSize: [41, 41],
        iconAnchor: [12, 41], // point icon corresponds to marker
        shadowAnchor: [12, 41],  // point shadow corresponds to marker
        popupAnchor: [1, -34], // point from which the popup should open relative to the iconAnchor
    });
}

export default function Map() {
    const position: LatLngExpression = [23.8041, 90.4152];
    const [interactiveMap, setInteractiveMap] = useState();
    const [predictions, setPredictions] = useState<SessionData[]>();
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
        setPredictions(predictions.data);
    }

    function getMarkers(): JSX.Element[] | undefined {
        if (!predictions || !regionTranslations) return;

        const geoSessions = predictions.filter((p: SessionData) => p.geolocation !== 'N/A');
        console.log(geoSessions);

        return geoSessions?.map((p: SessionData, index) => {
            const icon = createCustomIcon(((): string => {
                switch ((p.prediction - 0.5) % 4) {
                    case 0:
                        return 'green';
                    case 1:
                        return 'lime';
                    case 2:
                        return 'yellow';
                    case 3:
                        return 'orange';
                    case 4:
                        return 'red';
                    default:
                        'blue';
                }
                return 'blue';
            })());
            return (
                <Marker icon={icon} key={index} position={p.geolocation as LatLngExpression}>
                    <Popup>
                        <Typography variant='body1'>
                            ID: {p.id}
                        </Typography>

                        <Typography className='english' variant='body1'>
                            Division: {p.predictors.regionKey.division}
                        </Typography>

                        <Typography className='bengali' variant='body1'>{`
                                ${regionTranslations.Divisions.Division}:
                                ${regionTranslations.Divisions[p.predictors.regionKey.division]}
                        `}</Typography>

                        <Typography className='english' variant='body1'>
                            District: {p.predictors.regionKey.district}
                        </Typography>

                        <Typography className='bengali' variant='body1'>{`
                                ${regionTranslations.Districts.District}:
                                ${regionTranslations.Districts[p.predictors.regionKey.district]}
                        `}</Typography>

                        <Typography className='english' variant='body1'>
                            Upazila: {p.predictors.regionKey.upazila}
                        </Typography>

                        <Typography className='bengali' variant='body1'>{`
                            ${regionTranslations.Upazilas.Upazila}:
                            ${regionTranslations.Upazilas[p.predictors.regionKey.upazila]}
                        `}</Typography>

                        <Typography className='english' variant='body1'>
                            Union: {p.predictors.regionKey.union}
                        </Typography>

                        <Typography className='bengali' variant='body1'>{`
                            ${regionTranslations.Unions.Union}:
                            ${regionTranslations.Unions[p.predictors.regionKey.union]}
                        `}</Typography>

                        <Typography className='english' variant='body1'>
                            Mouza: {p.predictors.regionKey.mouza}
                        </Typography>

                        <Typography className='bengali' variant='body1'>{`
                            ${regionTranslations.Mouzas.Mouza}:
                            ${regionTranslations.Mouzas[p.predictors.regionKey.mouza]}
                        `}</Typography>
                    </Popup>
                </Marker>
            );
        });
    }

    function getGeoJSONLayer() {
        if (!interactiveMap || !regionTranslations) {
            return (
                <Stack alignItems='center'>
                    <CircularProgress />
                </Stack>
            );
        }
        console.log('hello');

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

    if (!interactiveMap || !predictions) return (
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
                {getMarkers()}
            </MapContainer>
        </Stack>
    );
}
