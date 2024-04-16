import { useEffect, useState } from "react";
import ReactSpeedometer, { CustomSegmentLabelPosition } from "react-d3-speedometer"
import config from "../../config";
import { Box, Grid, Paper, Stack, Typography } from "@mui/material";
import { RegionKey } from "../../types";

export default function Result(): JSX.Element {
    const [regionData, setRegionData] = useState<RegionKey>();
    const [depth, setDepth] = useState<number>();
    const [staining, setStaining] = useState<'Red' | 'Black' | 'not-sure'>();
    const [predictionData, setPredictionData] = useState()
    const [estimate, setEstimate] = useState<{ message: string, severity: string, lowerQ: number, upperQ: number }>()
    const [speedoValue, setSpeedoValue] = useState<number>()

    async function fetchPredictionData(div: string, dis: string) {
        console.log(`${config.basePath}/model5/aggregate-data/${div}-${dis}.json`)
        const res = await fetch(`${config.basePath}/model5/aggregate-data/${div}-${dis}.json`)

        if (!res.ok) {
            return console.error('Failed to fetch prediction data')
        }

        const data = await res.json()
        setPredictionData(data)
    }

    function produceEstimate(
        predictionData,
        region: RegionKey,
        depth: number,
        wellStaining: WellStaining,
        utensilStaining: UtenstilStaining,
        flood: boolean,
    ) {

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
        if (!regionData || !depth || !staining || !predictionData) return;

        const newEstimate = (window as any).produceEstimate(
            predictionData,
            regionData.division,
            regionData.district,
            regionData.upazila,
            regionData.union,
            regionData.mouza,
            depth,
            staining,
            '',
            ''
        ) as { message: string, severity: string, lowerQ: number, upperQ: number };

        if (newEstimate) {
            setEstimate(newEstimate as { message: string, severity: string, lowerQ: number, upperQ: number });
        }

        if (newEstimate.message.includes('SEVERELY')) setSpeedoValue(4.5);
        if (newEstimate.message.includes('HIGHLY')) setSpeedoValue(3.5);
        if (newEstimate.severity === 'polluted') setSpeedoValue(2.5);
        if (newEstimate.severity === 'safe') setSpeedoValue(1.5);
    }, [regionData, depth, staining, predictionData]);

    if (!estimate) {
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
                    <ReactSpeedometer
                        maxValue={5}
                        value={speedoValue}
                        needleHeightRatio={0.7}
                        currentValueText=''
                        needleColor="steelblue"
                        needleTransitionDuration={1000}
                        segmentColors={[
                            '#01ce35',
                            '#9acb31',
                            '#ffcc32',
                            '#ff6600',
                            '#fe0000',
                        ]}
                        customSegmentLabels={[
                            {
                                text: 'Rare',
                                position: CustomSegmentLabelPosition.Outside,
                                color: 'black',
                            },
                            {
                                text: 'Low',
                                position: CustomSegmentLabelPosition.Outside,
                                color: 'black',
                            },
                            {
                                text: 'Medium',
                                position: CustomSegmentLabelPosition.Outside,
                                color: 'black',
                            },
                            {
                                text: 'High',
                                position: CustomSegmentLabelPosition.Outside,
                                color: 'black',
                            },
                            {
                                text: 'Severe',
                                position: CustomSegmentLabelPosition.Outside,
                                color: 'black',
                            },
                        ]}
                    />
                </Stack>
            </Grid>

            {estimate ? (
                <Stack sx={{ alignItems: 'center' }}>
                    <Grid item xs={12}>
                        <Box textAlign='center'>
                            <Paper elevation={3} sx={{ padding: '20px' }}>
                                <Typography variant="h6" gutterBottom>
                                    Estimate Message:
                                </Typography>
                                <Typography variant="body1" sx={{ marginBottom: '20px' }}>
                                    {estimate.message}
                                </Typography>
                                <Typography variant="subtitle1">
                                    Severity: <strong>{estimate.severity}</strong>
                                </Typography>
                                <Typography variant="subtitle1">
                                    Range: {estimate.lowerQ} - {estimate.upperQ}
                                </Typography>
                            </Paper>
                        </Box>
                    </Grid>
                </Stack>
            ) : (
                <Grid item xs={12}>
                    <Typography variant="h6" textAlign="center">
                        Calculating estimate...
                    </Typography>
                </Grid>
            )}
        </Grid>
    );
}