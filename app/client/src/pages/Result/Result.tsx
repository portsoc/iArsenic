import { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Grid, Paper, Stack, Typography } from "@mui/material";
import { Well, RiskAssesment } from 'iarsenic-types';
import { navigate } from "wouter/use-browser-location";
import EnglishSpeedo from "../../components/Speedo/englishSpeedo";
import BengaliSpeedo from "../../components/Speedo/bengaliSpeedo";
import estimateTexts from "../../components/Speedo/estimateTexts";
import { useRoute } from "wouter";
import { useAccessToken } from "../../utils/useAccessToken";
import WellDataEntryLayout from "../../components/WellDataEntryLayout";

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
    const [speedoValue, setSpeedoValue] = useState<number>();
    const [warningTexts, setWarningTexts] = useState<EstimateTexts>();
    const [loading, setLoading] = useState<boolean>(true);
    const { data: token } = useAccessToken();

    function setOutput(riskAssesment: RiskAssesment) {
        setSpeedoValue(riskAssesment);

        const textIndex = riskAssesment - 0.5 as 0 | 1 | 2 | 3 | 4;

        setWarningTexts({
            english: estimateTexts[textIndex].english,
            bengali: estimateTexts[textIndex].bengali,
        });
    }

    useEffect(() => {
        async function fetchTokenAndData() {
            try {
                if (!wellId) return;

                const headers: HeadersInit = token ? 
                    { 'authorization': `Bearer ${token.id}` } : 
                    {};

                const wellRes = await fetch(`/api/v1/self/well/${wellId}`, { headers });

                if (!wellRes.ok) {
                    throw new Error('Failed to fetch well');
                }

                const wellData = await wellRes.json();
                setWell(wellData);
                setOutput(wellData.riskAssesment);
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

    if (!well || !speedoValue || !warningTexts) {
        return (
            <Typography textAlign="center" variant="h6">
                Error loading data. Please refresh the page.
            </Typography>
        );
    }

    return (
        <WellDataEntryLayout title="Results" onNext={() => navigate(`/`)} nextText="Return to Start">
            <Grid container spacing={2} justifyContent="center" alignItems="center">
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
        </WellDataEntryLayout>
    );
}
