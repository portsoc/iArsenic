import { useEffect, useState } from "react";
import ReactSpeedometer, { CustomSegmentLabelPosition } from "react-d3-speedometer"
import config from "../../config";
import { Box, Button, Grid, Paper, Stack, Typography } from "@mui/material";
import { MessageCode, PredictionData, RegionKey, UtensilStaining, WellStaining } from "../../types";
import { navigate } from "wouter/use-browser-location";

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

    function produceEstimate(
        predictionData: PredictionData,
        region: RegionKey,
        depth: number,
        wellStaining: WellStaining,
        utensilStaining: UtensilStaining,
        flood: boolean,
    ): MessageCode {
        const regionData = predictionData[region.division]
            .districts[region.district]
            .upazilas[region.upazila]
            .unions[region.union]
            .mouzas[region.mouza]

        const regionStrataKey= (() => {
            if (depth < 15.3) return 's15';
            else if (depth < 45) return 's45';
            else if (depth < 65) return 's65';
            else if (depth < 90) return 's90';
            else if (depth < 150) return 's150';
            else return 'sD';
        })()

        const regionStrataModel = regionData[regionStrataKey]

        /*
            if depth is < 15.3 attempt to use the flooding model
            if the flooding model is available, the key 'm2' will
            exist in the prediction data for this region
        */
        if (regionStrataKey === 's15' && 'm2' in regionStrataModel) {
            if (wellStaining === 'Black' && regionStrataModel.m2 !== undefined) {
                return regionStrataModel.m2;
            } else if (flood === true && regionStrataModel.m9 !== undefined) {
                return regionStrataModel.m9;
            } else if (regionStrataModel.m7 !== undefined) {
                return regionStrataModel.m7;
            } else {
                throw new Error('model keys required for flooding model misisng')
            }
        } else {
            if (wellStaining === 'Black' || utensilStaining === 'No colour change to slightly blackish') {
                return 1;
            } else if (wellStaining === 'Red' || utensilStaining === 'Red') {
                if (regionStrataModel.m !== undefined) {
                    return regionStrataModel.m;
                } else {
                    throw new Error('model key required for red staining missing');
                }
            } else {
                return 0;
            }
        }
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

        console.log('ready to calculate estimate')

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

        const estimateMessageDict = {
            0: {
                english: {
                    title: 'Rare Risk (under 10 µg/L)',
                    body: `
                        Your tube well water is categorised as 'Rare Risk'
                        for arsenic. It is generally considered safe for
                        use. However, if feasible, we recommend arranging
                        for a water quality test to confirm the arsenic levels.
                    `
                },
                bengali: {
                    title: 'বিরল ঝুঁকি',
                    body: `
                        আপনার নলকূপের পানিতে মাত্রাতিক্ত আর্সেনিক  থাকার কথা না । এটি পানীয়জল হিসাবে ব্যবহারের জন্য নিরাপদ বলে মনে করা হয়। তবে, যদি সম্ভব হয়, আর্সেনিকের মাত্রা নিশ্চিত করার জন্য পানির গুণমান পরীক্ষার পরামর্শ  থাকলো।"
                        "আমাদের নিকট সংরক্ষিত তথ্য অনুসারে, আপনার নলকূপের পানিতে মাত্রাতিরিক্ত আর্সেনিক  থাকার কথা না । এটি পানীয়জল হিসাবে ব্যবহারের জন্য নিরাপদ। তবে, যদি সম্ভব হয়, আর্সেনিকের মাত্রা নিশ্চিত করার জন্য পানির গুণমান পরীক্ষার পরামর্শ  থাকলো।
                    `,
                },
            },

            1: {
                english: {
                    title: 'Low Risk (under 50 µg/L)',
                    body: `
                        Your tube well water falls under 'Low Risk' for
                        arsenic contamination. It is likely safe, but
                        we advise you to arrange a water quality test,
                        particularly if there are young children,
                        pregnant women, or individuals with health concerns
                        in your household.
                    `,
                },
                bengali: {
                    title: 'কম ঝুঁকি',
                    body: `
                        "আপনার নলকূপের পানি নিম্ন মাত্রার আর্সেনিক দূষণের  অধীনে পড়ে ৷ এটি সম্ভবত নিরাপদ, তবে আমরা আপনাকে পানির গুণমান পরীক্ষার ব্যবস্থা করার পরামর্শ দিচ্ছি, বিশেষ করে যদি আপনার পরিবারে অল্পবয়সী শিশু, গর্ভবতী মহিলা বা স্বাস্থ্যঝুঁকি ..ব্যক্তিরা থাকে ৷ "
                        "আপনার নলকূপের পানি নিম্ন মাত্রার আর্সেনিক দূষণের  অধীনে পড়ে ৷ এটি সম্ভবত ব্যবহারের জন্য নিরাপদ৷ তবে আমরা আপনাকে পানির গুণমান পরীক্ষার ব্যবস্থা করার পরামর্শ দিচ্ছি, বিশেষ করে যদি আপনার পরিবারে অল্পবয়সী শিশু, গর্ভবতী মহিলা বা স্বাস্থ্যঝুঁকিতে রয়েছেন এমন ব্যক্তি থাকে ৷ "
                    `,
                },
            },
            2: {
                english: {
                    title: 'Medium Risk (under 100 µg/L)',
                    body: `
                        Your tube well is at 'Medium Risk' of arsenic
                        contamination. We suggest you seek an alternative
                        water source known to be safe. Additionally, it
                        is important to arrange a chemical test of your
                        well's water to determine the precise arsenic
                        concentration.
                    `,
                },
                bengali: {
                    title: 'মাঝারি ঝুঁকি',
                    body: `
                        "আপনার নলকূপ আর্সেনিক দূষণের 'মাঝারি মাত্রার ঝুঁকি'তে রয়েছে। আমরা আপনাকে আশেপাশের নিরাপদ নলকূপ থেকে পানীয়জল ব্যাবহারের পরামর্শ দিচ্ছি। উপরন্তু, সুনির্দিষ্ট আর্সেনিকের মাত্রা নির্ধারণের জন্য আপনার নলকূপের পানির রাসায়নিক পরীক্ষার ব্যবস্থা করা গুরুত্বপূর্ণ।"
                        "আপনার নলকূপ আর্সেনিক দূষণের 'মাঝারি মাত্রার ঝুঁকি'তে রয়েছে। আমরা আপনাকে আশেপাশের নিরাপদ নলকূপ থেকে পানীয়জল সংগ্রহের​ পরামর্শ দিচ্ছি। উপরন্তু, সুনির্দিষ্ট আর্সেনিকের মাত্রা নির্ধারণের জন্য আপনার নলকূপের পানির রাসায়নিক পরীক্ষার ব্যবস্থা করা গুরুত্বপূর্ণ।"
                    `,
                },
            },
            3: {
                english: {
                    title: 'High Risk (under 200 µg/L)',
                    body: `
                        Your tube well is categorised as 'High Risk'
                        for arsenic. It is strongly recommended that you
                        use an alternative safe water source. Immediate
                        testing of your water is crucial. Please also
                        contact your local DPHE for further assistance
                        and information.
                    `
                },
                bengali: {
                    title: 'উচ্চ ঝুঁকি',
                    body: `
                        "আপনার নলকূপকে আর্সেনিকের জন্য 'উচ্চ ঝুঁকি' হিসাবে চিহ্নিত করা যাচ্ছে । আমরা দৃঢ়ভাবে সুপারিশ্রাকরছি যে আপনি একটি বিকল্প নিরাপদ উৎস পানীয়জল ও রান্নার  পানির জন্য ব্যবহার করুন। আপনার নলকূপক অবিলম্বে পরীক্ষা করা অত্যন্ত গুরুত্বপূর্ণ। আরও সহায়তা এবং তথ্যের জন্য অনুগ্রহ করে আপনার স্থানীয় জনস্বাস্থ্য প্রকৌশল অধিদপ্তরের সাথে যোগাযোগ করুন।"
                        "আপনার নলকূপকে আর্সেনিকের জন্য 'উচ্চ ঝুঁকি' হিসাবে চিহ্নিত করা যাচ্ছে । আমরা দৃঢ়ভাবে সুপারিশ করছি যে, আপনি একটি বিকল্প নিরাপদ উৎস হতে পানীয়জল ও রান্নার  পানি সংগ্রহ করুন। আপনার নলকূপের পানি অনতিবিলম্বে পরীক্ষা করা অত্যন্ত গুরুত্বপূর্ণ। আরও সহায়তা এবং তথ্যের জন্য, আপনার স্থানীয় জনস্বাস্থ্য প্রকৌশল অধিদপ্তরের সাথে যোগাযোগ করুন।"
                    `
                }
            },
            4: {
                english: {
                    title: 'Severe Risk (over 200 µg/L)',
                    body: `
                        Your tube well is in the 'Severe Risk' category
                        for arsenic contamination. Do not use this
                        water for drinking or cooking. Seek an alternative
                        safe water source immediately. Arrange for a water
                        test as soon as possible, and consult with local
                        DPHE for detailed guidance and support.
                    `,
                },
                bengali: {
                    title: 'গুরুতর ঝুঁকি',
                    body: `
                        "আপনার নলকূপ আর্সেনিক দূষণের জন্য 'গুরুতর ঝুঁকি' হিসাবে চিহ্নিত করা যাচ্ছে । পানীয় বা রান্নার জন্য এই পানি ব্যবহার করবেন না। অবিলম্বে একটি বিকল্প নিরাপদ জলের উৎস সন্ধান করুন এবং স্থানীয় জনস্বাস্থ্য প্রকৌশল অধিদপ্তরের সাথে বিস্তারিত নির্দেশনা এবং উপায় সম্পর্কে পরামর্শ করুন। "
                    `,
                },
            }
        }

        setSpeedoValue(messageCode + 0.5)

        setEnglishWarningTitle(estimateMessageDict[messageCode].english.title)
        setEnglishWarningBody(estimateMessageDict[messageCode].english.body)
        setBengaliWarningTitle(estimateMessageDict[messageCode].bengali.title)
        setBengaliWarningBody(estimateMessageDict[messageCode].bengali.body)
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
                Return To Start
            </Button>
        </Grid>
    );
}