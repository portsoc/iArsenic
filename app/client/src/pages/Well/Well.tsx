import { Box, Typography, Card, Button, CircularProgress, List, ListItem } from '@mui/material';
import { useEffect, useState } from 'react';
import { navigate } from 'wouter/use-browser-location';
import config from '../../config';
import { Well, IAccessToken } from '../../../types';
import { useRoute } from 'wouter';
import AccessToken from '../../utils/AccessToken';

export default function Review() {
    const [match, params] = useRoute('/well/:id');
    const wellId = params?.id;
    const [well, setWell] = useState<Well>();
    const [token, setToken] = useState<IAccessToken>();

    useEffect(() => {
        async function fetchToken() {
            const token = await AccessToken.get();

            if (token == null) {
                navigate(`${config.basePath}/login`);
                return;
            }

            setToken(token);
        }

        fetchToken();
    }, [])

    useEffect(() => {
        async function fetchWell() {
            if (!wellId || !token) return

            const result = await fetch(
                `${config.basePath}/api/v1/self/well/${wellId}`, {
                    headers: {
                        'authorization': `Bearer ${token.id}`,
                    }
                }
            );

            if (!result.ok) {
                console.error('Failed to fetch well:', result);
                return;
            }

            const data = await result.json();

            setWell(data.well);
        }

        fetchWell();
    }, [wellId, token]);

    if (!match) {
        return <div>Well not found</div>;
    }

    if (!well) {
        return (
            <CircularProgress />
        );
    }

    return (
        <>
            <Typography variant="h4" gutterBottom textAlign="center">
                Well Details
            </Typography>

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
                <Typography variant="h6" gutterBottom>
                    Complete Your Well Information
                </Typography>

                <Typography variant="body1" gutterBottom>
                    It looks like some information is missing from this well's record.
                    Please continue where you left off to complete the assessment.
                </Typography>

                <Typography variant="body1" width='100%'>
                    <b>Missing Data</b>
                </Typography>

                <List sx={{ width: '100%' }}>
                    <ListItem>
                        <Typography className='english' variant='body1'>
                            • Region
                        </Typography>

                        <Typography className='bengali' variant='body1'>
                            • অঞ্চল
                        </Typography>
                    </ListItem>

                    <ListItem>
                        <Typography className='english' variant='body1'>
                            • Well Depth
                        </Typography>

                        <Typography className='bengali' variant='body1'>
                            • টিউবওয়েলের গভীরতা
                        </Typography>
                    </ListItem>

                    <ListItem>
                        <Typography className='english' variant='body1'>
                            • Staining Colour
                        </Typography>

                        <Typography className='bengali' variant='body1'>
                            • দাগের রঙ
                        </Typography>
                    </ListItem>

                    <ListItem>
                        <Typography className='english' variant='body1'>
                            • Flooding
                        </Typography>

                        <Typography className='bengali' variant='body1'>
                            • PLACEHOLDER BENGALI
                        </Typography>
                    </ListItem>

                    <ListItem>
                        <Typography className='english' variant='body1'>
                            • Depth
                        </Typography>

                        <Typography className='bengali' variant='body1'>
                            • PLACEHOLDER BENGALI
                        </Typography>
                    </ListItem>
                </List>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate(`${config.basePath}/well/${wellId}/edit`)}
                >
                    Continue Editing Well
                </Button>
            </Card>

            <Card
                variant="outlined"
                sx={{
                    width: '100%',
                    padding: '16px',
                    marginBottom: '16px',
                }}
            >
                {well.regionKey && (
                    <Box mb={2}>
                        <Typography variant="h6" gutterBottom>Region</Typography>

                        <Typography variant="body1" component="p" gutterBottom>
                            Division: {well.regionKey.division}
                        </Typography>

                        <Typography variant="body1" component="p" gutterBottom>
                            District: {well.regionKey.district}
                        </Typography>

                        <Typography variant="body1" component="p" gutterBottom>
                            Upazila: {well.regionKey.upazila}
                        </Typography>

                        <Typography variant="body1" component="p" gutterBottom>
                            Union: {well.regionKey.union}
                        </Typography>

                        <Typography variant="body1" component="p" gutterBottom>
                            Mouza: {well.regionKey.mouza}
                        </Typography>
                    </Box>
                )}

                {well.staining && (
                    <Box mb={2}>
                        <Typography variant="h6" gutterBottom>Staining</Typography>
                        <Typography variant="body1" component="p" gutterBottom>
                            Staining: {well.staining}
                        </Typography>

                        {well.utensilStaining && (
                            <Typography variant="body1" component="p" gutterBottom>
                                Utensil Staining: {well.utensilStaining}
                            </Typography>
                        )}
                    </Box>
                )}

                {well.depth && (
                    <Box mb={2}>
                        <Typography variant="h6" gutterBottom>Depth</Typography>
                        <Typography variant="body1" component="p">
                            Depth: {well.depth} meters
                        </Typography>
                    </Box>
                )}

                {well.flooding && (
                    <Box>
                        <Typography variant="h6" gutterBottom>Flooding</Typography>
                        <Typography variant="body1" component="p">
                            Flooding: {well.flooding ? 'Yes' : 'No'}
                        </Typography>
                    </Box>
                )}
            </Card>
        </>
    );
}
