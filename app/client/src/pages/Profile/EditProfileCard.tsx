import {
    Box,
    Button,
    TextField,
    MenuItem,
    Select,
    FormControl,
    InputLabel
} from '@mui/material';
import { User, UnitsSchema, LanguageSchema } from 'iarsenic-types';
import { useState } from 'react';
import { useAccessToken } from '../../utils/useAccessToken';
import { useLanguage } from '../../utils/useLanguage';
import { useUnits } from '../../utils/useUnits';
import { useQueryClient } from '@tanstack/react-query';
import TranslatableText from '../../components/TranslatableText';
import PageCard from '../../components/PageCard';

interface Props {
    user: User;
    setEditMode: (editMode: boolean) => void;
    setSaving: (saving: boolean) => void;
    setUser: (user: User) => void;
}

export default function EditProfileCard({ user, setEditMode, setSaving, setUser }: Props): JSX.Element {
    const queryClient = useQueryClient()

    const [name, setName] = useState<string>(user.name);
    const { data: token } = useAccessToken();

    const { language, setLanguage } = useLanguage();
    const { units, setUnits } = useUnits();

    async function saveChanges() {
        setSaving(true);
    
        if (!token) {
            setSaving(false);
            throw new Error('Invalid token');
        }
    
        if (language) await setLanguage(language);
        if (units) await setUnits(units);
    
        const updatedUser = { ...user, name, language, units };
    
        queryClient.setQueryData(['accessToken'], (prev: typeof token) => {
            if (!prev) return prev;
            return {
                ...prev,
                user: updatedUser,
            };
        });
    
        setSaving(false);
        setEditMode(false);
        setUser(updatedUser);
    }
    

    return (
        <Box width='100%'>
            <TranslatableText 
                width='100%'
                textAlign='center' 
                variant='h4' 
                gutterBottom
                english='Edit Profile'
                bengali='BENGALI PLACEHOLDER'
            />

            <PageCard gap='0'>
                <TextField
                    fullWidth
                    variant="outlined"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    sx={{ mb: 2 }}
                    label={
                        <TranslatableText 
                            width='100%'
                            variant='body1' 
                            english='Name'
                            bengali='BENGALI PLACEHOLDER'
                        />
                    }
                />

                <TranslatableText 
                    width='100%'
                    mb='1rem'
                    variant='body1'
                    english={
                        <>
                            <strong>Email</strong> {user.email}
                        </>
                    } 
                    bengali='BENGALI PLACEHOLDER'
                />

                <TranslatableText 
                    width='100%'
                    mb='1rem'
                    variant='body1'
                    english={
                        <>
                            <strong>Email Verified:</strong> {user.emailVerified ? "Yes" : "No"}
                        </>
                    } 
                    bengali='BENGALI PLACEHOLDER'
                />

                <TranslatableText 
                    width='100%'
                    mb='1rem'
                    variant='body1'
                    english={
                        <>
                            <strong>User Type:</strong> {user.type.charAt(0).toUpperCase() + user.type.slice(1)}
                        </>
                    } 
                    bengali='BENGALI PLACEHOLDER'
                />

                <TranslatableText 
                    width='100%'
                    mb='1rem'
                    variant='body1'
                    english={
                        <>
                            <strong>Created At:</strong> {user.createdAt.toLocaleDateString()}
                        </>
                    } 
                    bengali='BENGALI PLACEHOLDER'
                />

                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>
                        <TranslatableText 
                            width='100%'
                            variant='body1' 
                            english='Language'
                            bengali='BENGALI PLACEHOLDER'
                        />
                    </InputLabel>
                    <Select
                        value={language}
                        onChange={(e) => setLanguage(LanguageSchema.parse(e.target.value))}
                        label={
                            <TranslatableText 
                                width='100%'
                                variant='body1' 
                                english='Language'
                                bengali='BENGALI PLACEHOLDER'
                            />
                        }
                    >
                        <MenuItem value="english">
                            <TranslatableText 
                                width='100%'
                                variant='body1' 
                                english='English'
                                bengali='BENGALI PLACEHOLDER'
                            />
                        </MenuItem>
                        <MenuItem value="bengali">
                            <TranslatableText 
                                width='100%'
                                variant='body1' 
                                english='Bengali'
                                bengali='BENGALI PLACEHOLDER'
                            />
                        </MenuItem>
                    </Select>
                </FormControl>

                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>
                        <TranslatableText 
                            width='100%'
                            variant='body1' 
                            english='Units System'
                            bengali='BENGALI PLACEHOLDER'
                        />
                    </InputLabel>
                    <Select
                        value={units}
                        onChange={(e) => setUnits(UnitsSchema.parse(e.target.value))}
                        label={
                            <TranslatableText 
                                width='100%'
                                variant='body1' 
                                english='Units System'
                                bengali='BENGALI PLACEHOLDER'
                            />
                        }
                    >
                        <MenuItem value="meters">
                            <TranslatableText 
                                width='100%'
                                variant='body1' 
                                english='Meters'
                                bengali='BENGALI PLACEHOLDER'
                            />
                        </MenuItem>

                        <MenuItem value="feet">
                            <TranslatableText 
                                width='100%'
                                variant='body1' 
                                english='Feet'
                                bengali='BENGALI PLACEHOLDER'
                            />
                        </MenuItem>
                    </Select>
                </FormControl>

                <Box display="flex" justifyContent="space-between" mt={2} width='100%'>
                    <Button variant="contained" color="primary" onClick={saveChanges}>
                        <TranslatableText 
                            width='100%'
                            variant='body1' 
                            english='Save Changes'
                            bengali='BENGALI PLACEHOLDER'
                        />
                    </Button>

                    <Button variant="outlined" color="error" onClick={() => setEditMode(false)}>
                        <TranslatableText 
                            width='100%'
                            variant='body1' 
                            english='Cancel'
                            bengali='BENGALI PLACEHOLDER'
                        />
                    </Button>
                </Box>
            </PageCard>
        </Box>
    );
}
