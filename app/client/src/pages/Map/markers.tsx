import { Marker, Popup } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import { RegionTranslations } from '../../types';
import { Well } from 'iarsenic-types';
import { Typography } from '@mui/material';
import getMapPin from '../../utils/getMapPin';
import TranslatableText from '../../components/TranslatableText';

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

    console.log(wells)
    const filteredWells = wells.filter(w =>
        w.riskAssesment != null &&
        (w.mouzaGeolocation != null || w.geolocation != null) &&
        w.division != null &&
        w.district != null &&
        w.upazila != null &&
        w.union != null &&
        w.mouza != null &&
        w.staining != null &&
        w.depth != null
    );

    console.log(filteredWells)

    return (
        <>
            {filteredWells.map((w, index) => {
                return (
                    <Marker 
                        icon={getIcon(w.riskAssesment)} 
                        key={index} 
                        position={
                            (w.geolocation ?? w.mouzaGeolocation) as LatLngExpression
                        }
                    >
                        <Popup>
                            <TranslatableText 
                                variant='body1'
                                english={`ID: ${w.id}`}
                                bengali={`BENGALI PLACEHOLDER: ${w.id}`}
                            />

                            <TranslatableText 
                                variant='body1'
                                english={`Risk Factor: ${predictionToRiskFactor(w.riskAssesment).english}`}
                                bengali={`BENGALI PLACEHOLDER: ${predictionToRiskFactor(w.riskAssesment).bengali}`}
                            />

                            <TranslatableText 
                                variant='body1'
                                english={`Division: ${w.division}`}
                                bengali={`
                                    ${regionTranslations.Divisions.Division}:
                                    ${regionTranslations.Divisions[w.division!]}
                                `}
                            />

                            <TranslatableText 
                                variant='body1'
                                english={`District: ${w.district}`}
                                bengali={`
                                    ${regionTranslations.Districts.District}:
                                    ${regionTranslations.Districts[w.district!]}
                                `}
                            />

                            <TranslatableText 
                                variant='body1'
                                english={`Upazila: ${w.upazila!}`}
                                bengali={`
                                    ${regionTranslations.Upazilas.Upazila}:
                                    ${regionTranslations.Upazilas[w.upazila!]}
                                `}
                            />

                            <TranslatableText 
                                variant='body1'
                                english={`Union: ${w.union!}`}
                                bengali={`
                                    ${regionTranslations.Unions.Union}:
                                    ${regionTranslations.Unions[w.union!]}
                                `}
                            />

                            <TranslatableText 
                                variant='body1'
                                english={`Mouza: ${w.mouza}`}
                                bengali={`
                                    ${regionTranslations.Mouzas.Mouza}:
                                    ${regionTranslations.Mouzas[w.mouza!]}
                                `}
                            />

                            <TranslatableText 
                                variant='body1'
                                english={`
                                    Depth: ${w!.depth}m
                                `}
                                bengali={`
                                    BENGALI PLACEHOLDER: ${w!.depth}m
                                `}
                            />

                            <TranslatableText 
                                variant='body1'
                                english={`
                                    Flooding: ${w.flooding ? 'Yes' : 'No'}
                                `}
                                bengali={`
                                    BENGALI PLACEHOLDER: ${w.flooding ? 'Yes' : 'No'}
                                `}
                            />

                            <Typography className='english' variant='body1'>
                                
                            </Typography>

                            <Typography className='bengali' variant='body1'>
                            </Typography>

                            <TranslatableText 
                                variant='body1'
                                english={`
                                    Well Staining: ${w.staining}
                                `}
                                bengali={`
                                    BENGALI PLACEHOLDER: ${w.staining}
                                `}
                            />

                            {
                                (w.utensilStaining != null) &&
                                <>
                                    <TranslatableText 
                                        variant='body1'
                                        english={`
                                            Utensil Staining: ${w.utensilStaining}   
                                        `}
                                        bengali={`
                                            BENGALI PLACEHOLDER: ${w.utensilStaining}
                                        `}
                                    />
                                </>
                            }
                        </Popup>
                    </Marker>
                );}
            )}
        </>
    );
}