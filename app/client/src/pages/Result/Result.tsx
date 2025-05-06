import { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Grid, Paper, Stack, Typography } from "@mui/material";
import { Well, Prediction, RiskAssesment } from 'iarsenic-types';
import { navigate } from "wouter/use-browser-location";
import EnglishSpeedo from "../../components/Speedo/englishSpeedo";
import BengaliSpeedo from "../../components/Speedo/bengaliSpeedo";
import estimateTexts from "../../components/Speedo/estimateTexts";
import { useRoute } from "wouter";
import { useAccessToken } from "../../utils/useAccessToken";

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
    const [, params] = useRoute('/well/:id/result');
    const wellId = params?.id;
    const [well, setWell] = useState<Well>();
    const [prediction, setPrediction] = useState<Prediction>();
    const [speedoValue, setSpeedoValue] = useState<number>();
    const [warningTexts, setWarningTexts] = useState<EstimateTexts>();
    const [loading, setLoading] = useState<boolean>(true);
    const { data: token } = useAccessToken()

    function setOutput(riskAssesment: RiskAssesment) {
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
        async function fetchTokenAndData() {
            try {
                if (!wellId) return;

                const headers: HeadersInit = token ? 
                    { 'authorization': `Bearer ${token.id}` } : 
                    {};

                // Fetch the well first
                const wellRes = await fetch(`/api/v1/self/well/${wellId}`, { 
                    headers
                });

                if (!wellRes.ok) {
                    throw new Error('Failed to fetch well');
                }

                const wellData = await wellRes.json();
                setWell(wellData);

                // Always generate a fresh prediction for the well
                const predictionRes = await fetch(`/api/v1/prediction/well/${wellId}`, {
                    method: 'POST',
                    headers,
                });

                if (!predictionRes.ok) {
                    throw new Error('Failed to generate prediction');
                }

                const predictionData = await predictionRes.json();
                setPrediction(predictionData);

                // Now set the UI output
                setOutput(predictionData.riskAssesment);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        fetchTokenAndData();
    }, [wellId]);

    if (loading) {
        return (
            <Stack direction='column' alignContent='center' justifyContent='center'>
                <CircularProgress />
            </Stack>
        );
    }

    if (!well || !prediction || !speedoValue || !warningTexts) {
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
                <Stack sx={{ alignItems: 'center' }}>
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
                            <Typography className='english' variant="h6" gutterBottom>
                                {warningTexts.english.title}
                            </Typography>

                            <Typography className='bengali' variant="h6" gutterBottom>
                                {warningTexts.bengali.title}
                            </Typography>

                            <Typography className='english' variant="body1" sx={{ marginBottom: '20px' }}>
                                {warningTexts.english.body}
                            </Typography>

                            <Typography className='bengali' variant="body1" sx={{ marginBottom: '20px' }}>
                                {warningTexts.bengali.body}
                            </Typography>

                            <Button
                                sx={{ width: '90%', height: '4rem', marginTop: '2rem'}}
                                variant='outlined'
                                onClick={() => navigate(`/understanding-risk`)}
                            >
                                <Typography className='english'>
                                    What does this mean? 
                                </Typography>
                                <Typography className='bengali'>
                                    Bengali Placeholder
                                </Typography>
                            </Button>
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
