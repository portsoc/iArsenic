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

export default function() {
    const [open, setOpen] = useState(false);
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

    function handleRegionChange(field: keyof typeof filters.region, value: string) {
        setFilters({
            ...filters,
            region: {
                ...filters.region,
                [field]: value,
            },
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
                <Button variant='outlined'>
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
                    <TextField
                        label="Division"
                        select
                        value={filters.region.division}
                        onChange={(e) => handleRegionChange('division', e.target.value)}
                        fullWidth
                    >
                        {/* Options to be populated later */}
                    </TextField>

                    <TextField
                        label="District"
                        select
                        value={filters.region.district}
                        onChange={(e) => handleRegionChange('district', e.target.value)}
                        fullWidth
                    >
                        {/* Options to be populated later */}
                    </TextField>

                    <TextField
                        label="Upazila"
                        select
                        value={filters.region.upazila}
                        onChange={(e) => handleRegionChange('upazila', e.target.value)}
                        fullWidth
                    >
                        {/* Options to be populated later */}
                    </TextField>

                    <TextField
                        label="Union"
                        select
                        value={filters.region.union}
                        onChange={(e) => handleRegionChange('union', e.target.value)}
                        fullWidth
                    >
                        {/* Options to be populated later */}
                    </TextField>

                    <TextField
                        label="Mouza"
                        select
                        value={filters.region.mouza}
                        onChange={(e) => handleRegionChange('mouza', e.target.value)}
                        fullWidth
                    >
                        {/* Options to be populated later */}
                    </TextField>

                    <Divider />

                    <TextField
                        label="Above Depth"
                        type="number"
                        value={filters.aboveDepth}
                        onChange={(e) => handleTextChange('aboveDepth', e.target.value)}
                        fullWidth
                    />

                    <TextField
                        label="Below Depth"
                        type="number"
                        value={filters.belowDepth}
                        onChange={(e) => handleTextChange('belowDepth', e.target.value)}
                        fullWidth
                    />

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
