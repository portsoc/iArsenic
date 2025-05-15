import { Box, Card, Button, CircularProgress, List, ListItem } from '@mui/material';
import { useEffect, useState } from 'react';
import { navigate } from 'wouter/use-browser-location';
import { Well } from 'iarsenic-types';
import { useRoute } from 'wouter';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAccessToken } from '../../utils/useAccessToken';
import TranslatableText from '../../components/TranslatableText';

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
            <TranslatableText
                variant="h4" 
                gutterBottom 
                textAlign="center"
                english='Well Details'
                bengali='BENGALI PLACEHOLDER'
            />

            <Button
                variant='outlined'
                startIcon={<ArrowBackIcon />}
                sx={{ alignSelf: 'start' }}
                onClick={() => navigate(`/my-wells`)}
            >
                <TranslatableText
                    variant="body1" 
                    gutterBottom 
                    textAlign="center"
                    english='Return to My Wells'
                    bengali='BENGALI PLACEHOLDER'
                />
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
                    <TranslatableText 
                        variant="h6" 
                        gutterBottom
                        english='Complete Your Well Information'
                        bengali='BENGALI PLACEHOLDER'
                    />

                    <TranslatableText
                        variant="body1" 
                        gutterBottom
                        english={`
                            It looks like some information is missing from this well's record.
                            Please continue where you left off to complete the assessment.
                        `}
                        bengali='BENGALI PLACEHOLDER'
                    />

                    <TranslatableText 
                        variant="body1" 
                        width='100%'
                        english={
                            <>
                                <b>Missing Data</b>
                            </>
                        }
                        bengali={
                            <>
                                <b>BENGALI PLACEHOLDER</b>
                            </>
                        }
                    />

                    <List sx={{ width: '100%' }}>
                        {missingFields.includes('division') && (
                            <ListItem>
                                <TranslatableText 
                                    variant='body1'
                                    english='• Region'
                                    bengali='• অঞ্চল'
                                />
                            </ListItem>
                        )}

                        {missingFields.includes('depth') && (
                            <ListItem>
                                <TranslatableText 
                                    variant='body1'
                                    english='• Well Depth'
                                    bengali='• টিউবওয়েলের গভীরতা'
                                />
                            </ListItem>
                        )}

                        {missingFields.includes('staining') && (
                            <ListItem>
                                <TranslatableText 
                                    variant='body1'
                                    english='• Staining Colour'
                                    bengali='• দাগের রঙ'
                                />
                            </ListItem>
                        )}

                        {missingFields.includes('flooding') && (
                            <ListItem>
                                <TranslatableText 
                                    variant='body1'
                                    english='• Flooding'
                                    bengali='• প্রবল বা সামান্য জলবায়ু'
                                />
                            </ListItem>
                        )}

                        {missingFields.includes('wellInUse') && (
                            <ListItem>
                                <TranslatableText 
                                    variant='body1'
                                    english='• Well In Use'
                                    bengali='• BENGALI PLACEHOLDER'
                                />
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
                        
                        <TranslatableText 
                            variant='body1'
                            english='Complete Well Information'
                            bengali='BENGALI PLACEHOLDER'
                        />
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
                            <TranslatableText 
                                variant='h6'
                                gutterBottom
                                english='Region'
                                bengali='BENGALI PLACEHOLDER'
                            />

                            <TranslatableText 
                                variant='body1'
                                gutterBottom
                                english={`Division: ${well.division}`}
                                bengali='BENGALI PLACEHOLDER'
                            />
                            
                            <TranslatableText 
                                variant='body1'
                                gutterBottom
                                english={`District: ${well.district}`}
                                bengali='BENGALI PLACEHOLDER'
                            />

                            <TranslatableText 
                                variant='body1'
                                gutterBottom
                                english={`Upazila: ${well.upazila}`}
                                bengali='BENGALI PLACEHOLDER'
                            />

                            <TranslatableText 
                                variant='body1'
                                gutterBottom
                                english={`Union: ${well.union}`}
                                bengali='BENGALI PLACEHOLDER'
                            />

                            <TranslatableText 
                                variant='body1'
                                gutterBottom
                                english={`Mouza: ${well.mouza}`}
                                bengali='BENGALI PLACEHOLDER'
                            />
                        </Box>
                    )}

                    {well.staining && (
                        <Box mb={2}>
                            <TranslatableText 
                                variant="h6" 
                                gutterBottom
                                english='Staining'
                                bengali='BENGALI PLACEHOLDER'
                            />

                            <TranslatableText 
                                variant='body1'
                                gutterBottom
                                english={`Staining: ${well.staining}`}
                                bengali='BENGALI PLACEHOLDER'
                            />

                            {well.utensilStaining && (
                                <TranslatableText 
                                    variant='body1'
                                    gutterBottom
                                    english={`Utensil Staining: ${well.utensilStaining}`}
                                    bengali='BENGALI PLACEHOLDER'
                                />
                            )}
                        </Box>
                    )}

                    {well.depth && (
                        <Box mb={2}>
                            <TranslatableText 
                                variant="h6" 
                                gutterBottom
                                english='Depth'
                                bengali='BENGALI PLACEHOLDER'
                            />

                            <TranslatableText 
                                variant='body1'
                                gutterBottom
                                english={`Depth: ${well.depth} meters`}
                                bengali='BENGALI PLACEHOLDER'
                            />
                        </Box>
                    )}

                    {well.flooding && (
                        <Box mb={2}>
                            <TranslatableText 
                                variant="h6" 
                                gutterBottom
                                english='Flooding'
                                bengali='BENGALI PLACEHOLDER'
                            />
                            
                            <TranslatableText 
                                variant='body1'
                                gutterBottom
                                english={`Flooding: ${well.flooding ? 'Yes' : 'No'}`}
                                bengali='BENGALI PLACEHOLDER'
                            />
                        </Box>
                    )}

                    {well.wellInUse && (
                        <Box>
                            <TranslatableText 
                                variant="h6" 
                                gutterBottom
                                english='Well In Use'
                                bengali='BENGALI PLACEHOLDER'
                            />

                            <TranslatableText 
                                variant='body1'
                                gutterBottom
                                english={`Well In Use: ${well.wellInUse ? 'Yes' : 'No'}`}
                                bengali='BENGALI PLACEHOLDER'
                            />
                        </Box>
                    )}
                </Card>
            )}
        </>
    );
}
