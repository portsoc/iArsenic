import { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Grid, Stack } from "@mui/material";
import { Well, RiskAssesment } from 'iarsenic-types';
import { navigate } from "wouter/use-browser-location";
import EnglishSpeedo from "../../components/Speedo/englishSpeedo";
import BengaliSpeedo from "../../components/Speedo/bengaliSpeedo";
import estimateTexts from "../../components/Speedo/estimateTexts";
import { useRoute } from "wouter";
import { useAccessToken } from "../../utils/useAccessToken";
import WellDataEntryLayout from "../../components/WellDataEntryLayout";
import PageCard from "../../components/PageCard";
import TranslatableText from "../../components/TranslatableText";

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
            <TranslatableText 
                textAlign="center" 
                variant="h6"
                english='Error loading data. Please refresh the page.'
                bengali='BENGALI PLACEHOLDER'
            />
        );
    }

    return (
        <WellDataEntryLayout
            title={
                <TranslatableText
                    variant="h4"
                    english="Results"
                    bengali="ফলাফল"
                />
            }
            nextText={
                <TranslatableText
                    english="Return to Start"
                    bengali="আবার শুরু করুন"
                />
            }
            onNext={() => navigate(`/`)}
        >
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
                            <PageCard>
                                <TranslatableText 
                                    variant='h6' 
                                    mb='1rem'
                                    english={warningTexts.english.title}
                                    bengali={warningTexts.bengali.title}
                                />

                                <TranslatableText 
                                    variant='body1' 
                                    mb='1rem'
                                    english={warningTexts.english.body}
                                    bengali={warningTexts.bengali.body}
                                />

                                <Button
                                    sx={{ width: '90%', height: '4rem', marginTop: '1rem' }}
                                    variant='outlined'
                                    onClick={() => navigate(`/understanding-risk`)}
                                >
                                    <TranslatableText 
                                        variant='body1' 
                                        english='What does this mean?'
                                        bengali='ফলাফল বিশদ ব্যাখ্যা দেখতে চান?'
                                    />
                                </Button>

                                <Button
                                    sx={{ width: '90%', height: '4rem', marginTop: '1rem' }}
                                    variant='outlined'
                                    onClick={() => navigate(`/map?highlight=${well.id}`)}
                                >
                                    <TranslatableText 
                                        variant='body1' 
                                        english='View on map'
                                        bengali='মানচিত্রে দেখুন' // chatgpt generated
                                    />
                                </Button>
                            </PageCard>
                        </Box>
                    </Grid>
                </Stack>
                
            </Grid>
        </WellDataEntryLayout>
    );
}
