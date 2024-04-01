import { Container, Typography, Autocomplete, TextField, Button, Stack } from "@mui/material";
import config from "../../config";
import { useEffect, useState } from "react";

interface Union {
    union: string;
    mouzas: string[];
}

interface Upazila {
    upazila: string;
    unions: Union[];
}

interface District {
    district: string;
    upazilas: Upazila[];
}

interface Division {
    division: string;
    districts: District[];
}

export default function Region(): JSX.Element {
    const [dropdownData, setDropdownData] = useState<Division[]>([]);
    const [selectedDivision, setSelectedDivision] = useState<Division | null>(null);
    const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
    const [selectedUpazila, setSelectedUpazila] = useState<Upazila | null>(null);
    const [selectedUnion, setSelectedUnion] = useState<Union | null>(null);
    const [selectedMouza, setSelectedMouza] = useState<string | null>(null);

    async function fetchDropdownData() {
        const response = await fetch(`${config.basePath}/model5/dropdown-data.json`);
        const data: Division[] = await response.json();
        setDropdownData(data);
    }

    useEffect(() => {
        fetchDropdownData();
    }, []);

    const districtOptions = selectedDivision?.districts || [];
    const upazilaOptions = selectedDistrict?.upazilas || [];
    const unionOptions = selectedUpazila?.unions || [];

    return (
        <Stack
            maxHeight={'min-content'}
            maxWidth={'30rem'}
            margin='auto'
            spacing={4}
            direction='column'
        >
            <Typography alignSelf='center' variant="h4">Region</Typography>

            <Stack spacing={2}>
                <Autocomplete
                    options={dropdownData}
                    value={selectedDivision}
                    onChange={(_, newValue) => {
                        setSelectedDivision(newValue);
                        setSelectedDistrict(null);
                        setSelectedUpazila(null);
                        setSelectedUnion(null);
                    }}
                    getOptionLabel={(option) => option.division}
                    renderInput={(params) => <TextField {...params} label="Division" />}
                />
                <Autocomplete
                    options={districtOptions}
                    value={selectedDistrict}
                    onChange={(_, newValue) => {
                        setSelectedDistrict(newValue);
                        setSelectedUpazila(null);
                        setSelectedUnion(null);
                    }}
                    getOptionLabel={(option) => option.district}
                    renderInput={(params) => <TextField {...params} label="District" />}
                    disabled={!selectedDivision}
                />
                <Autocomplete
                    options={upazilaOptions}
                    value={selectedUpazila}
                    onChange={(_, newValue) => {
                        setSelectedUpazila(newValue);
                        setSelectedUnion(null);
                    }}
                    getOptionLabel={(option) => option.upazila}
                    renderInput={(params) => <TextField {...params} label="Upazila" />}
                    disabled={!selectedDistrict}
                />
                <Autocomplete
                    options={unionOptions}
                    value={selectedUnion}
                    onChange={(_, newValue) => {
                        setSelectedUnion(newValue);
                    }}
                    getOptionLabel={(option) => option.union}
                    renderInput={(params) => <TextField {...params} label="Union" />}
                    disabled={!selectedUpazila}
                />
                <Autocomplete
                    options={selectedUnion ? selectedUnion.mouzas : []}
                    value={selectedMouza}
                    onChange={(_, newValue) => {
                        setSelectedMouza(newValue);
                    }}
                    getOptionLabel={(mouza) => mouza}
                    renderInput={(params) => <TextField {...params} label="Mouza" />}
                    disabled={!selectedUnion}
                />
            </Stack>
            <Button sx={{height: '5rem'}} variant="contained" color="primary">Next Step</Button>
        </Stack>
    );
}
