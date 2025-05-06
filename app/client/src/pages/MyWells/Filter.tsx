import {
    Box,
    Typography,
    IconButton,
    Collapse,
    TextField,
    MenuItem,
    Checkbox,
    FormControlLabel,
    Stack,
    Divider,
    Card,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useState } from 'react';
import RegionFilter from './filter/RegionFilter';
import { DropdownDistrict, DropdownDivision, DropdownUnion, DropdownUpazila } from '../../types';
import { FiltersType } from './FiltersType';

interface props {
    dropdownData: DropdownDivision[];
    filters: FiltersType;
    setFilters: React.Dispatch<React.SetStateAction<FiltersType>>;
    filterOpen: boolean;
    setFilterOpen: (open: boolean) => void
}

export default function Filter({ 
    dropdownData, 
    filters,
    setFilters,
    filterOpen,
    setFilterOpen,
}: props) {
    const [selectedDivision, setSelectedDivision] = useState<DropdownDivision | null>(null);
    const [selectedDistrict, setSelectedDistrict] = useState<DropdownDistrict | null>(null);
    const [selectedUpazila, setSelectedUpazila] = useState<DropdownUpazila | null>(null);
    const [selectedUnion, setSelectedUnion] = useState<DropdownUnion | null>(null);
    const [selectedMouza, setSelectedMouza] = useState<string | null>(null);

    function handleCheckboxChange(field: keyof typeof filters) {
        setFilters({
            ...filters,
            [field]: !filters[field],
        });
    }

    function handleTextChange(field: keyof typeof filters, value: string) {
        setFilters({
            ...filters,
            [field]: value,
        });
    }

    return (
        <Card
            variant='outlined'
            sx={{
                margin: '0 1rem 1rem 1rem',
                padding: '1rem',
                width: '100%',
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
            }}
        >
            <Box 
                display="flex" 
                flexDirection='row' 
                justifyContent='space-between'
                width='100%'
            >
                <Box 
                    display='flex' 
                    flexDirection='row'
                    onClick={() => setFilterOpen(!filterOpen)}
                    sx={{
                        cursor: 'pointer',
                    }}
                >
                    <IconButton>
                        <FilterListIcon />
                    </IconButton>
                    <Typography variant="h6">Filters</Typography>
                </Box>
                {/* <Button 
                    variant='outlined'
                    onClick={() => buildQueryParams()}
                >
                    Apply
                </Button> */}
            </Box>

            <Collapse in={filterOpen}>
                <Stack spacing={2}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={filters.geolocated}
                                onChange={() => handleCheckboxChange('geolocated')}
                            />
                        }
                        label="Geolocated"
                    />

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={filters.hasImages}
                                onChange={() => handleCheckboxChange('hasImages')}
                            />
                        }
                        label="Includes Images"
                    />

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={filters.complete}
                                onChange={() => handleCheckboxChange('complete')}
                            />
                        }
                        label="Complete Well"
                    />

                    <Divider />

                    <Typography variant="subtitle1">Region</Typography>
                    <RegionFilter
                        dropdownData={dropdownData}
                        selectedDivision={selectedDivision}
                        setSelectedDivision={(division) => {
                            setSelectedDivision(division)
                            setFilters(f => ({
                                ...f,
                                region: {
                                    ...f.region,
                                    division: division?.division || '',
                                    district: '',
                                    upazila: '',
                                    union: '',
                                    mouza: '',
                                },
                            }));
                        }}
                        selectedDistrict={selectedDistrict}
                        setSelectedDistrict={(district) => {
                            setSelectedDistrict(district)
                            setFilters(f => ({
                                ...f,
                                region: {
                                    ...f.region,
                                    district: district?.district || '',
                                    upazila: '',
                                    union: '',
                                    mouza: '',
                                },
                            }));
                        }}
                        selectedUpazila={selectedUpazila}
                        setSelectedUpazila={(upazila) => {
                            setSelectedUpazila(upazila)
                            setFilters(f => ({
                                ...f,
                                region: {
                                    ...f.region,
                                    upazila: upazila?.upazila || '',
                                    union: '',
                                    mouza: '',
                                },
                            }));
                        }}
                        selectedUnion={selectedUnion}
                        setSelectedUnion={(union) => {
                            setSelectedUnion(union)
                            setFilters(f => ({
                                ...f,
                                region: {
                                    ...f.region,
                                    union: union?.union || '',
                                    mouza: '',
                                },
                            }));
                        }}
                        selectedMouza={selectedMouza}
                        setSelectedMouza={(mouza) => {
                            setSelectedMouza(mouza)
                            setFilters(f => ({
                                ...f,
                                region: {
                                    ...f.region,
                                    mouza: mouza || '',
                                },
                            }));
                        }}
                    />

                    <Divider />

                    <TextField
                        label="Flooding"
                        select
                        value={filters.flooding}
                        onChange={(e) => handleTextChange('flooding', e.target.value)}
                        fullWidth
                    >
                        <MenuItem value="">Any</MenuItem>
                        <MenuItem value="true">Yes</MenuItem>
                        <MenuItem value="false">No</MenuItem>
                    </TextField>

                    <TextField
                        label="Staining"
                        select
                        value={filters.staining}
                        onChange={(e) => handleTextChange('staining', e.target.value)}
                        fullWidth
                    >
                        <MenuItem value="">Any</MenuItem>
                        <MenuItem value="red">Red</MenuItem>
                        <MenuItem value="black">Black</MenuItem>
                    </TextField>
                </Stack>
            </Collapse>
        </Card>
    );
}
