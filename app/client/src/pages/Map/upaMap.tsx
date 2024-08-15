import { Typography } from "@mui/material";
import ReactDOMServer from "react-dom/server";
import { GeoJSON as GeoJSONComponent } from 'react-leaflet';
import { GeoJSON } from 'leaflet';
import { RegionTranslations } from "../../../../types";

type props = {
    interactiveMap: GeoJSON,
    regionTranslations: RegionTranslations,
}

export default function UpaMap({ interactiveMap, regionTranslations }: props): JSX.Element {
    function getColor(as: number): string {
        if (as < 10) return 'rgba(51, 204, 56, 0.5)';
        if (as < 50) return 'rgba(250, 205, 61, 0.5)';
        return 'rgba(245, 35, 28, 0.5)';
    }

    return (
        <GeoJSONComponent
            data={{
                ...interactiveMap,
                type: 'FeatureCollection', // TODO fix typing
            }}
            style={(feature) => ({
                fillColor: getColor(feature?.properties.as),
                weight: 1,
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

                        <Typography className='bengali' variant='body1'>{`
                            ${regionTranslations.Divisions.Division}:
                            ${regionTranslations.Divisions[feature.properties.div]}
                        `}</Typography>

                        <Typography className='english' variant='body1'>
                            District: {feature.properties.dis}
                        </Typography>

                        <Typography className='bengali' variant='body1'>{`
                            ${regionTranslations.Districts.District}:
                            ${regionTranslations.Districts[feature.properties.dis]}
                        `}</Typography>

                        <Typography className='english' variant='body1'>
                            Upazila: {feature.properties.upa}
                        </Typography>

                        <Typography className='bengali' variant='body1'>{`
                            ${regionTranslations.Upazilas.Upazila}:
                            ${regionTranslations.Upazilas[feature.properties.upa]}
                        `}</Typography>
                    </>
                ));
            }}
        />
    );
}