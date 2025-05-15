import { Box, Button, Card, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, Stack } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import React, { useState } from "react";

import EnglishSpeedo from "../../components/Speedo/englishSpeedo";
import BengaliSpeedo from "../../components/Speedo/bengaliSpeedo";
import estimateTexts from "../../components/Speedo/estimateTexts";
import { RiskAssesment } from "iarsenic-types";
import TranslatableText from "../../components/TranslatableText";
import PageCard from "../../components/PageCard";

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

export default function UnderstandingRisk(): JSX.Element {
    const [speedoValue, setSpeedoValue] = useState(2.5);
    const [warningTexts, setWarningTexts] = useState<EstimateTexts>({
        english: {
            title: estimateTexts[2].english.title,
            body: estimateTexts[2].english.body,
        },
        bengali: {
            title: estimateTexts[2].bengali.title,
            body: estimateTexts[2].bengali.body,
        }
    });

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


    return (
        <>
            <TranslatableText 
                variant='h4'
                textAlign='center'
                english='Understanding Your Arsenic Risk Level'
                bengali='BENGALI PLACEHOLDER'
            />

            <Button
                variant='outlined'
                startIcon={<ArrowBackIcon />}
                sx={{ alignSelf: 'start' }}
                onClick={() => window.history.back()}
            >
                <TranslatableText 
                    variant='body1' 
                    textAlign='center'
                    english='Return'
                    bengali='BENGALI PLACEHOLDER'
                />
            </Button>

            <Card variant='outlined' sx={{ margin: '0 1rem 1rem 1rem', padding: '1rem'}}>
                <TranslatableText
                    mb='1rem'
                    textAlign='center' 
                    variant='h5'
                    english='What does probability mean here?'
                    bengali='BENGALI PLACEHOLDER'
                />

                <TranslatableText 
                    variant='body1'
                    english={`
                        In the context of our iArsenic app, "risk" 
                        refers to our best estimate of the likelihood that 
                        your tubewell contains arsenic at levels that could 
                        be harmful. We use data about your well’s location, 
                        depth, and visible characteristics to estimate this 
                        risk. Remember, these are educated guesses based on 
                        available data, and not certainties. Confirming arsenic 
                        levels through laboratory testing is always recommended, 
                        especially if your result indicates medium or higher risk.
                    `}
                    bengali='BENGALI PLACEHOLDER'
                />
            </Card>

            <Card 
                variant='outlined' 
                sx={{ 
                    margin: '0 1rem 1rem 1rem', 
                    padding: '1rem',
                }}>
                <TranslatableText 
                    mb='1rem' 
                    textAlign='center' 
                    variant='h5'
                    english='Output Demonstration'
                    bengali='BENGALI PLACEHOLDER'
                />

                <Stack sx={{ 
                    alignItems: 'center', 
                    justifyContent: 'center',
                }}>
                    <Box 
                        className='english'
                        sx={{
                            height: '220px',
                            marginTop: '32px',
                            alignItems: 'center',
                        }}
                    >
                        <EnglishSpeedo value={speedoValue} />
                    </Box>

                    <Box className='bengali'>
                        <BengaliSpeedo value={speedoValue} />
                    </Box>
                </Stack>

                <Stack sx={{ alignItems: 'center', height: '18.625em' }}>
                    <Grid item xs={12}>
                        <Box textAlign='center'>
                            <Card 
                                variant='outlined'
                                sx={{ padding: '30px' }}
                            >
                                <TranslatableText 
                                    variant='h5'
                                    mb='20px'
                                    english={warningTexts.english.title}
                                    bengali={warningTexts.bengali.title}
                                />

                                <TranslatableText 
                                    variant='body1'
                                    mb='20px'
                                    gutterBottom
                                    english={warningTexts.english.body}
                                    bengali={warningTexts.bengali.body}
                                />
                            </Card>
                        </Box>
                    </Grid>
                </Stack>
                
                <FormControl component="fieldset" sx={{ marginTop: '1rem', width: '100%' }}>

                    <FormLabel component="legend" sx={{ width: '100%' }}>
                        <TranslatableText
                            variant='body1'
                            english='Select Risk Value'
                            bengali='BENGALI PLACEHOLDER'
                        />
                    </FormLabel>

                    <RadioGroup 
                        row 
                        value={speedoValue + 0.5} 
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            const value = (Number(event.target.value) - 0.5) as RiskAssesment;

                            setSpeedoValue(value);
                            setOutput(value);
                        }}
                        sx={{ justifyContent: 'center', width: '100%' }}
                    >
                        <Stack direction='row'>
                            {[1, 2, 3, 4, 5].map((num) => (
                                <FormControlLabel 
                                    key={num} 
                                    value={num} 
                                    control={<Radio />} 
                                    label={num.toString()} 
                                />
                            ))}
                        </Stack>
                    </RadioGroup>
                </FormControl>
            </Card>

            <PageCard gap='0'>
                <TranslatableText 
                    width='100%'
                    variant='h5' 
                    textAlign='center'
                    english='Risk Levels for Arsenic Contamination'
                    mb='2rem'
                    bengali='BENGALI PLACEHOLDER'
                />

                <TranslatableText
                    width='100%'
                    mb='1rem'
                    variant='h6'
                    english="1. Rare Risk (Dark Green)"
                    bengali='BENGALI PLACEHOLDER'
                />

                <TranslatableText 
                    width='100%'
                    variant='body1' 
                    fontWeight='bold'
                    english='Description'
                    bengali='BENGALI PLACEHOLDER'
                />

                <TranslatableText 
                    width='100%'
                    variant='body1' 
                    mb='1rem'
                    english={`
                        The data indicates an extremely low likelihood 
                        of arsenic being present in your water at harmful levels.
                    `}
                    bengali='BENGALI PLACEHOLDER'
                />

                <TranslatableText 
                    width='100%'
                    variant='body1' 
                    fontWeight='bold'
                    english='What it means'
                    bengali='BENGALI PLACEHOLDER'
                />

                <TranslatableText 
                    width='100%'
                    variant='body1' 
                    mb='1rem'
                    english={`
                        Your water is considered very safe in terms of arsenic 
                        contamination. However, a chemical test can provide 
                        certainty. No environment is entirely static; therefore, 
                        occasional testing, perhaps once every few years, is 
                        advised to ensure continued safety.
                    `}
                    bengali='BENGALI PLACEHOLDER'
                />

                {/* Low Risk */}
                <TranslatableText
                    width='100%'
                    mb='1rem'
                    variant='h6'
                    english="2. Low Risk (Green)"
                    bengali='BENGALI PLACEHOLDER'
                />

                <TranslatableText 
                    width='100%'
                    variant='body1' 
                    fontWeight='bold'
                    english='Description'
                    bengali='BENGALI PLACEHOLDER'
                />

                <TranslatableText 
                    width='100%'
                    variant='body1' 
                    mb='1rem'
                    english={`
                        The data suggests a low likelihood of harmful arsenic levels.
                    `}
                    bengali='BENGALI PLACEHOLDER'
                />

                <TranslatableText 
                    width='100%'
                    variant='body1' 
                    fontWeight='bold'
                    english='What it means'
                    bengali='BENGALI PLACEHOLDER'
                />

                <TranslatableText 
                    width='100%'
                    variant='body1' 
                    mb='1rem'
                    english={`
                        Your water is probably safe with respect to arsenic, 
                        but conditions can change. A chemical test can 
                        provide certainty. Regular monitoring and occasional 
                        laboratory testing remain important to ensure safety over time.
                    `}
                    bengali='BENGALI PLACEHOLDER'
                />

                {/* Medium Risk */}
                <TranslatableText
                    width='100%'
                    mb='1rem'
                    variant='h6'
                    english=""
                    bengali='BENGALI PLACEHOLDER'
                />

                <TranslatableText 
                    width='100%'
                    variant='body1' 
                    fontWeight='bold'
                    english='Description'
                    bengali='BENGALI PLACEHOLDER'
                />

                <TranslatableText 
                    width='100%'
                    variant='body1' 
                    mb='1rem'
                    english={`
                        There is a moderate likelihood that arsenic 
                        levels in your water are unsafe.
                    `}
                    bengali='BENGALI PLACEHOLDER'
                />

                <TranslatableText 
                    width='100%'
                    variant='body1' 
                    fontWeight='bold'
                    english='What it means'
                    bengali='BENGALI PLACEHOLDER'
                />

                <TranslatableText 
                    width='100%'
                    variant='body1' 
                    mb='1rem'
                    english={`
                        Consider using an alternative water source 
                        if available. It's important to arrange a 
                        chemical test of your well's water to determine 
                        the precise arsenic concentration. Using water 
                        filters or other treatment methods may also 
                        be advisable until confirmed safe.
                    `}
                    bengali='BENGALI PLACEHOLDER'
                />

                <TranslatableText 
                    width='100%'
                    variant='body1' 
                    mb='1rem'
                    english={`
                        Please consult the local DPHE (Department of Public 
                        Health and Engineering) team. Normally, every upazila 
                        headquarters has one of the branch offices – try 
                        to contact them in your area.
                    `}
                    bengali='BENGALI PLACEHOLDER'
                />

                {/* High Risk */}
                <TranslatableText
                    width='100%'
                    mb='1rem'
                    variant='h6'
                    english="4. High Risk (Orange)"
                    bengali='BENGALI PLACEHOLDER'
                />

                <TranslatableText 
                    width='100%'
                    variant='body1' 
                    fontWeight='bold'
                    english='Description'
                    bengali='BENGALI PLACEHOLDER'
                />

                <TranslatableText 
                    width='100%'
                    variant='body1' 
                    mb='1rem'
                    english={`
                        It is likely that your water contains 
                        arsenic at levels that pose a health risk.
                    `}
                    bengali='BENGALI PLACEHOLDER'
                />

                <TranslatableText 
                    width='100%'
                    variant='body1' 
                    fontWeight='bold'
                    english='What it means'
                    bengali='BENGALI PLACEHOLDER'
                />

                <TranslatableText 
                    width='100%'
                    variant='body1' 
                    mb='1rem'
                    english={`
                        We suggest avoiding using this water for 
                        drinking or cooking. Seek alternative safe 
                        water sources immediately. Testing the water 
                        through a chemical test is crucial to 
                        understand the exact level of risk and 
                        necessary precautions.
                    `}
                    bengali='BENGALI PLACEHOLDER'
                />

                <TranslatableText 
                    width='100%'
                    variant='body1' 
                    mb='1rem'
                    english={`
                        Please consult the local DPHE team. Normally, 
                        every upazila headquarters has one of the 
                        branch offices – try to contact them in your area.
                    `}
                    bengali='BENGALI PLACEHOLDER'
                />

                {/* Severe Risk */}
                <TranslatableText
                    width='100%'
                    mb='1rem'
                    variant='h6'
                    english="5. Severe Risk (Red)"
                    bengali='BENGALI PLACEHOLDER'
                />

                <TranslatableText 
                    width='100%'
                    variant='body1' 
                    fontWeight='bold'
                    english='Description'
                    bengali='BENGALI PLACEHOLDER'
                />

                <TranslatableText 
                    width='100%'
                    variant='body1' 
                    mb='1rem'
                    english={`
                        There is a very high probability 
                        that the arsenic levels in your 
                        water are dangerous.
                    `}
                    bengali='BENGALI PLACEHOLDER'
                />

                <TranslatableText 
                    width='100%'
                    variant='body1' 
                    fontWeight='bold'
                    english='What it means'
                    bengali='BENGALI PLACEHOLDER'
                />

                <TranslatableText 
                    width='100%'
                    variant='body1' 
                    mb='1rem'
                    english={`
                        We suggest stopping the use of this water for any 
                        domestic purposes immediately. Contact local health 
                        authorities for guidance and assistance. Arrange 
                        for immediate testing and consider installing robust 
                        water purification systems if no alternatives are 
                        available.
                    `}
                    bengali='BENGALI PLACEHOLDER'
                />

                <TranslatableText 
                    width='100%'
                    variant='body1' 
                    mb='1rem'
                    english={`
                        Normally, every upazila headquarters has one of 
                        the branch offices – try to contact them in your area.
                    `}
                    bengali='BENGALI PLACEHOLDER'
                />
            </PageCard>

            <Button
                sx={{ width: '90%', height: '4rem', marginTop: '2rem'}}
                variant='contained'
                onClick={() => window.history.back()}
            >
                <TranslatableText 
                    width='100%'
                    variant='body1' 
                    english='Return'
                    bengali='BENGALI PLACEHOLDER'
                />
            </Button>
        </>
    );
}
