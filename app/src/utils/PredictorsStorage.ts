import { Predictors } from '../types';

export default class PredictorsStorage {
    static dataKey: string = 'predictionData';

    static get = (): Partial<Predictors> => {
        return JSON.parse(localStorage.getItem(this.dataKey) || '{}');
    };

    static set = (predictors: Partial<Predictors>) => {
        const currentPredictors = PredictorsStorage.get();

        // predictors overwrite attributes of currentPredictors
        localStorage.setItem(
            PredictorsStorage.dataKey,
            JSON.stringify({
                ...currentPredictors,
                ...predictors,
            })
        );
    };

    static validate = (predictors: Partial<Predictors>): { ok: boolean, msg: string } => {
        if (predictors.id === undefined) return { ok: false, msg: 'ID not set' };
        if (predictors.regionKey === undefined) return { ok: false, msg: 'Region not set' };
        if (predictors.depth === undefined) return { ok: false, msg: 'Depth not set' };
        if (predictors.flooding === undefined) return { ok: false, msg: 'Flooding not set' };
        if (predictors.wellStaining === undefined) return { ok: false, msg: 'Well staining not set' };
        if (predictors.regionGeovalidated === undefined) return { ok: false, msg: 'Region geovalidation not set' };

        return { ok: true, msg: 'valid' };
    };

    static delete = () => {
        localStorage.removeItem(PredictorsStorage.dataKey);
    };
}