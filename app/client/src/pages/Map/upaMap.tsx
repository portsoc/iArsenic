import ReactDOMServer from "react-dom/server";
import { GeoJSON as GeoJSONComponent } from 'react-leaflet';
import { GeoJSON } from 'leaflet';
import { RegionTranslations } from "../../types";
import TranslatableText from "../../components/TranslatableText";

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
                        <TranslatableText 
                            variant='body1'
                            english={`Mean As: ${Math.floor(feature.properties.as)}`}
                            bengali='BENGALI PLACEHOLDER'
                        />

                        <TranslatableText 
                            variant='body1'
                            english={`Division: ${feature.properties.div}`}
                            bengali={`
                                ${regionTranslations.Divisions.Division}:
                                ${regionTranslations.Divisions[feature.properties.div]}
                            `}
                        />

                        <TranslatableText 
                            variant='body1'
                            english={`District: ${feature.properties.dis}`}
                            bengali={`
                                ${regionTranslations.Districts.District}:
                                ${regionTranslations.Districts[feature.properties.dis]}
                            `}
                        />
                        
                        <TranslatableText 
                            variant='body1'
                            english={`Upazila: ${feature.properties.upa}`}
                            bengali={`
                                ${regionTranslations.Upazilas.Upazila}:
                                ${regionTranslations.Upazilas[feature.properties.upa]}
                            `}
                        />
                    </>
                ));
            }}
        />
    );
}