import { Marker, Popup } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { RegionTranslations } from '../../types';
import { Prediction, Well } from 'iarsenic-types';
import { Typography } from '@mui/material';
import findWellPredictions from '../../utils/findWellPredictions';

type props = {
    wells: Well[],
    predictions: Prediction[],
    regionTranslations: RegionTranslations,
}

export default function Markers({ wells, predictions, regionTranslations }: props): JSX.Element {
    function createCustomIcon(color: string) {
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
            return 'blue';
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
            {wells.filter(
                s => s.geolocation != null &&
                findWellPredictions(s, predictions)[0] != null &&
                s.regionKey != null &&
                s.staining != null &&
                s.depth != null
            ).map((p, index) => {
                const prediction = findWellPredictions(p, predictions)[0]
                return (
                    <Marker icon={getIcon(prediction.riskAssesment)} key={index} position={p.geolocation as LatLngExpression}>
                        <Popup>
                            <Typography variant='body1'>
                                ID: {p.id}
                            </Typography>

                            <Typography className='english' variant='body1'>
                                Risk Factor: {predictionToRiskFactor(prediction.riskAssesment).english}
                            </Typography>

                            <Typography className='bengali' variant='body1'>
                                BENGALI PLACEHOLDER: {predictionToRiskFactor(prediction.riskAssesment).bengali}
                            </Typography>

                            <Typography className='english' variant='body1'>
                                Division: {p.regionKey!.division}
                            </Typography>

                            <Typography className='bengali' variant='body1'>{`
                                ${regionTranslations.Divisions.Division}:
                                ${regionTranslations.Divisions[p.regionKey!.division]}
                            `}</Typography>

                            <Typography className='english' variant='body1'>
                                District: {p.regionKey!.district}
                            </Typography>

                            <Typography className='bengali' variant='body1'>{`
                                ${regionTranslations.Districts.District}:
                                ${regionTranslations.Districts[p.regionKey!.district]}
                            `}</Typography>

                            <Typography className='english' variant='body1'>
                                Upazila: {p.regionKey!.upazila}
                            </Typography>

                            <Typography className='bengali' variant='body1'>{`
                                ${regionTranslations.Upazilas.Upazila}:
                                ${regionTranslations.Upazilas[p.regionKey!.upazila]}
                            `}</Typography>

                            <Typography className='english' variant='body1'>
                                Union: {p.regionKey!.union}
                            </Typography>

                            <Typography className='bengali' variant='body1'>{`
                                ${regionTranslations.Unions.Union}:
                                ${regionTranslations.Unions[p.regionKey!.union]}
                            `}</Typography>

                            <Typography className='english' variant='body1'>
                                Mouza: {p.regionKey!.mouza}
                            </Typography>

                            <Typography className='bengali' variant='body1'>{`
                                ${regionTranslations.Mouzas.Mouza}:
                                ${regionTranslations.Mouzas[p.regionKey!.mouza]}
                            `}</Typography>

                            <Typography className='english' variant='body1'>
                                Depth: {
                                    `${p!.depth}m`
                                }
                            </Typography>

                            <Typography className='bengali' variant='body1'>
                                BENGALI PLACEHOLDER: {
                                    `${p!.depth}m`
                                }
                            </Typography>

                            <Typography className='english' variant='body1'>
                                Flooding: {p.flooding ? 'Yes' : 'No'}
                            </Typography>

                            <Typography className='bengali' variant='body1'>
                                BENGALI PLACEHOLDER: {p.flooding ? 'Yes' : 'No'}
                            </Typography>

                            <Typography className='english' variant='body1'>
                                Well Staining: {p.staining}
                            </Typography>

                            <Typography className='english' variant='body1'>
                                BENGALI PLACEHOLDER: {p.staining}
                            </Typography>

                            {
                                (p.utensilStaining != null) &&
                                <>
                                    <Typography className='english' variant='body1'>
                                        Utensil Staining: {p.utensilStaining}
                                    </Typography>

                                    <Typography className='bengali' variant='body1'>
                                        BENGALI PLACEHOLDER: {p.utensilStaining}
                                    </Typography>
                                </>
                            }
                        </Popup>
                    </Marker>
                );}
            )}
        </>
    );
}