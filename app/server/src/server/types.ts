import { ModelMessageCode } from 'iarsenic-types';

// // prediction data
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
                                            m: ModelMessageCode,
                                            l?: number,
                                            u?: number,
                                            m2?: ModelMessageCode,
                                            m7?: ModelMessageCode,
                                            m9?: ModelMessageCode,
                                        },
                                        s45: {
                                            m: ModelMessageCode,
                                        },
                                        s65: {
                                            m: ModelMessageCode,
                                        },
                                        s90: {
                                            m: ModelMessageCode,
                                        },
                                        s150: {
                                            m: ModelMessageCode,
                                            l: number,
                                            u: number,
                                        },
                                        sD: {
                                            m: ModelMessageCode,
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