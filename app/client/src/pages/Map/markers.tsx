import { Circle, Marker, Popup } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import { RegionTranslations } from '../../types';
import { Well } from 'iarsenic-types';
import { Typography } from '@mui/material';
import getMapPin from '../../utils/getMapPin';
import TranslatableText from '../../components/TranslatableText';
import { Link } from 'wouter';

type props = {
    wells: Well[],
    regionTranslations: RegionTranslations,
    highlightId: string | null,
}

export default function Markers({ wells, regionTranslations, highlightId }: props): JSX.Element {
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
    console.log(`highlightId: ${highlightId}`)

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
                        eventHandlers={{
                            add: (e) => {
                                if (w.id === highlightId) {
                                    setTimeout(() => e.target.openPopup(), 100);
                                }
                            }
                        }}
                    >
                        {w.id === highlightId && (
                            <Circle
                                center={(w.geolocation ?? w.mouzaGeolocation) as LatLngExpression}
                                radius={500}
                                pathOptions={{ color: 'cornflowerblue', fillOpacity: 0.1 }}
                            />
                        )}
                        <Popup>
                            <TranslatableText 
                                variant='body1'
                                english={<>
                                    ID: <Link href={`/well/${w.id}/result`}>{w.id}</Link>
                                </>}
                                bengali={<>
                                    আইডি: <Link href={`/well/${w.id}/result`}>{w.id}</Link>
                                </>}
                            />

                            <TranslatableText 
                                variant='body1'
                                english={`Risk Factor: ${predictionToRiskFactor(w.riskAssesment).english}`}
                                bengali={`ঝুঁকির মাত্রা: ${predictionToRiskFactor(w.riskAssesment).bengali}`} // chatgpt generated
                            />

                            <TranslatableText 
                                variant='body1'
                                english={`Division: ${w.division}`}
                                bengali={`
                                    ${regionTranslations.Divisions.division}:
                                    ${regionTranslations.Divisions[(w.division! as string).toLowerCase()]}
                                `}
                            />

                            <TranslatableText 
                                variant='body1'
                                english={`District: ${w.district}`}
                                bengali={`
                                    ${regionTranslations.Districts.district}:
                                    ${regionTranslations.Districts[(w.district! as string).toLowerCase()]}
                                `}
                            />

                            <TranslatableText 
                                variant='body1'
                                english={`Upazila: ${w.upazila!}`}
                                bengali={`
                                    ${regionTranslations.Upazilas.upazila}:
                                    ${regionTranslations.Upazilas[(w.upazila!).toLowerCase()]}
                                `}
                            />

                            <TranslatableText 
                                variant='body1'
                                english={`Union: ${w.union!}`}
                                bengali={`
                                    ${regionTranslations.Unions.union}:
                                    ${regionTranslations.Unions[(w.union!).toLowerCase()]}
                                `}
                            />

                            <TranslatableText 
                                variant='body1'
                                english={`Mouza: ${w.mouza}`}
                                bengali={`
                                    ${regionTranslations.Mouzas.mouza}:
                                    ${regionTranslations.Mouzas[(w.mouza!).toLowerCase()]}
                                `}
                            />

                            <TranslatableText 
                                variant='body1'
                                english={<>
                                    Depth: {((w!.depth as number) * 3.281).toFixed(0)} ft ({w!.depth} meters)
                                </>}
                                bengali={<>
                                    গভীরতা: {((w!.depth as number) * 3.281).toFixed(0)} ফুট ({w!.depth} মিটার)
                                </>}
                            />

                            <TranslatableText 
                                variant='body1'
                                english={`
                                    Drinking Source: ${w.wellInUse ? 'Yes' : 'No'}
                                `}
                                bengali={`
                                    পানীয় উৎস: ${w.wellInUse ? 'হ্যাঁ' : 'না'}
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
                                bengali={
                                    (() => {
                                        const value = (() => {
                                            if (w.staining === 'red') return 'লালচে দাগ';
                                            if (w.staining === 'black') return 'কালো দাগ';
                                            if (w.staining === 'not sure') return 'নিশ্চিত না';
                                            if (!w.staining) return '';
                                            return w.staining; // fallback
                                        })();
                                        return (
                                            <>
                                                দাগ: {value}
                                            </>
                                        );
                                    })()
                                } // values chatgpt generated
                            />

                            {
                                (w.utensilStaining != null) &&
                                <>
                                    <TranslatableText 
                                        variant='body1'
                                        english={`
                                            Utensil Staining: ${w.utensilStaining}   
                                        `}
                                        bengali={
                                            (() => {
                                                const value = (() => {
                                                    if (w.utensilStaining === 'red') return 'লালচে দাগ';
                                                    if (w.utensilStaining === 'black') return 'কালো দাগ';
                                                    if (w.utensilStaining === undefined) return '';
                                                    return w.utensilStaining; // fallback
                                                })();
                                                return (
                                                    <>
                                                        হাড়ি-পাতিলের দাগ: {value}
                                                    </>
                                                );
                                            })()
                                        } // values chatgpt generated
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