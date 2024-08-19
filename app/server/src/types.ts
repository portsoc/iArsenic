import { RegionKey } from './server/models/well.model';

export type Predictors = {
    id: string,
    regionKey: RegionKey
    depth: number, // meters
    flooding: boolean,
    wellStaining: WellStaining,
    utensilStaining?: UtensilStaining,
    geolocation?: [number, number],
    regionGeovalidated: boolean,
}

// staining types
export type WellStaining = 'Black' | 'Red' | 'Not sure';
export type UtensilStaining = 'Red' | 'Black' | 'No colour change to slightly blackish' | 'N/A' | undefined;

// prediction data
export type MessageCode = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type ModelData = {
    [key: string]: {
        districts: {
            [key: string]: {
                upazilas: {
                    [key: string]: {
                        unions: {
                            [key: string]: {
                                mouzas: {
                                    [key: string]: {
                                        s15: {
                                            m: MessageCode,
                                            l?: number,
                                            u?: number,
                                            m2?: MessageCode,
                                            m7?: MessageCode,
                                            m9?: MessageCode,
                                        },
                                        s45: {
                                            m: MessageCode,
                                        },
                                        s65: {
                                            m: MessageCode,
                                        },
                                        s90: {
                                            m: MessageCode,
                                        },
                                        s150: {
                                            m: MessageCode,
                                            l: number,
                                            u: number,
                                        },
                                        sD: {
                                            m: MessageCode,
                                            l: number,
                                            u: number,
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}