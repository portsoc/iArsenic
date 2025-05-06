export type FiltersType = {
    wellInUse: boolean;
    flooding: string;
    staining: string;
    geolocated: boolean;
    hasImages: boolean;
    complete: boolean;
    aboveDepth: string;
    belowDepth: string;
    region: {
        division: string;
        district: string;
        upazila: string;
        union: string;
        mouza: string;
    };
};
