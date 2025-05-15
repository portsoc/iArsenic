import { MenuItem, Stack, TextField, Button } from '@mui/material';
import {
    DropdownDivision,
    DropdownDistrict,
    DropdownUpazila,
    DropdownUnion,
} from '../../../types';
import TranslatableText from '../../../components/TranslatableText';

interface Props {
    dropdownData: DropdownDivision[];
    selectedDivision: DropdownDivision | null;
    setSelectedDivision: (newValue: DropdownDivision | null) => void;
    selectedDistrict: DropdownDistrict | null;
    setSelectedDistrict: (newValue: DropdownDistrict | null) => void;
    selectedUpazila: DropdownUpazila | null;
    setSelectedUpazila: (newValue: DropdownUpazila | null) => void;
    selectedUnion: DropdownUnion | null;
    setSelectedUnion: (newValue: DropdownUnion | null) => void;
    selectedMouza: string | null;
    setSelectedMouza: (newValue: string | null) => void;
}

export default function RegionFilter({
    dropdownData,
    selectedDivision,
    setSelectedDivision,
    selectedDistrict,
    setSelectedDistrict,
    selectedUpazila,
    setSelectedUpazila,
    selectedUnion,
    setSelectedUnion,
    selectedMouza,
    setSelectedMouza,
}: Props) {
    function clearRegion() {
        setSelectedDivision(null);
        setSelectedDistrict(null);
        setSelectedUpazila(null);
        setSelectedUnion(null);
        setSelectedMouza(null);
    }

    return (
        <Stack spacing={2}>
            <Button variant="outlined" onClick={clearRegion}>
                <TranslatableText
                    variant='body1'
                    english='Clear Region Filter'
                    bengali='BENGALI PLACEHOLDER'
                />
            </Button>

            <TextField
                select
                value={selectedDivision?.division || ''}
                onChange={(e) => {
                    const newDivision = dropdownData.find(d => d.division === e.target.value);
                    if (!newDivision) throw Error();
                    setSelectedDivision(newDivision);
                    setSelectedDistrict(null);
                    setSelectedUpazila(null);
                    setSelectedUnion(null);
                    setSelectedMouza(null);
                }}
                fullWidth
                label={
                    <TranslatableText 
                        variant='body1' 
                        english='Division'
                        bengali='BENGALI PLACEHOLDEr'
                    />
                }
            >
                {dropdownData.map(d => (
                    <MenuItem key={d.division} value={d.division}>
                        {d.division}
                    </MenuItem>
                ))}
            </TextField>

            <TextField
                label="District"
                select
                value={selectedDistrict?.district || ''}
                onChange={(e) => {
                    const newDistrict = selectedDivision?.districts.find(d => d.district === e.target.value) || null;
                    setSelectedDistrict(newDistrict);
                    setSelectedUpazila(null);
                    setSelectedUnion(null);
                    setSelectedMouza(null);
                }}
                fullWidth
                disabled={!selectedDivision}
            >
                {selectedDivision?.districts.map(d => (
                    <MenuItem key={d.district} value={d.district}>
                        {d.district}
                    </MenuItem>
                )) || []}
            </TextField>

            <TextField
                label="Upazila"
                select
                value={selectedUpazila?.upazila || ''}
                onChange={(e) => {
                    const newUpazila = selectedDistrict?.upazilas.find(u => u.upazila === e.target.value) || null;
                    setSelectedUpazila(newUpazila);
                    setSelectedUnion(null);
                    setSelectedMouza(null);
                }}
                fullWidth
                disabled={!selectedDistrict}
            >
                {selectedDistrict?.upazilas.map(u => (
                    <MenuItem key={u.upazila} value={u.upazila}>
                        {u.upazila}
                    </MenuItem>
                )) || []}
            </TextField>

            <TextField
                label="Union"
                select
                value={selectedUnion?.union || ''}
                onChange={(e) => {
                    const newUnion = selectedUpazila?.unions.find(u => u.union === e.target.value) || null;
                    setSelectedUnion(newUnion);
                    setSelectedMouza(null);
                }}
                fullWidth
                disabled={!selectedUpazila}
            >
                {selectedUpazila?.unions.map(u => (
                    <MenuItem key={u.union} value={u.union}>
                        {u.union}
                    </MenuItem>
                )) || []}
            </TextField>

            <TextField
                label="Mouza"
                select
                value={selectedMouza || ''}
                onChange={(e) => {
                    setSelectedMouza(e.target.value);
                }}
                fullWidth
                disabled={!selectedUnion}
            >
                {selectedUnion?.mouzas.map(m => (
                    <MenuItem key={m} value={m}>
                        {m}
                    </MenuItem>
                )) || []}
            </TextField>
        </Stack>
    );
}
