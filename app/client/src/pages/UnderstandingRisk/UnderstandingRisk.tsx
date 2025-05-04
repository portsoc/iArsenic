import { Box, Button, Card, FormControl, FormControlLabel, FormLabel, Grid, List, ListItem, ListItemText, Paper, Radio, RadioGroup, Stack, Typography } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import React, { useState } from "react";

import EnglishSpeedo from "../../components/Speedo/englishSpeedo";
import BengaliSpeedo from "../../components/Speedo/bengaliSpeedo";
import estimateTexts from "../../components/Speedo/estimateTexts";
import { RiskAssesment } from "iarsenic-types";

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
            <Typography className='english' variant='h4' textAlign='center'>
                Understanding Your Arsenic Risk Level 
            </Typography>

            <Button
                variant='outlined'
                startIcon={<ArrowBackIcon />}
                sx={{ alignSelf: 'start' }}
                onClick={() => window.history.back()}
            >
                Return
            </Button>

            <Card variant='outlined' sx={{ margin: '0 1rem 1rem 1rem', padding: '1rem'}}>
                <Typography className='english' mb={2} textAlign='center' variant='h5'>
                    What does probability mean here? 
                </Typography>

                <Typography className='bengali' mb={2} textAlign='center' variant='h5'>
                    PLACEHOLDER BENGALI
                </Typography>

                <Typography className='english' variant='body1'>
                    In the context of our iArsenic app, "risk" 
                    refers to our best estimate of the likelihood that 
                    your tubewell contains arsenic at levels that could 
                    be harmful. We use data about your well’s location, 
                    depth, and visible characteristics to estimate this 
                    risk. Remember, these are educated guesses based on 
                    available data, and not certainties. Confirming arsenic 
                    levels through laboratory testing is always recommended, 
                    especially if your result indicates medium or higher risk.
                </Typography>

                <Typography className='bengali' variant='body1'>
                    PLACEHOLDER BENGALI
                </Typography>
            </Card>

            <Card 
                variant='outlined' 
                sx={{ 
                    margin: '0 1rem 1rem 1rem', 
                    padding: '1rem',
                }}>
                <Typography className='english' mb={2} textAlign='center' variant='h5'>
                    Output Demonstration
                </Typography>

                <Typography className='bengali' mb={2} textAlign='center' variant='h5'>
                    PLACEHOLDER BENGALI
                </Typography>

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

                <Stack sx={{ alignItems: 'center', height: '15.625em' }}>
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
                
                <FormControl component="fieldset" sx={{ marginTop: '1rem', width: '100%' }}>
                    <FormLabel component="legend" sx={{ width: '100%' }}>Select Risk Value</FormLabel>
                    <RadioGroup 
                        row 
                        value={speedoValue + 0.5} 
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            const value = (Number(event.target.value) - 0.5) as RiskAssesment

                            setSpeedoValue(value)
                            setOutput(value)
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

            <Card variant="outlined" sx={{ margin: '0 1rem 1rem 1rem', padding: '1rem' }}>
                <Typography variant="h6" gutterBottom>
                    Risk Levels for Arsenic Contamination
                </Typography>
                <List>
                    {/* Rare Risk */}
                    <ListItem>
                        <ListItemText 
                            primary="1. Rare Risk (Dark Green)"
                            secondary={
                                <>
                                    <Typography variant="body2"><strong>Description:</strong> The data indicates an extremely low likelihood of arsenic being present in your water at harmful levels.</Typography>
                                    <Typography variant="body2"><strong>What it Means:</strong> Your water is considered very safe in terms of arsenic contamination. However, a chemical test can provide certainty. No environment is entirely static; therefore, occasional testing, perhaps once every few years, is advised to ensure continued safety.</Typography>
                                </>
                            }
                        />
                    </ListItem>

                    {/* Low Risk */}
                    <ListItem>
                        <ListItemText 
                            primary="2. Low Risk (Green)"
                            secondary={
                                <>
                                    <Typography variant="body2"><strong>Description:</strong> The data suggests a low likelihood of harmful arsenic levels.</Typography>
                                    <Typography variant="body2"><strong>What it Means:</strong> Your water is probably safe with respect to arsenic, but conditions can change. A chemical test can provide certainty. Regular monitoring and occasional laboratory testing remain important to ensure safety over time.</Typography>
                                </>
                            }
                        />
                    </ListItem>

                    {/* Medium Risk */}
                    <ListItem>
                        <ListItemText 
                            primary="3. Medium Risk (Yellow)"
                            secondary={
                                <>
                                    <Typography variant="body2"><strong>Description:</strong> There is a moderate likelihood that arsenic levels in your water are unsafe.</Typography>
                                    <Typography variant="body2"><strong>What it Means:</strong> Consider using an alternative water source if available. It's important to arrange a chemical test of your well's water to determine the precise arsenic concentration. Using water filters or other treatment methods may also be advisable until confirmed safe.</Typography>
                                    <Typography variant="body2">Please consult the local DPHE (Department of Public Health and Engineering) team. Normally, every upazila headquarters has one of the branch offices – try to contact them in your area.</Typography>
                                </>
                            }
                        />
                    </ListItem>

                    {/* High Risk */}
                    <ListItem>
                        <ListItemText 
                            primary="4. High Risk (Orange)"
                            secondary={
                                <>
                                    <Typography variant="body2"><strong>Description:</strong> It is likely that your water contains arsenic at levels that pose a health risk.</Typography>
                                    <Typography variant="body2"><strong>What it Means:</strong> We suggest avoiding using this water for drinking or cooking. Seek alternative safe water sources immediately. Testing the water through a chemical test is crucial to understand the exact level of risk and necessary precautions.</Typography>
                                    <Typography variant="body2">Please consult the local DPHE team. Normally, every upazila headquarters has one of the branch offices – try to contact them in your area.</Typography>
                                </>
                            }
                        />
                    </ListItem>

                    {/* Severe Risk */}
                    <ListItem>
                        <ListItemText 
                            primary="5. Severe Risk (Red)"
                            secondary={
                                <>
                                    <Typography variant="body2"><strong>Description:</strong> There is a very high probability that the arsenic levels in your water are dangerous.</Typography>
                                    <Typography variant="body2"><strong>What it Means:</strong> We suggest stopping the use of this water for any domestic purposes immediately. Contact local health authorities for guidance and assistance. Arrange for immediate testing and consider installing robust water purification systems if no alternatives are available.</Typography>
                                    <Typography variant="body2">Normally, every upazila headquarters has one of the branch offices – try to contact them in your area.</Typography>
                                </>
                            }
                        />
                    </ListItem>
                </List>
            </Card>

            <Button
                sx={{ width: '90%', height: '4rem', marginTop: '2rem'}}
                variant='contained'
                onClick={() => window.history.back()}
            >
                <Typography className='english'>
                    Return
                </Typography>

                <Typography className='bengali'>
                    Bengali Placeholder
                </Typography>
            </Button>
        </>
    );
}
