import { Marker, Popup } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import config from '../../config';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { RegionTranslations, SessionData } from '../../types';
import { Typography } from '@mui/material';

type props = {
    sessionData: SessionData[],
    regionTranslations: RegionTranslations,
}

export default function Markers({ sessionData, regionTranslations }: props): JSX.Element {
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

    function getIcon(prediction: 0.5 | 1.5 | 2.5 | 3.5 | 4.5): L.Icon<L.IconOptions> {
        const iconColor = (() => {
            switch ((prediction - 0.5) % 4) {
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
            return 'blue'
        })();

        return createCustomIcon(iconColor);
    }

    return (
        <>
            {sessionData.filter(s => s.geolocation !== 'N/A').map((p, index) =>
                <Marker icon={getIcon(p.prediction)} key={index} position={p.geolocation as LatLngExpression}>
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
            )}
        </>
    )
}