import { useEffect, useState } from "react";
import config from "../../config";
import { Box, Button, Grid, Paper, Stack, Typography } from "@mui/material";
import { RegionKey, WellStaining } from "../../types";
import { navigate } from "wouter/use-browser-location";
import EnglishSpeedo from "./englishSpeedo";
import BengaliSpeedo from "./bengaliSpeedo";
import estimateTexts from "./estimateTexts";
import produceEstimate from "./produceEstimate";

export default function Result(): JSX.Element {
    const [regionData, setRegionData] = useState<RegionKey>();
    const [depth, setDepth] = useState<number>();
    const [staining, setStaining] = useState<WellStaining>();
    const [predictionData, setPredictionData] = useState()
    const [speedoValue, setSpeedoValue] = useState<number>()
    const [englishWarningBody, setEnglishWarningBody] = useState<string>()
    const [englishWarningTitle, setEnglishWarningTitle] = useState<string>()
    const [bengaliWarningBody, setBengaliWarningBody] = useState<string>()
    const [bengaliWarningTitle, setBengaliWarningTitle] = useState<string>()

    async function fetchPredictionData(div: string, dis: string) {
        const res = await fetch(`${config.basePath}/model5/aggregate-data/${div}-${dis}.json`)

        if (!res.ok) {
            return console.error('Failed to fetch prediction data')
        }

        const data = await res.json()
        setPredictionData(data)
    }

    useEffect(() => {
        const regionData = JSON.parse(localStorage.getItem('region') || '{}')

        if (regionData.division) {
            setRegionData(regionData);
        } else {
            setRegionData({
                division: 'null',
                district: 'null',
                upazila: 'null',
                union: 'null',
                mouza: 'null',
            });
        }

        const depthStr = JSON.parse(localStorage.getItem('depth') || '{}')
        if (depthStr.depth) {
            if (depthStr.unit === 'ft') {
                setDepth(depthStr.depth * 0.3048)
            } else {
                setDepth(depthStr.depth);
            }
        }

        const stainingStr = JSON.parse(localStorage.getItem('staining') || '{}')
        setStaining(stainingStr.well);

        fetchPredictionData(regionData.division, regionData.district)
    }, [])

    useEffect(() => {
        if (!regionData) {
            console.error('Region data not found');
            return;
        }

        if (!depth) {
            console.error('Depth data not found');
            return;
        }

        if (!staining) {
            console.error('Staining data not found');
            return;
        }

        if (!predictionData) {
            console.error('Prediction data not found');
            return;
        }

        const newEstimate = produceEstimate(
            predictionData,
            regionData,
            depth,
            staining,
            undefined,
            false, // TODO GET THIS FROM USER
        );

        const messageCode = (() => {
            switch (newEstimate) {
                case 0: // unable to make an estimate
                    return 2;
                case 1:
                    return 0;
                case 2:
                case 3:
                    return 1;
                case 4:
                case 5:
                    return 2;
                case 6:
                    return 3;
                case 7:
                case 8:
                    return 4;
            }
        })()

        setSpeedoValue(messageCode + 0.5)

        setEnglishWarningTitle(estimateTexts[messageCode].english.title)
        setEnglishWarningBody(estimateTexts[messageCode].english.body)
        setBengaliWarningTitle(estimateTexts[messageCode].bengali.title)
        setBengaliWarningBody(estimateTexts[messageCode].bengali.body)
    }, [regionData, depth, staining, predictionData]);

    if (!regionData) {
        return (
            <h1>Region data not found</h1>
        )
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
                                {englishWarningTitle}
                            </Typography>

                            <Typography className='bengali'variant="h6" gutterBottom>
                                {bengaliWarningTitle}
                            </Typography>

                            <Typography className='english' variant="h6" gutterBottom>
                                Estimate Message:
                            </Typography>

                            <Typography className='bengali' variant="h6" gutterBottom>
                                BENGALI PLACEHOLDER
                            </Typography>

                            <Typography className='english' variant="body1" sx={{ marginBottom: '20px' }}>
                                {englishWarningBody}
                            </Typography>

                            <Typography className='bengali' variant="body1" sx={{ marginBottom: '20px' }}>
                                {bengaliWarningBody}
                            </Typography>
                        </Paper>
                    </Box>
                </Grid>
            </Stack>

            <Button
                sx={{ width: '90%', height: '4rem', marginTop: '2rem'}}
                variant='contained'
                onClick={() => navigate(`${config.basePath}/`)}
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