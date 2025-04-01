import { ModelMessageCode } from 'iarsenic-types';

// prediction data
export type Model5Data = {
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

export type Model6Data = {
    s15?: {
        m: number,
        m2: number,
        m7: number,
        m9: number,
        l: number,
        u: number,
    },
    s45?: {
        m: number,
        l: number,
        u: number,
    },
    s65?: {
        m: number,
        l: number,
        u: number,
    },
    s90?: {
        m: number,
        l: number,
        u: number,
    },
    s150?: {
        m: number,
        l: number,
        u: number,
    },
    sD?: {
        m: number,
        l: number,
        u: number,
    }
}