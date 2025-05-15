import {
    Box,
    IconButton,
    Collapse,
    TextField,
    MenuItem,
    Checkbox,
    FormControlLabel,
    Stack,
    Divider,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useState } from 'react';
import RegionFilter from './filter/RegionFilter';
import { DropdownDistrict, DropdownDivision, DropdownUnion, DropdownUpazila } from '../../types';
import { FiltersType } from './FiltersType';
import TranslatableText from '../../components/TranslatableText';
import PageCard from '../../components/PageCard';

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
        <PageCard>
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
                    
                    <TranslatableText 
                        variant='h6' 
                        english='Filters'
                        bengali='BENGALI PLACEHOLDER'
                    />
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
                        label={
                            <TranslatableText 
                                variant='body1' 
                                english='Geolocated'
                                bengali='BENGALI PLACEHOLDER'
                            />
                        }
                    />

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={filters.hasImages}
                                onChange={() => handleCheckboxChange('hasImages')}
                            />
                        }
                        label={
                            <TranslatableText 
                                variant='body1' 
                                english='Includes Images'
                                bengali='BENGALI PLACEHOLDER'
                            />
                        }
                    />

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={filters.complete}
                                onChange={() => handleCheckboxChange('complete')}
                            />
                        }
                        label={
                            <TranslatableText 
                                variant='body1' 
                                english='Complete Well'
                                bengali='BENGALI PLACEHOLDER'
                            />
                        }
                    />

                    <Divider />

                    <TranslatableText 
                        variant='h5' 
                        english='Region'
                        bengali='BENGALI PLACEHOLDER'
                    />
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
                        select
                        value={filters.flooding}
                        onChange={(e) => handleTextChange('flooding', e.target.value)}
                        fullWidth
                        label={
                            <TranslatableText 
                                variant='body1' 
                                english='Flooding'
                                bengali='BENGALI PLACEHOLDER'
                            />
                        }
                    >
                        <MenuItem value="">
                            <TranslatableText 
                                variant='body1' 
                                english='Any'
                                bengali='BENGALI PLACEHOLDER'
                            />
                        </MenuItem>
                        <MenuItem value="true">
                            <TranslatableText 
                                variant='body1' 
                                english='Yes'
                                bengali='BENGALI PLACEHOLDER'
                            />
                        </MenuItem>
                        <MenuItem value="false">
                            <TranslatableText 
                                variant='body1' 
                                english='No'
                                bengali='BENGALI PLACEHOLDER'
                            />
                        </MenuItem>
                    </TextField>

                    <TextField
                        select
                        value={filters.staining}
                        onChange={(e) => handleTextChange('staining', e.target.value)}
                        fullWidth
                        label={
                            <TranslatableText 
                                variant='body1' 
                                english='Staining'
                                bengali='BENGALI PLACEHOLDER'
                            />
                        }
                    >
                        <MenuItem value="">
                            <TranslatableText 
                                variant='body1' 
                                english='Any'
                                bengali='BENGALI PLACEHOLDER'
                            />
                        </MenuItem>
                        <MenuItem value="red">
                            <TranslatableText 
                                variant='body1' 
                                english='Red'
                                bengali='BENGALI PLACEHOLDER'
                            />
                        </MenuItem>
                        <MenuItem value="black">
                            <TranslatableText 
                                variant='body1' 
                                english='Black'
                                bengali='BENGALI PLACEHOLDER'
                            />
                        </MenuItem>
                    </TextField>
                </Stack>
            </Collapse>
        </PageCard>
    );
}
