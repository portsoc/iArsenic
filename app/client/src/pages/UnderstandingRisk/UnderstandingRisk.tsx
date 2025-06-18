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
                bengali='আপনার আর্সেনিক ঝুঁকি স্তর বুঝতে'
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
                    bengali='ফিরে যান'
                />
            </Button>

            <PageCard>
                <TranslatableText
                    mb='1rem'
                    textAlign='center' 
                    variant='h5'
                    english='What does probability mean here?'
                    bengali="এখানে 'সম্ভাবনা' বলতে কী বোঝায়?"
                />

                <TranslatableText 
                    variant='body1'
                    english={`
                        In the context of our iArsenic app, "risk" 
                        refers to our best estimate of the likelihood that 
                        your tubewell contains arsenic at levels that could 
                        be harmful. 
                    `}
                    bengali={`
                        iArsenic অ্যাপের প্রেক্ষাপটে, 'সম্ভাবনা' হল আমাদের সেরা অনুমান যা নির্ধারণ করে যে আপনার টিউবওয়েলে ক্ষতিকর মাত্রায় আর্সেনিক থাকার সম্ভাবনা কতটুকু।
                    `}
                />
                <TranslatableText 
                    variant='body1'
                    english={`
                        We use data about your well’s location, 
                        depth, and visible characteristics to estimate this 
                        risk. 
                    `}
                    bengali={`
                        আমরা এই ঝুঁকি নির্ধারণের জন্য নলকূপের অবস্থান, গভীরতা এবং দৃশ্যমান বৈশিষ্ট্যগুলির উপাত্ত ব্যবহার করি।
                    `}
                />
                <TranslatableText 
                    variant='body1'
                    english={`
                        Remember, these are educated guesses based on 
                        available data, and not certainties. Confirming arsenic 
                        levels through laboratory testing is always recommended, 
                        especially if your result indicates medium or higher risk.
                    `}
                    bengali={`
                        মনে রাখবেন, এগুলি পাওয়া উপাত্ত অনুযায়ী শিক্ষিত অনুমান মাত্র, নিশ্চয়তা নয়। বিশেষ করে মাঝারি বা তার চেয়ে বেশি ঝুঁকি নির্দেশিত হলে, ল্যাবরেটরি পরীক্ষা দ্বারা আর্সেনিক মাত্রা নিশ্চিত করা উচিৎ ।
                    `}
                />
            </PageCard>

            <PageCard>
                <TranslatableText
                    mb='1rem'
                    textAlign='center' 
                    variant='h5'
                    english='How to use this guide'
                    bengali="এখানে 'সম্ভাবনা' বলতে কী বোঝায়?"
                /> 

                <TranslatableText 
                    variant='body1' 
                    english={`
                        Each time you receive a risk assessment using the iArsenic app, use this guide to help you understand your results and what action to take.
                    `}
                    bengali={`
                        প্রতিবার যখন আপনি iArsenic অ্যাপ ব্যবহার করে ঝুঁকি মূল্যায়ন পাবেন, তখন এই গাইডের দ্বারা আপনার ফলাফল বুঝতে এবং কী পদক্ষেপ নেওয়া উচিত তা বোঝার জন্য সহায়তা নিন।
                    `}
                />

                <TranslatableText 
                    variant='body1' 
                    english={`
                        Remember, it is possible to reduce the health risks of arsenic by taking appropriate steps based on your risk level.
                    `}
                    bengali={`
                        মনে রাখবেন, আপনার ঝুঁকি স্তরের উপর ভিত্তি করে উপযুক্ত পদক্ষেপ নিলে আর্সেনিকের স্বাস্থ্যঝুঁকি লাঘব করা সম্ভব।
                    `}
                />

                <TranslatableText 
                    variant='body1' 
                    english={`
                        This guide is easy to understand and follow, providing an effective way to ensure the safety of your water and protect yourself and your family from the potential effects of arsenic contamination.
                    `}
                    bengali={`
                        এই গাইডটি বুঝতে এবং অনুসরণ করতে সহজ হওয়ায়, আপনার পানির নিরাপত্তা নিশ্চিত করতে এবং আর্সেনিক দূষণের সম্ভাব্য প্রভাব থেকে নিজেকে এবং আপনার পরিবারকে রক্ষা করতে একটি কার্যকরী উপায় প্রদান করে।
                    `}
                />
            </PageCard>

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
                    bengali='ফলাফল দেখানো' // chatgpt generated
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

                    <Box 
                        className='bengali'
                        sx={{
                            height: '220px',
                            marginTop: '32px',
                            alignItems: 'center',
                        }}
                    >
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
                            bengali='ঝুঁকির মাত্রা নির্বাচন করুন' // chatgpt generated
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
                    bengali='ঝুঁকি শ্রেণিবিন্যাস ব্যাখ্যা:ছি'
                />

                <TranslatableText
                    width='100%'
                    mb='1rem'
                    variant='h6'
                    english="1. Rare Risk (Dark Green)"
                    bengali='১) বিরল ঝুঁকি (গাঢ় সবুজ)'
                />

                <TranslatableText 
                    width='100%'
                    variant='body1' 
                    fontWeight='bold'
                    english='Description'
                    bengali='বর্ণনা'
                />

                <TranslatableText 
                    width='100%'
                    variant='body1' 
                    mb='1rem'
                    english={`
                        The data indicates an extremely low likelihood 
                        of arsenic being present in your water at harmful levels.
                    `}
                    bengali='উপাত্ত নির্দেশ করে যে আপনার পানির মধ্যে আর্সেনিক থাকার সম্ভাবনা অত্যন্ত কম।'
                />

                <TranslatableText 
                    width='100%'
                    variant='body1' 
                    fontWeight='bold'
                    english='What it means'
                    bengali='অর্থ কী'
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
                    bengali='আপনার পানি আর্সেনিক দূষণের দিক থেকে খুবই নিরাপদ বিবেচিত। তবে, নিশ্চয়তা পেতে রাসায়নিক পরীক্ষা করা উচিত। পরিবেশ সর্বদা অপরিবর্তনশীল নয়, তাই মাঝে মাঝে, হয়তো কয়েক বছর অন্তর, পরীক্ষা করানো উচিত।'
                />

                {/* Low Risk */}
                <TranslatableText
                    width='100%'
                    mb='1rem'
                    variant='h6'
                    english="2. Low Risk (Green)"
                    bengali='২) কম ঝুঁকি (সবুজ)'
                />

                <TranslatableText 
                    width='100%'
                    variant='body1' 
                    fontWeight='bold'
                    english='Description'
                    bengali='বর্ণনা'
                />

                <TranslatableText 
                    width='100%'
                    variant='body1' 
                    mb='1rem'
                    english={`
                        The data suggests a low likelihood of harmful arsenic levels.
                    `}
                    bengali='উপাত্ত নির্দেশ করে যে আপনার পানির মধ্যে ক্ষতিকর আর্সেনিকের মাত্রা কম।'
                />

                <TranslatableText 
                    width='100%'
                    variant='body1' 
                    fontWeight='bold'
                    english='What it means'
                    bengali='অর্থ কী'
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
                    bengali='আপনার পানি সম্ভবত আর্সেনিকের দিক থেকে নিরাপদ, তবে পরিস্থিতি পরিবর্তনশীল। নিশ্চয়তা পেতে রাসায়নিক পরীক্ষা করা উচিত। নিয়মিত পর্যবেক্ষণ এবং মাঝে মাঝে ল্যাবরেটরি পরীক্ষা জরুরি।'
                />

                {/* Medium Risk */}
                <TranslatableText
                    width='100%'
                    mb='1rem'
                    variant='h6'
                    english="3. Medium Risk (Yellow)"
                    bengali='৩) মাঝারি ঝুঁকি (হলুদ)'
                />

                <TranslatableText 
                    width='100%'
                    variant='body1' 
                    fontWeight='bold'
                    english='Description'
                    bengali='বর্ণনা'
                />

                <TranslatableText 
                    width='100%'
                    variant='body1' 
                    mb='1rem'
                    english={`
                        There is a moderate likelihood that arsenic 
                        levels in your water are unsafe.
                    `}
                    bengali='আপনার পানির মধ্যে অনিরাপদ হতে পারে, এবং মাঝারি মাত্রার আর্সেনিক থাকার সম্ভাবনা রয়েছে।'
                />

                <TranslatableText 
                    width='100%'
                    variant='body1' 
                    fontWeight='bold'
                    english='What it means'
                    bengali='অর্থ কী'
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
                    bengali='সম্ভব হলে বিকল্প পানির উৎস ব্যবহার করুন। আপনার কূপের পানির সঠিক আর্সেনিক মাত্রা নির্ধারণের জন্য রাসায়নিক পরীক্ষা গুরুত্বপূর্ণ।'
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
                    bengali='নিরাপদ নিশ্চিত হওয়া পর্যন্ত পানি পরিশোধন করে পান করা উচিত। সাধারণত, প্রতিটি উপজেলা সদরে একটি শাখা অফিস থাকে - আপনার এলাকায় তাদের যোগাযোগ করার চেষ্টা করুন।'
                />

                {/* High Risk */}
                <TranslatableText
                    width='100%'
                    mb='1rem'
                    variant='h6'
                    english="4. High Risk (Orange)"
                    bengali='৪) উচ্চ ঝুঁকি (কমলা)'
                />

                <TranslatableText 
                    width='100%'
                    variant='body1' 
                    fontWeight='bold'
                    english='Description'
                    bengali='বর্ণনা'
                />

                <TranslatableText 
                    width='100%'
                    variant='body1' 
                    mb='1rem'
                    english={`
                        It is likely that your water contains 
                        arsenic at levels that pose a health risk.
                    `}
                    bengali='আপনার নলকুপের পানিতে আর্সেনিকের মাত্রা স্বাস্থ্যের জন্য ঝুঁকিপূর্ণ পর্যায়ে থাকার সম্ভবনা প্রবল ।'
                />

                <TranslatableText 
                    width='100%'
                    variant='body1' 
                    fontWeight='bold'
                    english='What it means'
                    bengali='অর্থ কী'
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
                    bengali='আমরা পরামর্শ দিচ্ছি যে এই পানি পান বা রান্না করা এড়িয়ে চলুন। অবিলম্বে নিরাপদ পানির উৎস খুঁজুন।'
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
                    bengali='পানির মধ্যে আর্সেনিকের সঠিক মাত্রা বুঝতে রাসায়নিক পরীক্ষা করা অত্যাবশ্যক। অনুগ্রহ করে স্থানীয় জনস্বাস্থ্য প্রকৌশল অধিদপ্তর টিমের সাথে পরামর্শ করুন। সাধারণত, প্রতিটি উপজেলা সদরে একটি শাখা অফিস থাকে - আপনার এলাকায় তাদের যোগাযোগ করার চেষ্টা করুন।'
                />

                {/* Severe Risk */}
                <TranslatableText
                    width='100%'
                    mb='1rem'
                    variant='h6'
                    english="5. Severe Risk (Red)"
                    bengali='৫) গুরুতর ঝুঁকি (লাল)'
                />

                <TranslatableText 
                    width='100%'
                    variant='body1' 
                    fontWeight='bold'
                    english='Description'
                    bengali='বর্ণনা'
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
                    bengali='আপনার পানির মধ্যে আর্সেনিকের মাত্রা খুব বেশি থাকার সম্ভবনা প্রবল যা খুবই ক্ষতিকর।'
                />

                <TranslatableText 
                    width='100%'
                    variant='body1' 
                    fontWeight='bold'
                    english='What it means'
                    bengali='অর্থ কী'
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
                    bengali='আমরা পরামর্শ দিচ্ছি যে এই পানি ঘরোয়া কাজে ব্যবহার করা বন্ধ করুন। অবিলম্বে স্থানীয় স্বাস্থ্য কর্তৃপক্ষের সাথে যোগাযোগ করুন (সাধারণত, প্রতিটি উপজেলা সদরে একটি শাখা অফিস থাকে - আপনার এলাকায় তাদের যোগাযোগ করার চেষ্টা করুন) এবং সাহায্য নিন।'
                />

                <TranslatableText 
                    width='100%'
                    variant='body1' 
                    mb='1rem'
                    english={`
                        Normally, every upazila headquarters has one of 
                        the branch offices – try to contact them in your area.
                    `}
                    bengali='অবিলম্বে পরীক্ষা করুন এবং বিকল্প উৎস না থাকলে দ্রুত পানি পরিশোধন ব্যবস্থা স্থাপন করুন।'
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
                    bengali='ফিরে যান'
                />
            </Button>
        </>
    );
}
