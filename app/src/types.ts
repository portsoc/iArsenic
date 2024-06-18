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
export type UtensilStaining = 'Red' | 'Black' | 'No colour change to slightly blackish' | undefined;

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

// key is english region name, value is bengali
export type RegionTranslations = {
    "Divisions": {
        [key: string]: string
    },
    "Districts": {
        [key: string]: string
    },
    "Upazilas": {
        [key: string]: string
    },
    "Unions": {
        [key: string]: string
    },
    "Mouzas": {
        [key: string]: string
    }
}