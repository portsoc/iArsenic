import { Box, Typography, Card, Button, CircularProgress, List, ListItem } from '@mui/material';
import { useEffect, useState } from 'react';
import { navigate } from 'wouter/use-browser-location';
import { Well } from 'iarsenic-types';
import { useRoute } from 'wouter';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAccessToken } from '../../utils/useAccessToken';

export default function Review() {
    const [, params] = useRoute('/well/:id');
    const wellId = params?.id;
    const [well, setWell] = useState<Well>();
    const { data: token } = useAccessToken()

    function getMissingFields(well: Well): { missingFields: string[], allFieldsMissing: boolean } {
        const requiredFields: (keyof Well)[] = [
            'division',
            'depth',
            'staining',
            'wellInUse',
            'flooding',
        ];

        let allFieldsMissing = true;
        const missingFields = [];
        for (const f of requiredFields) {
            if (well[f] == null) {
                missingFields.push(f);
            } else {
                allFieldsMissing = false;
            }
        }

        return { missingFields, allFieldsMissing };
    }

    useEffect(() => {
        async function fetchWell() {
            if (!wellId) return;

            const headers: HeadersInit = {}

            if (token) {
                headers['authorization'] = `Bearer ${token.id}`
            }

            const result = await fetch(
                `/api/v1/self/well/${wellId}`, {
                headers,
            });

            if (!result.ok) {
                console.error('Failed to fetch well:', result);
                return;
            }

            const well = await result.json();

            setWell(well);
        }

        fetchWell();
    }, [wellId, token]);

    if (!well) {
        return (
            <CircularProgress />
        );
    }

    const { missingFields, allFieldsMissing } = getMissingFields(well);

    return (
        <>
            <Typography variant="h4" gutterBottom textAlign="center">
                Well Details
            </Typography>

            <Button
                variant='outlined'
                startIcon={<ArrowBackIcon />}
                sx={{ alignSelf: 'start' }}
                onClick={() => navigate(`/my-wells`)}
            >
                Return to My Wells
            </Button>

            {missingFields.length !== 0 && (
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
                        {missingFields.includes('division') && (
                            <ListItem>
                                <Typography className='english' variant='body1'>
                                    • Region
                                </Typography>

                                <Typography className='bengali' variant='body1'>
                                    • অঞ্চল
                                </Typography>
                            </ListItem>
                        )}

                        {missingFields.includes('depth') && (
                            <ListItem>
                                <Typography className='english' variant='body1'>
                                    • Well Depth
                                </Typography>

                                <Typography className='bengali' variant='body1'>
                                    • টিউবওয়েলের গভীরতা
                                </Typography>
                            </ListItem>
                        )}

                        {missingFields.includes('staining') && (
                            <ListItem>
                                <Typography className='english' variant='body1'>
                                    • Staining Colour
                                </Typography>

                                <Typography className='bengali' variant='body1'>
                                    • দাগের রঙ
                                </Typography>
                            </ListItem>
                        )}

                        {missingFields.includes('flooding') && (
                            <ListItem>
                                <Typography className='english' variant='body1'>
                                    • Flooding
                                </Typography>

                                <Typography className='bengali' variant='body1'>
                                    • প্রবল বা সামান্য জলবায়ু
                                </Typography>
                            </ListItem>
                        )}

                        {missingFields.includes('wellInUse') && (
                            <ListItem>
                                <Typography className='english' variant='body1'>
                                    • Well In Use
                                </Typography>

                                <Typography className='bengali' variant='body1'>
                                    • BENGALI PLACEHOLDER
                                </Typography>
                            </ListItem>
                        )}
                    </List>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            if (!well?.division) {
                                navigate(`/well/${wellId}/region`);
                            } else if (!well?.staining) {
                                navigate(`/well/${wellId}/staining`);
                            } else if (!well?.depth) {
                                navigate(`/well/${wellId}/depth`);
                            } else if (!well?.flooding) {
                                navigate(`/well/${wellId}/flooding`);
                            } else if (!well?.wellInUse) {
                                navigate(`/well/${wellId}/well-in-use`);
                            }
                        }}
                    >
                        Complete Well Information
                    </Button>
                </Card>
            )}

            {!allFieldsMissing && (
                <Card
                    variant="outlined"
                    sx={{
                        width: '100%',
                        padding: '16px',
                        marginBottom: '16px',
                    }}
                >
                    {(
                        well.division && 
                        well.district && 
                        well.upazila && 
                        well.union && 
                        well.mouza
                    ) && (
                        <Box mb={2}>
                            <Typography variant="h6" gutterBottom>Region</Typography>

                            <Typography variant="body1" component="p" gutterBottom>
                                Division: {well.division}
                            </Typography>

                            <Typography variant="body1" component="p" gutterBottom>
                                District: {well.district}
                            </Typography>

                            <Typography variant="body1" component="p" gutterBottom>
                                Upazila: {well.upazila}
                            </Typography>

                            <Typography variant="body1" component="p" gutterBottom>
                                Union: {well.union}
                            </Typography>

                            <Typography variant="body1" component="p" gutterBottom>
                                Mouza: {well.mouza}
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
                        <Box mb={2}>
                            <Typography variant="h6" gutterBottom>Flooding</Typography>
                            <Typography variant="body1" component="p">
                                Flooding: {well.flooding ? 'Yes' : 'No'}
                            </Typography>
                        </Box>
                    )}

                    {well.wellInUse && (
                        <Box>
                            <Typography variant="h6" gutterBottom>Well In use</Typography>
                            <Typography variant="body1" component="p">
                                Well In Use: {well.wellInUse ? 'Yes' : 'No'}
                            </Typography>
                        </Box>
                    )}
                </Card>
            )}
        </>
    );
}
