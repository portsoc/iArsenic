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