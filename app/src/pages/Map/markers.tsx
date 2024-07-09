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
            switch (prediction - 0.5) {
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

    function predictionToRiskFactor(prediction: number): { english: string, bengali: string } {
        switch (prediction) {
            case 0.5:
                return { english: 'Rare', bengali: 'বিরল' };
            case 1.5:
                return { english: 'Low', bengali: 'কম' };
            case 2.5:
                return { english: 'Medium', bengali: 'মাঝারি' };
            case 3.5:
                return { english: 'High', bengali: 'উচ্চ' };
            case 4.5:
                return { english: 'Severe', bengali: 'গুরুতর' };
            default:
                return { english: 'Unknown', bengali: 'N/A' };
        }
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
                            Risk Factor: {predictionToRiskFactor(p.prediction).english}
                        </Typography>

                        <Typography className='bengali' variant='body1'>
                            BENGALI PLACEHOLDER: {predictionToRiskFactor(p.prediction).bengali}
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

                        <Typography className='english' variant='body1'>
                            Depth: {
                                p.predictors.depth.unit === 'm' ?
                                `${p.predictors.depth.value}m` :
                                `${Math.floor(p.predictors.depth.value * 0.3048)}m`
                            }
                        </Typography>

                        <Typography className='bengali' variant='body1'>
                            BENGALI PLACEHOLDER: {
                                p.predictors.depth.unit === 'm' ?
                                `${p.predictors.depth.value}m` :
                                `${Math.floor(p.predictors.depth.value * 0.3048)}m`
                            }
                        </Typography>

                        <Typography className='english' variant='body1'>
                            Flooding: {p.predictors.flooding ? 'Yes' : 'No'}
                        </Typography>

                        <Typography className='bengali' variant='body1'>
                            BENGALI PLACEHOLDER: {p.predictors.flooding ? 'Yes' : 'No'}
                        </Typography>

                        <Typography className='english' variant='body1'>
                            Well Staining: {p.predictors.wellStaining}
                        </Typography>

                        <Typography className='english' variant='body1'>
                            BENGALI PLACEHOLDER: {p.predictors.wellStaining}
                        </Typography>

                        {
                            (p.predictors.utensilStaining !== 'N/A') &&
                            <>
                                <Typography className='english' variant='body1'>
                                    Utensil Staining: {p.predictors.utensilStaining}
                                </Typography>

                                <Typography className='bengali' variant='body1'>
                                    BENGALI PLACEHOLDER: {p.predictors.utensilStaining}
                                </Typography>
                            </>
                        }
                    </Popup>
                </Marker>
            )}
        </>
    )
}