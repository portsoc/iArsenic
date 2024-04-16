import { Typography, Autocomplete, TextField, Button, Stack } from "@mui/material";
import config from "../../config";
import { useEffect, useState } from "react";
import { navigate } from "wouter/use-browser-location";
import { DropdownDistrict, DropdownDivision, DropdownUnion, DropdownUpazila } from "../../types";

export default function Region(): JSX.Element {
    const [dropdownData, setDropdownData] = useState<DropdownDivision[]>([]);
    const [selectedDivision, setSelectedDivision] = useState<DropdownDivision | null>(null);
    const [selectedDistrict, setSelectedDistrict] = useState<DropdownDistrict | null>(null);
    const [selectedUpazila, setSelectedUpazila] = useState<DropdownUpazila | null>(null);
    const [selectedUnion, setSelectedUnion] = useState<DropdownUnion | null>(null);
    const [selectedMouza, setSelectedMouza] = useState<string | null>(null);

    async function fetchDropdownData() {
        const response = await fetch(`${config.basePath}/model5/dropdown-data.json`);
        const data: DropdownDivision[] = await response.json();
        setDropdownData(data);
    }

    useEffect(() => {
        fetchDropdownData();
    }, []);

    const districtOptions = selectedDivision?.districts || [];
    const upazilaOptions = selectedDistrict?.upazilas || [];
    const unionOptions = selectedUpazila?.unions || [];

    return (
        <>
            <Typography alignSelf='center' variant="h4">Region</Typography>

            <Stack width='90%' spacing={2}>
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

            <Button
                sx={{ width: '90%', height: '4rem' }}
                variant='contained'
                onClick={() => {
                    localStorage.setItem('region', JSON.stringify({
                        division: selectedDivision?.division,
                        district: selectedDistrict?.district,
                        upazila: selectedUpazila?.upazila,
                        union: selectedUnion?.union,
                        mouza: selectedMouza
                    }));
                    navigate(`${config.basePath}/staining`)
                }}
            >
                Next Step
            </Button>
        </>
    );
}
