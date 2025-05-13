import { Storage } from '@google-cloud/storage';
import { Feature, Polygon, MultiPolygon, FeatureCollection } from 'geojson';
import { featureEach } from '@turf/meta';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { point } from '@turf/helpers';
import centroid from '@turf/centroid';
import bbox from '@turf/bbox'
import { randomPoint } from '@turf/random';
import pointsWithinPolygon from '@turf/points-within-polygon';


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

    async getLatLonFromRegion(
        region: {
            division: string;
            district: string;
            upazila: string;
            union: string;
            mouza: string;
        },
        randomizeWithinRegion: boolean = false
    ): Promise<[number, number] | undefined> {
        const { division, district, upazila, union, mouza } = region;
    
        const mouzaFilename = `mouza-by-upazila/${division}-${district}-${upazila}.geojson`;
    
        let mouzaData: FeatureCollection;
        try {
            mouzaData = await loadGeoJSONFromGCS(mouzaFilename);
        } catch {
            return undefined;
        }
    
        for (const feat of mouzaData.features) {
            if (
                feat.properties?.uni === union &&
                feat.properties?.mou === mouza
            ) {
                if (randomizeWithinRegion) {
                    const geom = feat.geometry;
                    if (geom && (geom.type === 'Polygon' || geom.type === 'MultiPolygon')) {
                        const [minX, minY, maxX, maxY] = bbox(feat);
                        const maxAttempts = 10;
    
                        for (let i = 0; i < maxAttempts; i++) {
                            const candidates = randomPoint(1, {
                                bbox: [minX, minY, maxX, maxY],
                            });
    
                            const within = pointsWithinPolygon(
                                candidates,
                                feat as Feature<Polygon | MultiPolygon>
                            );
    
                            const coords = within.features[0]?.geometry?.coordinates;
                            if (
                                coords &&
                                typeof coords[0] === 'number' &&
                                typeof coords[1] === 'number'
                            ) {
                                return [coords[1], coords[0]];
                            }
                        }
                    }
                }
    
                const c = centroid(feat);
                const coords = c.geometry?.coordinates;
                if (
                    coords &&
                    typeof coords[0] === 'number' &&
                    typeof coords[1] === 'number'
                ) {
                    return [coords[1], coords[0]];
                }
    
                return undefined;
            }
        }
    
        return undefined;
    }
};
