import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import L from "leaflet";

export default function(color: string = 'blue') {
    return L.icon({
        iconUrl: `/map-markers/${color}.png`,
        shadowUrl: markerShadow,
        iconSize: [25, 41],
        shadowSize: [41, 41],
        iconAnchor: [12, 41], // point icon corresponds to marker
        shadowAnchor: [12, 41],  // point shadow corresponds to marker
        popupAnchor: [1, -34], // point from which the popup should open relative to the iconAnchor
    });
}