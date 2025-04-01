import { Storage } from '@google-cloud/storage';
import { Model6Data } from '../../types';
import { ModelMessageCode } from 'iarsenic-types';
import { Well } from 'iarsenic-types';

// Setup GCS client — assumes Application Default Credentials or service account key
const storage = new Storage();
const bucketName = 'iarsenic-model6';

async function fetchModelDataFromGCS(filename: string): Promise<Model6Data> {
    const file = storage.bucket(bucketName).file(`model/${filename}`);
    const [contents] = await file.download();
    return JSON.parse(contents.toString());
}

export default async function produceEstimate(well: Well): Promise<ModelMessageCode> {
    if (!well.regionKey) throw new Error('region key not found in well data');

    const div = well.regionKey.division;
    const dis = well.regionKey.district;
    const upa = well.regionKey.upazila;
    const uni = well.regionKey.union;
    const mou = well.regionKey.mouza;

    const filename = `${div}-${dis}-${upa}-${uni}-${mou}.json`;
    const modelData: Model6Data = await fetchModelDataFromGCS(filename);

    const depth = well.depth;
    if (!depth && depth !== 0) throw new Error('depth not found in well data');

    const regionStrataKey = (() => {
        if (depth < 15.3) return 's15';
        else if (depth < 45) return 's45';
        else if (depth < 65) return 's65';
        else if (depth < 90) return 's90';
        else if (depth < 150) return 's150';
        else return 'sD';
    })();

    const { asValue, upperQuantile } = (() => {
        if (regionStrataKey === 's15') {
            if (modelData?.s15 && 'm2' in modelData.s15) {
                if (well.staining === 'black' && modelData.s15.m2 !== undefined) {
                    return { asValue: modelData.s15.m2, upperQuantile: modelData.s15.m9 };
                } else if (well.flooding && modelData.s15.m9 !== undefined) {
                    return { asValue: modelData.s15.m9, upperQuantile: modelData.s15.m9 };
                } else if (modelData.s15.m7 !== undefined) {
                    return { asValue: modelData.s15.m7, upperQuantile: modelData.s15.m9 };
                } else {
                    throw new Error('model keys required for flooding model missing');
                }
            }
        } else {
            if (well.staining === 'black' || well.utensilStaining === 'black') {
                return { asValue: 0, upperQuantile: 0 }; // well is safe
            } else if (well.staining === 'red' || well.utensilStaining === 'red') {
                if (modelData?.[regionStrataKey]) {
                    return { 
                        asValue: modelData[regionStrataKey].m, 
                        upperQuantile: modelData[regionStrataKey].u,
                    };
                }
            } 
        }
        console.error(well)
        console.error(modelData)
        throw new Error('Unable to make prediction');
    })()

    const modelMessageCode: ModelMessageCode = (() => {
        const chemTestStatus = (upperQuantile <= 100) ? 0 : 1;

        if (asValue <= 20) return (1);
        else if (asValue <= 50) return (3 + chemTestStatus) as ModelMessageCode;
        else if (asValue <= 200) return (5 + chemTestStatus) as ModelMessageCode;
        else return (7 + chemTestStatus) as ModelMessageCode;
    })()

    return modelMessageCode
}
