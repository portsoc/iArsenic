import { Collapse, Button, FormControl, FormControlLabel, Radio, RadioGroup, Stack, Box, Typography } from "@mui/material";
import { navigate } from "wouter/use-browser-location";
import { useState } from "react";
import { Staining, StainingSchema, UtensilStaining, UtensilStainingSchema } from 'iarsenic-types';
import { useRoute } from "wouter";
import { useAccessToken } from "../../utils/useAccessToken";
import WellDataEntryLayout from "../../components/WellDataEntryLayout";
import PageCard from "../../components/PageCard";
import TranslatableText from "../../components/TranslatableText";

export default function StainingPage(): JSX.Element {
    const [, params] = useRoute('/well/:id/staining');
    const wellId = params?.id;

    const { data: token } = useAccessToken();

    const [wellStaining, setWellStaining] = useState<Staining>();
    const [utensilStaining, setUtensilStaining] = useState<UtensilStaining>();

    const [errors, setErrors] = useState({
        wellStaining: false,
        utensilStaining: false
    });

    function handleValidation() {
        const newErrors = {
            wellStaining: !wellStaining,
            utensilStaining: wellStaining === 'not sure' && !utensilStaining
        };

        setErrors(newErrors);

        return !Object.values(newErrors).some(Boolean);
    }

    async function handleNext() {
        if (!handleValidation()) return;

        const headers: HeadersInit = {};
        if (token) {
            headers['authorization'] = `Bearer ${token.id}`;
        }

        const body = {
            staining: wellStaining,
            utensilStaining: wellStaining === 'not sure' ? utensilStaining : undefined
        };

        const res = await fetch(`/api/v1/self/well/${wellId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            console.error('Failed to update well:', res);
            return;
        }

        navigate(`/well/${wellId}/depth`);
    }

    return (
        <WellDataEntryLayout
            title={
                <TranslatableText
                    variant="h4"
                    english="Staining"
                    bengali="পাকা মেঝের দাগের ধরন"
                />
            }
            onNext={handleNext}
        >
            <PageCard>
                <TranslatableText 
                    marginBottom='1rem' 
                    textAlign='center' 
                    variant='h5'
                    english='Is There Staining On The Platform?'
                    bengali='নলকূপের পাকা মেঝেতে কি কোনো দাগ আছে? (যেখানে পানি পড়ে ছিটকে ছড়ায়, সেই পাকা সিমেন্টের মেঝেতে)'
                />

                <Stack mb={2} alignItems='center' width='100%'>
                    <Button
                        sx={{ width: '70%', height: '3rem' }}
                        variant='outlined'
                        onClick={() => navigate(`/staining-guide`)}
                    >
                        <TranslatableText 
                            variant='body1'
                            english='See Staining Guide'
                            bengali='দাগ চেনার গাইড দেখুন'
                        />
                    </Button>
                </Stack>

                <FormControl 
                    error={errors.wellStaining} 
                    component="fieldset"
                    sx={{
                        width: '100%',
                        padding: '1rem',
                        borderRadius: '5px',
                        outline: errors.wellStaining ? '1px solid red' : 'none',
                    }}
                >
                    <RadioGroup
                        onChange={event => {
                            setWellStaining(StainingSchema.parse(event.target.value));
                            setErrors(e => ({ ...e, wellStaining: false }));
                        }}
                        name="well-staining-selector"
                    >
                        <FormControlLabel 
                            sx={{ marginBottom: '1rem' }}
                            value="red"
                            control={<Radio />}
                            label={
                                <TranslatableText 
                                    variant='body1'
                                    english='Red' 
                                    bengali='লালচে দাগ (আয়রন থেকে তৈরি — মেঝে লাল বা কমলা দেখায়)'
                                />
                            }
                        />

                        <FormControlLabel 
                            sx={{ marginBottom: '1rem' }}
                            value="black" 
                            control={<Radio />} 
                            label={
                                <TranslatableText 
                                    variant='body1'
                                    english='Black' 
                                    bengali='কালচে দাগ (সিমেন্ট রঙ বা গাঢ় কালো, কোনো লালচে ভাব নেই)'
                                />
                            }
                        />
                        <FormControlLabel
                            sx={{ marginBottom: '1rem' }}
                            value="not sure"
                            control={<Radio />}
                            label={
                                <TranslatableText 
                                    variant='body1'
                                    english='Mixed or Unsure' 
                                    bengali='মিশ্র বা নিশ্চিত নন (দাগ স্পষ্ট নয় বা বুঝতে পারছেন না)'
                                />
                            }
                        />
                    </RadioGroup>
                    {errors.wellStaining && (
                        <TranslatableText 
                            error={true}
                            variant='body1'
                            english='Please select a staining type for the well platform.'
                            bengali='অনুগ্রহ করে নলকূপের চৌকাঠের দাগের ধরন নির্বাচন করুন' // chatgpt generated
                        />
                    )}
                </FormControl>

                <Box position='relative'>
                    <Collapse in={wellStaining === 'not sure'}>

                        <FormControl 
                            error={errors.utensilStaining} 
                            component="fieldset"
                            sx={{
                                width: '100%',
                                borderRadius: '5px',
                                outline: errors.utensilStaining ? '1px solid red' : 'none',
                            }}
                        >
                            <TranslatableText
                                variant="h5" 
                                textAlign='center' 
                                my='1rem'
                                english='Is there staining on your utensil?'
                                bengali='আপনার হাড়ি-পাতিলে কি কোনো দাগ পড়ে? (নলকূপের পানি দিয়ে নিয়মিত ব্যবহারের ফলে)'
                            />

                            <RadioGroup
                                onChange={event => {
                                    setUtensilStaining(UtensilStainingSchema.parse(event.target.value));
                                    setErrors(e => ({ ...e, utensilStaining: false }));
                                }}
                                name="utensil-staining-selector"
                            >
                                <FormControlLabel
                                    sx={{ marginBottom: '1rem' }}
                                    value="red"
                                    control={<Radio />}
                                    label={
                                        <TranslatableText
                                            variant="body1" 
                                            textAlign='center' 
                                            english='Red'
                                            bengali='লালচে দাগ পড়ে'
                                        />
                                    }
                                />
                                <FormControlLabel
                                    sx={{ marginBottom: '1rem' }}
                                    value="black"
                                    control={<Radio />}
                                    label={
                                        <TranslatableText
                                            variant="body1" 
                                            textAlign='center' 
                                            english="No colour change to slightly blackish"
                                            bengali='দাগ নেই বা হালকা কালচে দাগ পড়ে'
                                        />
                                    }
                                />
                            </RadioGroup>

                            {errors.utensilStaining && (
                                <TranslatableText
                                    error={true} 
                                    english='Please select a staining type for the utensil.'
                                    bengali='অনুগ্রহ করে পাত্রের দাগের ধরন নির্বাচন করুন'
                                />
                            )}

                        </FormControl>
                    </Collapse>

                    <Collapse in={wellStaining === 'red'}>
                        <Box mb={1}>
                            <img width='100%' src={`/red_platform_1.jpg`} />
                        </Box>

                        {/* TransatableText component failing here for unknown reasons */}
                        <>
                            <Typography
                                className="english"
                                variant="body1"
                                textAlign="center"
                                sx={{ fontStyle: 'italic' }}
                            >
                                Example of a tube well platform with red platform staining.
                            </Typography>

                            <Typography
                                className="bengali"
                                variant="body1"
                                textAlign="center"
                                sx={{ fontStyle: 'italic' }}
                            >
                                লাল দাগযুক্ত নলকূপের পাকা মেঝের একটি উদাহরণ।
                            </Typography>
                        </>

                    </Collapse>

                    <Collapse in={wellStaining === 'black'}>
                        <Box mb={1}>
                            <img width='100%' src={`/black_platform_1.jpg`} />
                        </Box>

                        {/* TransatableText component failing here for unknown reasons */}
                        <>
                            <Typography
                                className="english"
                                variant="body1"
                                textAlign="center"
                                sx={{ fontStyle: 'italic' }}
                            >
                                Example of a tube well platform with black platform staining.
                            </Typography>

                            <Typography
                                className="bengali"
                                variant="body1"
                                textAlign="center"
                                sx={{ fontStyle: 'italic' }}
                            >
                                কালো দাগযুক্ত নলকূপের পাকা মেঝের একটি উদাহরণ।
                            </Typography>
                        </>

                    </Collapse>
                </Box>
            </PageCard>
        </WellDataEntryLayout>
    );
}
