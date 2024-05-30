import {
    MessageCode,
    PredictionData,
    RegionKey,
    UtensilStaining,
    WellStaining,
} from '../../types';

export default function produceEstimate(
        predictionData: PredictionData,
        region: RegionKey,
        depth: number,
        wellStaining: WellStaining,
        utensilStaining: UtensilStaining,
        flood: boolean,
    ): MessageCode {
    const regionData = predictionData[region.division]
        .districts[region.district]
        .upazilas[region.upazila]
        .unions[region.union]
        .mouzas[region.mouza]

    const regionStrataKey= (() => {
        if (depth < 15.3) return 's15';
        else if (depth < 45) return 's45';
        else if (depth < 65) return 's65';
        else if (depth < 90) return 's90';
        else if (depth < 150) return 's150';
        else return 'sD';
    })()

    const regionStrataModel = regionData[regionStrataKey]

    /*
        if depth is < 15.3 attempt to use the flooding model
        if the flooding model is available, the key 'm2' will
        exist in the prediction data for this region
    */
    if (regionStrataKey === 's15' && 'm2' in regionStrataModel) {
        if (wellStaining === 'Black' && regionStrataModel.m2 !== undefined) {
            return regionStrataModel.m2;
        } else if (flood === true && regionStrataModel.m9 !== undefined) {
            return regionStrataModel.m9;
        } else if (regionStrataModel.m7 !== undefined) {
            return regionStrataModel.m7;
        } else {
            throw new Error('model keys required for flooding model misisng')
        }
    } else {
        if (wellStaining === 'Black' || utensilStaining === 'No colour change to slightly blackish') {
            return 1;
        } else if (wellStaining === 'Red' || utensilStaining === 'Red') {
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
