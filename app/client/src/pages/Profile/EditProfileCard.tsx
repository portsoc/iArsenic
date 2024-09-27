import { Typography, Card, Box, Button, TextField, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { User, Language, Units, UnitsSchema, LanguageSchema } from 'iarsenic-types';
import { useState } from 'react';
import AccessTokenRepo from '../../utils/AccessTokenRepo';
import LanguageSelector from '../../utils/LanguageSelector';
import UnitsSelector from '../../utils/UnitsSelector';

interface Props {
    user: User;
    setEditMode: (editMode: boolean) => void;
    setSaving: (saving: boolean) => void;
    setUser: (user: User) => void;
}

export default function EditProfileCard({ user, setEditMode, setSaving, setUser }: Props): JSX.Element {
    const [name, setName] = useState<string>(user.name);
    const [language, setLanguage] = useState<Language>(user.language);
    const [units, setUnits] = useState<Units>(user.units);

    async function saveChanges() {
        setSaving(true);
        const changes: Partial<User> = {
            name,
            language,
            units,
        };

        const token = await AccessTokenRepo.get();

        if (!token) {
            setSaving(false);
            throw new Error('Invalid token');
        }

        if (changes.language != null) {
            LanguageSelector.set(language);
        }

        if (changes.units != null) {
            UnitsSelector.set(units);
        }

        setSaving(false);
        setEditMode(false);
        setUser({ ...user, ...changes });
    }

    return (
        <Box width='100%'>
            <Typography className='english' textAlign='center' variant='h4' gutterBottom>
                Edit Profile
            </Typography>

            <Card variant='outlined' sx={{ margin: '0 1rem 1rem 1rem', padding: '1rem' }}>
                <TextField
                    fullWidth
                    label="Name"
                    variant="outlined"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    sx={{ mb: 2 }}
                />

                <Typography className='english' variant='body1' mb={2}>
                    <strong>Email</strong> {user.email}
                </Typography>

                <Typography className='english' variant='body1' mb={2}>
                    <strong>Email Verified:</strong> {user.emailVerified ? "Yes" : "No"}
                </Typography>

                <Typography className='english' variant='body1' mb={2}>
                    <strong>User Type:</strong> {user.type.charAt(0).toUpperCase() + user.type.slice(1)}
                </Typography>

                <Typography className='english' variant='body1' mb={2}>
                    <strong>Created At:</strong> {user.createdAt.toLocaleDateString()}
                </Typography>

                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Language</InputLabel>
                    <Select
                        value={language}
                        onChange={(e) => setLanguage(LanguageSchema.parse(e.target.value))}
                        label="Language"
                    >
                        <MenuItem value="english">English</MenuItem>
                        <MenuItem value="bengali">Bengali</MenuItem>
                    </Select>
                </FormControl>

                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Units System</InputLabel>
                    <Select
                        value={units}
                        onChange={(e) => setUnits(UnitsSchema.parse(e.target.value))}
                        label="Units System"
                    >
                        <MenuItem value="meters">Meters</MenuItem>
                        <MenuItem value="feet">Feet</MenuItem>
                    </Select>
                </FormControl>

                <Box display="flex" justifyContent="space-between" mt={2}>
                    <Button variant="outlined" color="error" onClick={() => setEditMode(false)}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="primary" onClick={saveChanges}>
                        Save Changes
                    </Button>
                </Box>
            </Card>
        </Box>
    );
}
