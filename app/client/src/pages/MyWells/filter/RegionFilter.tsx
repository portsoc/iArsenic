import { MenuItem, Stack, TextField, Button, CircularProgress } from '@mui/material';
import {
    DropdownDivision,
    DropdownDistrict,
    DropdownUpazila,
    DropdownUnion,
    RegionTranslations,
} from '../../../types';
import TranslatableText from '../../../components/TranslatableText';
import { useEffect, useState } from 'react';
import RegionTranslationsFetcher from '../../../utils/RegionTranslationsFetcher';

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
    const [regionTranslations, setRegionTranslations] = useState<RegionTranslations>();

    function clearRegion() {
        setSelectedDivision(null);
        setSelectedDistrict(null);
        setSelectedUpazila(null);
        setSelectedUnion(null);
        setSelectedMouza(null);
    }

    async function fetchRegionTranslations() {
        const translations = await RegionTranslationsFetcher();
        setRegionTranslations(translations);
    }
    
    useEffect(() => {
        fetchRegionTranslations();
    }, []);

    if (!regionTranslations) {
        return (
            <Stack direction='column' alignContent='center' justifyContent='center'>
                <CircularProgress />
            </Stack>
        );
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
                        bengali={regionTranslations.Divisions.division}
                    />
                }
            >
                {dropdownData.map(d => (
                    <MenuItem key={d.division} value={d.division}>
                        <TranslatableText 
                            variant='body1' 
                            english={d.division}
                            bengali={regionTranslations.Divisions[d.division.toLowerCase()]}
                        />
                    </MenuItem>
                ))}
            </TextField>

            <TextField
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
                label={
                    <TranslatableText 
                        variant='body1' 
                        english='District'
                        bengali={regionTranslations.Districts.district}
                    />
                }
            >
                {selectedDivision?.districts.map(d => (
                    <MenuItem key={d.district} value={d.district}>
                        <TranslatableText 
                            variant='body1' 
                            english={d.district}
                            bengali={regionTranslations.Districts[d.district.toLowerCase()]}
                        />
                    </MenuItem>
                )) || []}
            </TextField>

            <TextField
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
                label={
                    <TranslatableText 
                        variant='body1' 
                        english='Upazila'
                        bengali={regionTranslations.Upazilas.upazila}
                    />
                }
            >
                {selectedDistrict?.upazilas.map(u => (
                    <MenuItem key={u.upazila} value={u.upazila}>
                        <TranslatableText 
                            variant='body1' 
                            english={u.upazila}
                            bengali={regionTranslations.Upazilas[u.upazila.toLowerCase()]}
                        />
                    </MenuItem>
                )) || []}
            </TextField>

            <TextField
                select
                value={selectedUnion?.union || ''}
                onChange={(e) => {
                    const newUnion = selectedUpazila?.unions.find(u => u.union === e.target.value) || null;
                    setSelectedUnion(newUnion);
                    setSelectedMouza(null);
                }}
                fullWidth
                disabled={!selectedUpazila}
                label={
                    <TranslatableText 
                        variant='body1' 
                        english='Union'
                        bengali={regionTranslations.Unions.union}
                    />
                }
            >
                {selectedUpazila?.unions.map(u => (
                    <MenuItem key={u.union} value={u.union}>
                        <TranslatableText 
                            variant='body1' 
                            english={u.union}
                            bengali={regionTranslations.Unions[u.union.toLowerCase()]}
                        />
                    </MenuItem>
                )) || []}
            </TextField>

            <TextField
                select
                value={selectedMouza || ''}
                onChange={(e) => {
                    setSelectedMouza(e.target.value);
                }}
                fullWidth
                disabled={!selectedUnion}
                label={
                    <TranslatableText 
                        variant='body1' 
                        english='Mouza'
                        bengali={regionTranslations.Mouzas.mouza}
                    />
                }
            >
                {selectedUnion?.mouzas.map(m => (
                    <MenuItem key={m} value={m}>
                        <TranslatableText 
                            variant='body1' 
                            english={m}
                            bengali={regionTranslations.Mouzas[m.toLowerCase()]}
                        />
                    </MenuItem>
                )) || []}
            </TextField>
        </Stack>
    );
}
