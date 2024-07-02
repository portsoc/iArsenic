import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './map.css';
import { LatLngExpression} from 'leaflet';
import { CircularProgress, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import L from 'leaflet';
import config from '../../config';
import { Predictors } from '../../utils/PredictorsStorage';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import ReactDOMServer from 'react-dom/server';
import { RegionTranslations } from '../../types';
import RegionTranslationsFetcher from '../../utils/RegionTranslationsFetcher';

L.Icon.Default.mergeOptions({
    iconUrl: `${config.basePath}/map-pin.png`,
    shadowUrl: markerShadow,
});

export default function Map() {
    const position: LatLngExpression = [23.8041, 90.4152];
    const [interactiveMap, setInteractiveMap] = useState();
    const [predictions, setPredictions] = useState<Partial<Predictors>[]>();
    const [regionTranslations, setRegionTranslations] = useState<RegionTranslations>();

    async function getInteractiveMap() {
        const res = await fetch(`${config.basePath}/api/interactive-map`);
        const mapData = await res.json();
        setInteractiveMap(mapData);
    }

    async function getPredictionPinData() {
        const res = await fetch(`${config.basePath}/api/predictions`);
        const predictions = await res.json();
        setPredictions(predictions.data);
    }

    function getMarkers(): JSX.Element[] | undefined {
        if (!predictions || !regionTranslations) return;

        const coordPredictions = predictions?.filter((p: Partial<Predictors>) => {
            return Array.isArray(p.geolocation) &&
                p.geolocation.length === 2 &&
                (typeof p.geolocation[0] === 'number') &&
                (typeof p.geolocation[1] === 'number');
            });

        return coordPredictions?.map((p: Partial<Predictors>, index) => {
            const pr = (p as { predictors: Predictors }).predictors as Predictors; // todo fix typing
            return (
                <Marker key={index} position={p.geolocation as LatLngExpression}>
                    <Popup>
                        <Typography variant='body1'>
                            ID: {p.id}
                        </Typography>

                        <Typography className='english' variant='body1'>
                            Division: {pr.regionKey.division}
                        </Typography>

                        <Typography className='bengali' variant='body1'>
                            {`
                                ${regionTranslations.Divisions.Division}:
                                ${regionTranslations.Divisions[pr.regionKey.division]}
                            `}
                        </Typography>

                        <Typography className='english' variant='body1'>
                            District: {pr.regionKey.district}
                        </Typography>

                        <Typography className='bengali' variant='body1'>
                            {`
                                ${regionTranslations.Districts.District}:
                                ${regionTranslations.Districts[pr.regionKey.district]}
                            `}
                        </Typography>

                        <Typography className='english' variant='body1'>
                            Upazila: {pr.regionKey.upazila}
                        </Typography>

                        <Typography className='bengali' variant='body1'>
                            {`
                                ${regionTranslations.Upazilas.Upazila}:
                                ${regionTranslations.Upazilas[pr.regionKey.upazila]}
                            `}
                        </Typography>

                        <Typography className='english' variant='body1'>
                            Union: {pr.regionKey.union}
                        </Typography>

                        <Typography className='bengali' variant='body1'>
                            {`
                                ${regionTranslations.Unions.Union}:
                                ${regionTranslations.Unions[pr.regionKey.union]}
                            `}
                        </Typography>

                        <Typography className='english' variant='body1'>
                            Mouza: {pr.regionKey.mouza}
                        </Typography>

                        <Typography className='bengali' variant='body1'>
                            {`
                                ${regionTranslations.Mouzas.Mouza}:
                                ${regionTranslations.Mouzas[pr.regionKey.mouza]}
                            `}
                        </Typography>
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

        return (
            <GeoJSON
                data={interactiveMap}
                style={(feature) => ({
                    fillColor: getColor(feature?.properties.as),
                    weight: 2,
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

                            <Typography className='bengali' variant='body1'>
                                {`
                                    ${regionTranslations.Divisions.Division}:
                                    ${regionTranslations.Divisions[feature.properties.div]}
                                `}
                            </Typography>

                            <Typography className='english' variant='body1'>
                                District: {feature.properties.dis}
                            </Typography>

                            <Typography className='bengali' variant='body1'>
                                {`
                                    ${regionTranslations.Districts.District}:
                                    ${regionTranslations.Districts[feature.properties.dis]}
                                `}
                            </Typography>

                            <Typography className='english' variant='body1'>
                                Upazila: {feature.properties.upa}
                            </Typography>

                            <Typography className='bengali' variant='body1'>
                                {`
                                    ${regionTranslations.Upazilas.Upazila}:
                                    ${regionTranslations.Upazilas[feature.properties.upa]}
                                `}
                            </Typography>
                        </>
                    ));
                }}
            />
        );
    }

    function getColor(as: number) {
        return as === null ? 'gray' :
            as < 10 ? 'rgba(100, 149, 237, 0.5)' :
            as < 50 ? 'rgba(144, 238, 144, 0.5)' :
            'rgba(255, 69, 0, 0.5)';
    }

    async function getRegionTranslations() {
        const translations = await RegionTranslationsFetcher()
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
