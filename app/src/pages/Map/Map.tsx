import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './map.css';
import { LatLngExpression } from 'leaflet';
import { CircularProgress, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import L from 'leaflet';
import config from '../../config';
import { Predictors } from '../../utils/PredictorsStorage';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
    iconUrl: `${config.basePath}/map-pin.png`,
    shadowUrl: markerShadow,
});

export default function Map() {
    const position: LatLngExpression = [23.8041, 90.4152];
    const [interactiveMap, setInteractiveMap] = useState();
    const [predictions, setPredictions] = useState<Partial<Predictors>[]>();

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
                            id: {p.id}
                        </Typography>
                        <Typography variant='body1'>
                            Division: {pr.regionKey.division}
                        </Typography>
                        <Typography variant='body1'>
                            District: {pr.regionKey.district}
                        </Typography>
                        <Typography variant='body1'>
                            Upazila: {pr.regionKey.upazila}
                        </Typography>
                        <Typography variant='body1'>
                            Union: {pr.regionKey.union}
                        </Typography>
                        <Typography variant='body1'>
                            Mouza: {pr.regionKey.mouza}
                        </Typography>
                    </Popup>
                </Marker>
            );
        });
    }

    function getGeoJSONLayer() {
        if (!interactiveMap) return (<></>);
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
                onEachFeature={(feature, layer) => {
                    layer.bindPopup(
                        `As level: ${feature.properties.as}<br />` +
                        `Division: ${feature.properties.div}<br />` +
                        `District: ${feature.properties.dis}<br />` +
                        `Upazila: ${feature.properties.upa}`
                    );
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

    useEffect(() => {
        getInteractiveMap();
        getPredictionPinData();
    }, []);

    useEffect(() => {
        console.log(interactiveMap);
    }, [interactiveMap]);

    useEffect(() => {
        console.log(predictions);
    }, [predictions]);

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
