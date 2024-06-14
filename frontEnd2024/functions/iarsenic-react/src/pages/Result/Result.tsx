import { useEffect, useState } from "react";
import config from "../../config";
import { Box, Button, CircularProgress, Grid, Paper, Stack, Typography } from "@mui/material";
import { ModelData } from "../../types";
import { navigate } from "wouter/use-browser-location";
import EnglishSpeedo from "./englishSpeedo";
import BengaliSpeedo from "./bengaliSpeedo";
import estimateTexts from "./estimateTexts";
import produceEstimate from "./produceEstimate";
import PredictorsStorage, { Predictors } from "../../utils/PredictorsStorage";

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
    const [predictors, setPredictors] = useState<Predictors>();
    const [modelData, setModelData] = useState<ModelData>();

    const [speedoValue, setSpeedoValue] = useState<number>();
    const [warningTexts, setWarningTexts] = useState<EstimateTexts>();

    async function fetchModelData(div: string, dis: string) {
        const res = await fetch(`${config.basePath}/model5/aggregate-data/${div}-${dis}.json`);

        if (!res.ok) {
            return console.error('Failed to fetch prediction data');
        }

        // additional type checking would be good here
        const data = await res.json() as ModelData;

        setModelData(data);
    }

    function loadPredictors() {
        const storedPredictors = PredictorsStorage.get();
        const valid = PredictorsStorage.validate(storedPredictors);

        if (!valid.ok) {
            alert(valid.msg);
            navigate(`${config.basePath}/`);
        }

        const predictors = storedPredictors as Predictors;

        setPredictors({
            regionKey: predictors.regionKey,
            depth: predictors.depth,
            wellStaining: predictors.wellStaining,
            utensilStaining: predictors.utensilStaining
        });
    }

    function setOutput(modelData: ModelData) {
        const storedPredictors = PredictorsStorage.get();
        const valid = PredictorsStorage.validate(storedPredictors);

        if (!valid.ok) {
            alert(valid.msg);
            navigate(`${config.basePath}/`);
        }

        const predictors = storedPredictors as Predictors;

        const newEstimate = produceEstimate(
            modelData,
            predictors,
            false,
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
        })();

        setSpeedoValue(messageCode + 0.5);

        setWarningTexts({
            english: {
                title: estimateTexts[messageCode].english.title,
                body: estimateTexts[messageCode].english.body,
            },
            bengali: {
                title: estimateTexts[messageCode].bengali.title,
                body: estimateTexts[messageCode].bengali.body,
            }
        });
    }

    // 1. load user entered predictor data - no dpendencies
    useEffect(loadPredictors, []);

    // 2. load model data - depends on predictors to download predictions for
    // this district only
    useEffect(() => {
        if (!predictors) {
            return;
        }

        fetchModelData(predictors.regionKey.division, predictors.regionKey.district);
    }, [predictors]);

    // 3. get output message - depends on model data for prediction
    useEffect(() => {
        if (!modelData) {
            console.error('attempting to produce estimate without model data');
            return;
        }

        setOutput(modelData);
    }, [modelData]);

    if (!predictors || !modelData || !speedoValue || !warningTexts) {
        return (
            <Stack direction='column' alignContent='center' justifyContent='center'>
                <CircularProgress />
            </Stack>
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