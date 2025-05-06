import { Collapse, Button, Card, FormControl, FormControlLabel, Radio, RadioGroup, Typography, Stack, Box } from "@mui/material";
import { navigate } from "wouter/use-browser-location";
import { useState } from "react";
import { Staining, StainingSchema, UtensilStaining, UtensilStainingSchema } from 'iarsenic-types';
import { useRoute } from "wouter";
import { useAccessToken } from "../../utils/useAccessToken";

export default function StainingPage(): JSX.Element {
    const [, params] = useRoute('/well/:id/staining');
    const wellId = params?.id;

    const { data: token } = useAccessToken()

    const [wellStaining, setWellStaining] = useState<Staining>();
    const [utensilStaining, setUtensilStaining] = useState<UtensilStaining>();

    // State to manage input errors
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

        // Return false if any field is in error
        return !Object.values(newErrors).some(Boolean);
    }

    return (
        <>
            <Typography marginBottom='1rem' textAlign='center' variant='h4'>
                Staining
            </Typography>

            <Card
                raised
                variant='outlined'
                sx={{ width: '100%', margin: '0 1rem 1rem 1rem', padding: '1rem'}}
            >
                <Typography marginBottom='1rem' textAlign='center' variant='h5'>
                    Is There Staining On The Platform?
                </Typography>

                <Stack mb={2} alignItems='center'>
                    <Button
                        sx={{ width: '70%', height: '3rem' }}
                        variant='outlined'
                        onClick={() => navigate(`/staining-guide`)}
                    >
                        See Staining Guide
                    </Button>
                </Stack>

                <FormControl 
                    error={errors.wellStaining} 
                    component="fieldset"
                >
                    <RadioGroup
                        onChange={event => {
                            setWellStaining(StainingSchema.parse(event.target.value));
                            setErrors(e => ({ ...e, wellStaining: false }));
                        }}
                        name="well-staining-selector"
                    >
                        <FormControlLabel value="red" control={<Radio />} label="Red" />
                        <FormControlLabel value="black" control={<Radio />} label="Black" />
                        <FormControlLabel
                            value="not sure"
                            control={<Radio />}
                            label="Mixed or Unsure"
                        />
                    </RadioGroup>
                    {errors.wellStaining &&
                        <Typography color="error">
                            Please select a staining type for the well platform.
                        </Typography>
                    }
                </FormControl>

                <Collapse in={wellStaining === 'not sure'}>
                    <FormControl error={errors.utensilStaining} component="fieldset">
                        <Typography variant="h5" textAlign='center' style={{ marginTop: '1rem' }}>
                            Is there staining on your utensil?
                        </Typography>
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
                                label="Red"
                            />
                            <FormControlLabel
                                value="black"
                                control={<Radio />}
                                label="No colour change to slightly blackish"
                            />
                        </RadioGroup>
                        {errors.utensilStaining &&
                            <Typography color="error">
                                Please select a staining type for the utensil.
                            </Typography>
                        }
                    </FormControl>
                </Collapse>

                <Collapse in={wellStaining === 'red'}>
                    <Box mb={1}>
                        <img width='100%' src={`/red_platform_1.jpg`}></img>
                    </Box>

                    <Typography
                        className='english'
                        variant='body1'
                        textAlign='center'
                        fontStyle='italic'
                    >
                        Example of a tube well platform with red platform staining.
                    </Typography>
                </Collapse>

                <Collapse in={wellStaining === 'black'}>
                    <Box mb={1}>
                        <img width='100%' src={`/black_platform_1.jpg`}></img>
                    </Box>

                    <Typography
                        className='english'
                        variant='body1'
                        textAlign='center'
                        fontStyle='italic'
                    >
                        Example of a tube well platform with black platform staining.
                    </Typography>
                </Collapse>
            </Card>

            <Button
                sx={{ width: '90%', height: '4rem' }}
                variant='contained'
                onClick={async () => {
                    if (!handleValidation()) return;

                    const headers: HeadersInit = {};

                    if (token) {
                        headers['authorization'] = `Bearer ${token.id}`;
                    }

                    const body = {
                        staining: wellStaining,
                        utensilStaining: wellStaining === 'not sure' ?
                            utensilStaining :
                            undefined
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
                }}
            >
                Next Step
            </Button>
        </>
    );
}
