import { Collapse, Button, FormControl, FormControlLabel, Radio, RadioGroup, Stack, Box } from "@mui/material";
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
        <WellDataEntryLayout title="Staining" onNext={handleNext}>
            <PageCard>
                <TranslatableText 
                    marginBottom='1rem' 
                    textAlign='center' 
                    variant='h5'
                    english='Is There Staining On The Platform?'
                    bengali='BENGALI PLACEHOLDER'
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
                            bengali='BENGALI PLACEHOLDER'
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
                            value="red"
                            control={<Radio />}
                            label={
                                <TranslatableText 
                                    variant='body1'
                                    english='Red' 
                                    bengali='BENGALI PLACEHOLDEr'
                                />
                            }
                        />

                        <FormControlLabel 
                            value="black" 
                            control={<Radio />} 
                            label={
                                <TranslatableText 
                                    variant='body1'
                                    english='Black' 
                                    bengali='BENGALI PLACEHOLDEr'
                                />
                            }
                        />
                        <FormControlLabel
                            value="not sure"
                            control={<Radio />}
                            label="Mixed or Unsure"
                        />
                    </RadioGroup>
                    {errors.wellStaining && (
                        <TranslatableText 
                            error={true}
                            variant='body1'
                            english='Please select a staining type for the well platform.'
                            bengali='BENGALI PLACEHOLDEr'
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
                                padding: '1rem',
                                borderRadius: '5px',
                                outline: errors.utensilStaining ? '1px solid red' : 'none',
                            }}
                        >
                            <TranslatableText
                                variant="h5" 
                                textAlign='center' 
                                mt='1rem'
                                english='Is there staining on your utensil?'
                                bengali='BENGALI PLACEHOLDER'
                            />

                            <RadioGroup
                                onChange={event => {
                                    setUtensilStaining(UtensilStainingSchema.parse(event.target.value));
                                    setErrors(e => ({ ...e, utensilStaining: false }));
                                }}
                                name="utensil-staining-selector"
                            >
                                <FormControlLabel
                                    value="red"
                                    control={<Radio />}
                                    label={
                                        <TranslatableText
                                            variant="h5" 
                                            textAlign='center' 
                                            mt='1rem'
                                            english='Red'
                                            bengali='BENGALI PLACEHOLDER'
                                        />
                                    }
                                />
                                <FormControlLabel
                                    value="black"
                                    control={<Radio />}
                                    label={
                                        <TranslatableText
                                            variant="h5" 
                                            textAlign='center' 
                                            mt='1rem'
                                            english="No colour change to slightly blackish"
                                            bengali='BENGALI PLACEHOLDER'
                                        />
                                    }
                                />
                            </RadioGroup>

                            {errors.utensilStaining && (
                                <TranslatableText
                                    error={true} 
                                    english='Please select a staining type for the utensil.'
                                    bengali='BENGALI PLACEHOLDER'
                                />
                            )}

                        </FormControl>
                    </Collapse>

                    <Collapse in={wellStaining === 'red'}>
                        <Box mb={1}>
                            <img width='100%' src={`/red_platform_1.jpg`} />
                        </Box>
                        <TranslatableText
                            className='english'
                            variant='body1'
                            textAlign='center'
                            fontStyle='italic'
                            english='Example of a tube well platform with red platform staining.'
                            bengali='BENGALI PLACEHOLDER'
                        />
                    </Collapse>

                    <Collapse in={wellStaining === 'black'}>
                        <Box mb={1}>
                            <img width='100%' src={`/black_platform_1.jpg`} />
                        </Box>
                        <TranslatableText
                            className='english'
                            variant='body1'
                            textAlign='center'
                            fontStyle='italic'
                            english='Example of a tube well platform with black platform staining.'
                            bengali='BENGALI PLACEHOLDER'
                        />
                    </Collapse>
                </Box>
            </PageCard>
        </WellDataEntryLayout>
    );
}
