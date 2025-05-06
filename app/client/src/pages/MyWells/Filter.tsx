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
import { useState } from 'react';
import RegionFilter from './filter/RegionFilter';
import { DropdownDistrict, DropdownDivision, DropdownUnion, DropdownUpazila } from '../../types';

interface props {
    dropdownData: DropdownDivision[];
    setQueryParams: React.Dispatch<React.SetStateAction<string>>;
}

export default function Filter({ dropdownData, setQueryParams }: props) {
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
        geolocated: false,
        hasImages: false,
        complete: false,
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
        if (filters.geolocated) params.append("geolocated", "true");
        if (filters.hasImages) params.append("hasImages", "true");
        if (filters.complete) params.append("complete", "true");
    
        if (filters.flooding) params.append("flooding", filters.flooding);
        if (filters.staining) params.append("staining", filters.staining);
    
        if (filters.aboveDepth) params.append("depth_gte", filters.aboveDepth);
        if (filters.belowDepth) params.append("depth_lte", filters.belowDepth);
    
        // Read region selections directly
        if (selectedDivision?.division) params.append("division", selectedDivision.division);
        if (selectedDistrict?.district) params.append("district", selectedDistrict.district);
        if (selectedUpazila?.upazila) params.append("upazila", selectedUpazila.upazila);
        if (selectedUnion?.union) params.append("union", selectedUnion.union);
        if (selectedMouza) params.append("mouza", selectedMouza);
    
        const newQuery = params.toString();
        setQueryParams((prev: string | undefined) => {
            if (prev === newQuery) return prev; // No actual change — do nothing
            return newQuery;
        });
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
