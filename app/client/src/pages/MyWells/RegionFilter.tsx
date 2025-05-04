import { Stack, TextField } from '@mui/material';

interface RegionFilter {
    division: string;
    district: string;
    upazila: string;
    union: string;
    mouza: string;
}

interface Props {
    region: RegionFilter;
    onChange: (field: keyof RegionFilter, value: string) => void;
}

export default function RegionFilterDropdown({ region, onChange }: Props) {
    return (
        <Stack spacing={2}>
            <TextField
                label="Division"
                select
                value={region.division}
                onChange={(e) => onChange('division', e.target.value)}
                fullWidth
            >
                {/* Options to be populated later */}
            </TextField>

            <TextField
                label="District"
                select
                value={region.district}
                onChange={(e) => onChange('district', e.target.value)}
                fullWidth
            >
                {/* Options to be populated later */}
            </TextField>

            <TextField
                label="Upazila"
                select
                value={region.upazila}
                onChange={(e) => onChange('upazila', e.target.value)}
                fullWidth
            >
                {/* Options to be populated later */}
            </TextField>

            <TextField
                label="Union"
                select
                value={region.union}
                onChange={(e) => onChange('union', e.target.value)}
                fullWidth
            >
                {/* Options to be populated later */}
            </TextField>

            <TextField
                label="Mouza"
                select
                value={region.mouza}
                onChange={(e) => onChange('mouza', e.target.value)}
                fullWidth
            >
                {/* Options to be populated later */}
            </TextField>
        </Stack>
    );
}
