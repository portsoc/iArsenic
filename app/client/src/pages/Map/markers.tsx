import { Marker, Popup } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import { RegionTranslations } from '../../types';
import { Well } from 'iarsenic-types';
import { Typography } from '@mui/material';
import getMapPin from '../../utils/getMapPin';

type props = {
    wells: Well[],
    regionTranslations: RegionTranslations,
}

export default function Markers({ wells, regionTranslations }: props): JSX.Element {
    function getIcon(prediction: 0.5 | 1.5 | 2.5 | 3.5 | 4.5 | undefined): L.Icon<L.IconOptions> {
        const iconColor = (() => {
            switch (prediction) {
                case 0.5:
                    return 'green';
                case 1.5:
                    return 'lime';
                case 2.5:
                    return 'yellow';
                case 3.5:
                    return 'orange';
                case 4.5:
                    return 'red';
                default:
                    'blue';
            }
            return 'blue';
        })();

        return getMapPin(iconColor);
    }

    function predictionToRiskFactor(
        prediction: number | undefined
    ): { english: string, bengali: string } {
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

    const filteredWells = wells.filter(w =>
        w.geolocation != null &&
        w.riskAssesment != null &&
        w.division != null &&
        w.district != null &&
        w.upazila != null &&
        w.union != null &&
        w.mouza != null &&
        w.staining != null &&
        w.depth != null
    );

    return (
        <>
            {filteredWells.map((w, index) => {
                return (
                    <Marker icon={getIcon(w.riskAssesment)} key={index} position={w.geolocation as LatLngExpression}>
                        <Popup>
                            <Typography variant='body1'>
                                ID: {w.id}
                            </Typography>

                            <Typography className='english' variant='body1'>
                                Risk Factor: {predictionToRiskFactor(w.riskAssesment).english}
                            </Typography>

                            <Typography className='bengali' variant='body1'>
                                BENGALI PLACEHOLDER: {predictionToRiskFactor(w.riskAssesment).bengali}
                            </Typography>

                            <Typography className='english' variant='body1'>
                                Division: {w.division}
                            </Typography>

                            <Typography className='bengali' variant='body1'>{`
                                ${regionTranslations.Divisions.Division}:
                                ${regionTranslations.Divisions[w.division!]}
                            `}</Typography>

                            <Typography className='english' variant='body1'>
                                District: {w.district}
                            </Typography>

                            <Typography className='bengali' variant='body1'>{`
                                ${regionTranslations.Districts.District}:
                                ${regionTranslations.Districts[w.district!]}
                            `}</Typography>

                            <Typography className='english' variant='body1'>
                                Upazila: {w.upazila!}
                            </Typography>

                            <Typography className='bengali' variant='body1'>{`
                                ${regionTranslations.Upazilas.Upazila}:
                                ${regionTranslations.Upazilas[w.upazila!]}
                            `}</Typography>

                            <Typography className='english' variant='body1'>
                                Union: {w.union!}
                            </Typography>

                            <Typography className='bengali' variant='body1'>{`
                                ${regionTranslations.Unions.Union}:
                                ${regionTranslations.Unions[w.union!]}
                            `}</Typography>

                            <Typography className='english' variant='body1'>
                                Mouza: {w.mouza}
                            </Typography>

                            <Typography className='bengali' variant='body1'>{`
                                ${regionTranslations.Mouzas.Mouza}:
                                ${regionTranslations.Mouzas[w.mouza!]}
                            `}</Typography>

                            <Typography className='english' variant='body1'>
                                Depth: {
                                    `${w!.depth}m`
                                }
                            </Typography>

                            <Typography className='bengali' variant='body1'>
                                BENGALI PLACEHOLDER: {
                                    `${w!.depth}m`
                                }
                            </Typography>

                            <Typography className='english' variant='body1'>
                                Flooding: {w.flooding ? 'Yes' : 'No'}
                            </Typography>

                            <Typography className='bengali' variant='body1'>
                                BENGALI PLACEHOLDER: {w.flooding ? 'Yes' : 'No'}
                            </Typography>

                            <Typography className='english' variant='body1'>
                                Well Staining: {w.staining}
                            </Typography>

                            <Typography className='english' variant='body1'>
                                BENGALI PLACEHOLDER: {w.staining}
                            </Typography>

                            {
                                (w.utensilStaining != null) &&
                                <>
                                    <Typography className='english' variant='body1'>
                                        Utensil Staining: {w.utensilStaining}
                                    </Typography>

                                    <Typography className='bengali' variant='body1'>
                                        BENGALI PLACEHOLDER: {w.utensilStaining}
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