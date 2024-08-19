import { MessageCode, ModelData } from '../../../types'
import { Predictors } from '../../models/well.model'
import path from 'path'
import fs from 'fs'

export default function produceEstimate(predictors: Predictors): MessageCode {
    const div = predictors.regionKey.division;
    const dis = predictors.regionKey.district;
    const upa = predictors.regionKey.upazila;
    const uni = predictors.regionKey.union;
    const mou = predictors.regionKey.mouza;

    const modelData: ModelData = JSON.parse(
        fs.readFileSync(
            path.join(
                `model5/aggregate-data/${div}-${dis}.json`
            ),
            'utf-8'
        )
    )

    const divData = modelData[div];
    if (!divData) throw new Error('division not found in model data');

    const disData = divData.districts[dis];
    if (!disData) throw new Error('district not found in model data');

    const upaData = disData.upazilas[upa];
    if (!upaData) throw new Error('upazila not found in model data');

    const uniData = upaData.unions[uni];
    if (!uniData) throw new Error('union not found in model data');

    const mouData = uniData.mouzas[mou];
    if (!mouData) throw new Error('mouza not found in model data');

    const depth = predictors.depth;

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
        if (predictors.staining === 'black' && regionStrataModel.m2 !== undefined) {
            return regionStrataModel.m2;
        } else if (predictors.flooding && regionStrataModel.m9 !== undefined) {
            return regionStrataModel.m9;
        } else if (regionStrataModel.m7 !== undefined) {
            return regionStrataModel.m7;
        } else {
            throw new Error('model keys required for flooding model misisng');
        }
    } else {
        if (predictors.staining === 'black' || predictors.utensilStaining === 'black') {
            return 1;
        } else if (predictors.staining === 'red' || predictors.utensilStaining === 'red') {
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
