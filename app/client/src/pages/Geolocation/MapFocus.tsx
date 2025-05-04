import { useMap } from 'react-leaflet';
import { useEffect } from 'react';
import { LatLngExpression } from 'leaflet';

export default function({ position }: { position: LatLngExpression }) {
    const map = useMap();

    useEffect(() => {
        map.setView(position, map.getZoom(), {
            animate: true,
        });
    }, [position, map]);

    return null;
}