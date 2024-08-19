import { MessageCode, ModelData } from '../../../types';
import { Predictors } from '../../../types';

export default function produceEstimate(
        modelData: ModelData,
        predictors: Predictors,
    ): MessageCode {
    const divData = modelData[predictors.regionKey.division];
    if (!divData) throw new Error('division not found in model data');

    const disData = divData.districts[predictors.regionKey.district];
    if (!disData) throw new Error('district not found in model data');

    const upaData = disData.upazilas[predictors.regionKey.upazila];
    if (!upaData) throw new Error('upazila not found in model data');

    const uniData = upaData.unions[predictors.regionKey.union];
    if (!uniData) throw new Error('union not found in model data');

    const mouData = uniData.mouzas[predictors.regionKey.mouza];
    if (!mouData) throw new Error('mouza not found in model data');

    const depth = (() => {
        if (predictors.depth.unit === 'ft') {
            return predictors.depth.value * 0.3048;
        }

        return predictors.depth.value;
    })();

    const regionStrataKey = (() => {
        if (depth < 15.3) return 's15';
        else if (depth < 45) return 's45';
        else if (depth < 65) return 's65';
        else if (depth < 90) return 's90';
        else if (depth < 150) return 's150';
        else return 'sD';
    })();

    const regionStrataModel = mouData[regionStrataKey];

    /*
        if depth is < 15.3 attempt to use the flooding model
        if the flooding model is available, the key 'm2' will
        exist in the prediction data for this region
    */
    if (regionStrataKey === 's15' && 'm2' in regionStrataModel) {
        if (predictors.wellStaining === 'Black' && regionStrataModel.m2 !== undefined) {
            return regionStrataModel.m2;
        } else if (predictors.flooding && regionStrataModel.m9 !== undefined) {
            return regionStrataModel.m9;
        } else if (regionStrataModel.m7 !== undefined) {
            return regionStrataModel.m7;
        } else {
            throw new Error('model keys required for flooding model misisng');
        }
    } else {
        if (predictors.wellStaining === 'Black' || predictors.utensilStaining === 'Black') {
            return 1;
        } else if (predictors.wellStaining === 'Red' || predictors.utensilStaining === 'Red') {
            if (regionStrataModel.m !== undefined) {
                return regionStrataModel.m;
            } else {
                throw new Error('model key required for red staining missing');
            }
        } else {
            return 0;
        }
    }
}
