// region name
export type RegionKey = {
    division: string,
    district: string,
    upazila: string,
    union: string,
    mouza: string,
}

// dropdown data typing
export type DropdownUnion = {
    union: string;
    mouzas: string[];
}

export type DropdownUpazila = {
    upazila: string;
    unions: DropdownUnion[];
}

export type DropdownDistrict = {
    district: string;
    upazilas: DropdownUpazila[];
}

export type DropdownDivision = {
    division: string;
    districts: DropdownDistrict[];
}

// staining types
export type WellStaining = 'Black' | 'Red' | 'Not sure';
export type UtensilStaining = 'Red' | 'Black' | 'No colour change to slightly blackish';

// prediction data
export type PredictionData = {
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
                                            m: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9,
                                            l?: number,
                                            u?: number,
                                            m2?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9,
                                            m7?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9,
                                            m9?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9,
                                        },
                                        s45: {
                                            m: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9,
                                        },
                                        s65: {
                                            m: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9,
                                        },
                                        s90: {
                                            m: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9,
                                        },
                                        s150: {
                                            m: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9,
                                            l: number,
                                            u: number,
                                        },
                                        sD: {
                                            m: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9,
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


