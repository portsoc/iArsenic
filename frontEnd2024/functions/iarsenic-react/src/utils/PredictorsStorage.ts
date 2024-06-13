import { RegionKey, WellStaining, UtensilStaining } from '../types';

export type Predictors = {
    regionKey: RegionKey
    depth: {
        unit: 'ft' | 'm'
        value: number
    },
    wellStaining: WellStaining,
    utensilStaining?: UtensilStaining,
}

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
        if (predictors.regionKey === undefined) return { ok: false, msg: 'Region not set' };
        if (predictors.depth === undefined) return { ok: false, msg: 'Depth not set' };
        if (predictors.wellStaining === undefined) return { ok: false, msg: 'Well staining not set' };

        return { ok: true, msg: 'valid' };
    };

    static delete = () => {
        localStorage.removeItem(PredictorsStorage.dataKey);
    };
}