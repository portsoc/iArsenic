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
    Button
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useEffect, useState } from 'react';
import RegionFilter from './filter/RegionFilter';
import { DropdownDistrict, DropdownDivision, DropdownUnion, DropdownUpazila } from '../../types';

interface props {
    dropdownData: DropdownDivision[];
    setQueryParams: (queryString: string) => void;
}

export default function({ dropdownData, setQueryParams }: props) {
    const [open, setOpen] = useState(false);
    const [selectedDivision, setSelectedDivision] = useState<DropdownDivision | null>(null);
    const [selectedDistrict, setSelectedDistrict] = useState<DropdownDistrict | null>(null);
    const [selectedUpazila, setSelectedUpazila] = useState<DropdownUpazila | null>(null);
    const [selectedUnion, setSelectedUnion] = useState<DropdownUnion | null>(null);
    const [selectedMouza, setSelectedMouza] = useState<string | null>(null);

    const [filters, setFilters] = useState({
        wellInUse: false,
        flooding: '',
        staining: '',
        geoLocated: false,
        hasImages: false,
        aboveDepth: '',
        belowDepth: '',
        region: {
            division: '',
            district: '',
            upazila: '',
            union: '',
            mouza: '',
        },
    });

    function buildQueryParams(): void {
        const params = new URLSearchParams();
    
        if (filters.wellInUse) params.append("wellInUse", "true");
        if (filters.geoLocated) params.append("geolocation_exists", "true");
        if (filters.hasImages) params.append("hasImages", "true");
    
        if (filters.flooding) params.append("flooding", filters.flooding);
        if (filters.staining) params.append("staining", filters.staining);
    
        const region = filters.region || {};
        if (region.division) params.append("regionKey.division", region.division);
        if (region.district) params.append("regionKey.district", region.district);
        if (region.upazila) params.append("regionKey.upazila", region.upazila);
        if (region.union) params.append("regionKey.union", region.union);
        if (region.mouza) params.append("regionKey.mouza", region.mouza);
    
        setQueryParams(params.toString())
    }


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

    useEffect(() => {
        setFilters((prev) => ({
            ...prev,
            region: {
                division: selectedDivision?.division || '',
                district: selectedDistrict?.district || '',
                upazila: selectedUpazila?.upazila || '',
                union: selectedUnion?.union || '',
                mouza: selectedMouza || '',
            },
        }));
    }, [
        selectedDivision,
        selectedDistrict,
        selectedUpazila,
        selectedUnion,
        selectedMouza
    ]);

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
                    onClick={() => setOpen(!open)}
                    sx={{
                        cursor: 'pointer',
                    }}
                >
                    <IconButton>
                        <FilterListIcon />
                    </IconButton>
                    <Typography variant="h6">Filters</Typography>
                </Box>
                <Button 
                    variant='outlined'
                    onClick={() => buildQueryParams()}
                >
                    Apply
                </Button>
            </Box>

            <Collapse in={open}>
                <Stack spacing={2}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={filters.wellInUse}
                                onChange={() => handleCheckboxChange('wellInUse')}
                            />
                        }
                        label="Well in Use"
                    />

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={filters.geoLocated}
                                onChange={() => handleCheckboxChange('geoLocated')}
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

                    <Divider />

                    <Typography variant="subtitle1">Region</Typography>
                    <RegionFilter
                        dropdownData={dropdownData}
                        selectedDivision={selectedDivision}
                        setSelectedDivision={setSelectedDivision}
                        selectedDistrict={selectedDistrict}
                        setSelectedDistrict={setSelectedDistrict}
                        selectedUpazila={selectedUpazila}
                        setSelectedUpazila={setSelectedUpazila}
                        selectedUnion={selectedUnion}
                        setSelectedUnion={setSelectedUnion}
                        selectedMouza={selectedMouza}
                        setSelectedMouza={setSelectedMouza}
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
