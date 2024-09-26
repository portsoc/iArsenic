import { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Grid, Paper, Stack, Typography } from "@mui/material";
import { Well, RiskAssesment } from 'shared';
import { navigate } from "wouter/use-browser-location";
import EnglishSpeedo from "./englishSpeedo";
import BengaliSpeedo from "./bengaliSpeedo";
import estimateTexts from "./estimateTexts";
import { useRoute } from "wouter";
import AccessTokenRepo from "../../utils/AccessTokenRepo";

type EstimateTexts = {
    english: {
        title: string,
        body: string,
    },
    bengali: {
        title: string,
        body: string,
    }
}

export default function Result(): JSX.Element {
    const [, params] = useRoute('/:id/result');
    const wellId = params?.id;
    const [well, setWell] = useState<Well>();

    const [speedoValue, setSpeedoValue] = useState<number>();
    const [warningTexts, setWarningTexts] = useState<EstimateTexts>();

    const [loading, setLoading] = useState<boolean>(true);

    function setOutput(riskAssesment: RiskAssesment) {
        console.log(riskAssesment);
        setSpeedoValue(riskAssesment);

        const textIndex = riskAssesment - 0.5 as 0 | 1 | 2 | 3 | 4;

        setWarningTexts({
            english: {
                title: estimateTexts[textIndex].english.title,
                body: estimateTexts[textIndex].english.body,
            },
            bengali: {
                title: estimateTexts[textIndex].bengali.title,
                body: estimateTexts[textIndex].bengali.body,
            }
        });
    }

    useEffect(() => {
        async function fetchTokenAndWell() {
            try {
                if (!wellId) return;

                const token = await AccessTokenRepo.get();

                const headers: HeadersInit = {};
                if (token) {
                    headers['authorization'] = `Bearer ${token.id}`;
                }

                const result = await fetch(`/api/v1/self/well/${wellId}`, {
                    headers,
                });

                if (!result.ok) {
                    throw new Error('Failed to fetch well');
                }

                const data = await result.json();
                let fetchedWell = data.well;

                if (fetchedWell.prediction == null) {
                    const res = await fetch(`/api/v1/self/well/${wellId}/predict`, {
                        method: 'POST',
                        headers,
                    });

                    if (!res.ok) {
                        throw new Error('Failed to fetch prediction');
                    }

                    const data = await res.json();
                    fetchedWell = data.well;
                }

                setWell(fetchedWell);

                if (fetchedWell.prediction) {
                    setOutput(fetchedWell.prediction.riskAssesment);
                }

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        fetchTokenAndWell();
    }, [wellId]);

    if (loading) {
        return (
            <Stack direction='column' alignContent='center' justifyContent='center'>
                <CircularProgress />
            </Stack>
        );
    }

    if (!well || !speedoValue || !warningTexts) {
        return (
            <Typography textAlign="center" variant="h6">
                Error loading data. Please refresh the page.
            </Typography>
        );
    }

    return (
        <Grid container spacing={2} justifyContent="center" alignItems="center">
            <Grid item xs={12}>
                <Typography variant='h4' textAlign='center' marginBottom='1rem'>
                    Results
                </Typography>
            </Grid>

            <Grid item xs={12} style={{ height: '220px' }}>
                <Stack sx={{
                    alignItems: 'center',
                }}>
                    <Box className='english'>
                        <EnglishSpeedo value={speedoValue} />
                    </Box>

                    <Box className='bengali'>
                        <BengaliSpeedo value={speedoValue} />
                    </Box>
                </Stack>
            </Grid>

            <Stack sx={{ alignItems: 'center' }}>
                <Grid item xs={12}>
                    <Box textAlign='center'>
                        <Paper elevation={3} sx={{ padding: '20px' }}>
                            <Typography className='english'variant="h6" gutterBottom>
                                {warningTexts.english.title}
                            </Typography>

                            <Typography className='bengali'variant="h6" gutterBottom>
                                {warningTexts.bengali.title}
                            </Typography>

                            <Typography className='english' variant="body1" sx={{ marginBottom: '20px' }}>
                                {warningTexts.english.body}
                            </Typography>

                            <Typography className='bengali' variant="body1" sx={{ marginBottom: '20px' }}>
                                {warningTexts.bengali.body}
                            </Typography>
                        </Paper>
                    </Box>
                </Grid>
            </Stack>

            <Button
                sx={{ width: '90%', height: '4rem', marginTop: '2rem'}}
                variant='contained'
                onClick={() => navigate(`/`)}
            >
                <Typography className='english'>
                    Return To Start
                </Typography>

                <Typography className='bengali'>
                    Bengali Placeholder
                </Typography>
            </Button>
        </Grid>
    );
}