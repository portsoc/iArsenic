import { Storage } from '@google-cloud/storage';
import { FeatureCollection } from 'geojson';
import { featureEach } from '@turf/meta';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { point } from '@turf/helpers';

const storage = new Storage();
const bucketName = 'iarsenic-model6';

async function loadGeoJSONFromGCS(filename: string): Promise<FeatureCollection> {
    const file = storage.bucket(bucketName).file(`geodata/${filename}`);
    const [contents] = await file.download();
    return JSON.parse(contents.toString());
}

export const GeodataService = {
    async findRegionByLatLon(lat: number, lon: number): Promise<{
        division: string;
        district: string;
        upazila: string;
        union: string;
        mouza: string;
    } | null> {
        const pt = point([lon, lat]);

        // Step 1: find upazila directly
        const upazilas = await loadGeoJSONFromGCS('intersected_upazilas.geojson');

        let division: string | undefined;
        let district: string | undefined;
        let upazila: string | undefined;

        featureEach(upazilas, (feat: any) => {
            if (booleanPointInPolygon(pt, feat)) {
                division = feat.properties.div;
                district = feat.properties.dis;
                upazila = feat.properties.upa;
            }
        });

        console.log(`division: ${division}`)
        console.log(`district: ${district}`)
        console.log(`upazila: ${upazila}`)

        if (!division || !district || !upazila) return null;

        // Step 2: load mouza file using known upazila location
        const mouzaFilename = `mouza-by-upazila/${division}-${district}-${upazila}.geojson`;

        let mouzaData: FeatureCollection;
        try {
            mouzaData = await loadGeoJSONFromGCS(mouzaFilename);
        } catch {
            return null;
        }

        let union: string | undefined;
        let mouza: string | undefined;

        featureEach(mouzaData, (feat: any) => {
            if (booleanPointInPolygon(pt, feat)) {
                union = feat.properties.uni;
                mouza = feat.properties.mou;
            }
        });

        if (!union || !mouza) return null;

        return {
            division,
            district,
            upazila,
            union,
            mouza,
        };
    },
};
