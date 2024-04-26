import { Collapse, Button, Card, FormControl, FormControlLabel, Radio, RadioGroup, Typography } from "@mui/material";
import config from "../../config";
import { navigate } from "wouter/use-browser-location";
import { useState } from "react";

export default function Staining(): JSX.Element {
    const [wellStaining, setWellStaining] = useState<'Red' | 'Black' | 'not-sure'>();
    const [utensilStaining, setUtensilStaining] = useState<'Red' | 'Black' | 'not-sure'>();

    // State to manage input errors
    const [errors, setErrors] = useState({
        wellStaining: false,
        utensilStaining: false
    });

    function handleValidation() {
        const newErrors = {
            wellStaining: !wellStaining,
            utensilStaining: wellStaining === 'not-sure' && !utensilStaining
        };

        setErrors(newErrors);

        return !Object.values(newErrors).some(Boolean); // Return false if any field is in error
    }

    return (
        <>
            <Typography marginBottom='1rem' textAlign='center' variant='h4'>Staining</Typography>

            <Card raised variant='outlined' sx={{ width: '100%', margin: '0 1rem 1rem 1rem', padding: '1rem'}}>
                <Typography marginBottom='1rem' textAlign='center' variant='h5'>
                    Is There Staining On The Platform?
                </Typography>

                {/* <Stack mb={2} alignItems='center'>
                    <Button
                        sx={{ width: '70%', height: '3rem' }}
                        variant='outlined'
                        onClick={() => navigate(`${config.basePath}/staining-guide`)}
                    >
                        See Staining Guide
                    </Button>
                </Stack> */}

                <FormControl error={errors.wellStaining} component="fieldset">
                    <RadioGroup
                        onChange={(event) => {
                            setWellStaining(event.target.value as 'Red' | 'Black' | 'not-sure');
                            setErrors(e => ({ ...e, wellStaining: false }));
                        }}
                        name="well-staining-selector"
                    >
                        <FormControlLabel value="Red" control={<Radio />} label="Red" />
                        <FormControlLabel value="Black" control={<Radio />} label="Black" />
                        <FormControlLabel value="not-sure" control={<Radio />} label="Mixed or Unsure" />
                    </RadioGroup>
                    {errors.wellStaining && <Typography color="error">Please select a staining type for the well platform.</Typography>}
                </FormControl>

                <Collapse in={wellStaining === 'not-sure'}>
                    <FormControl error={errors.utensilStaining} component="fieldset">
                        <Typography variant="h5" textAlign='center' style={{ marginTop: '1rem' }}>
                            Is there staining on your utensil?
                        </Typography>
                        <RadioGroup
                            onChange={(event) => {
                                setUtensilStaining(event.target.value as 'Red' | 'Black' | 'not-sure');
                                setErrors(e => ({ ...e, utensilStaining: false }));
                            }}
                            name="utensil-staining-selector"
                        >
                            <FormControlLabel value="Red" control={<Radio />} label="Red" />
                            <FormControlLabel value="Black" control={<Radio />} label="No colour change to slightly blackish" />
                        </RadioGroup>
                        {errors.utensilStaining && <Typography color="error">Please select a staining type for the utensil.</Typography>}
                    </FormControl>
                </Collapse>
            </Card>

            <Button
                sx={{ width: '90%', height: '4rem' }}
                variant='contained'
                onClick={() => {
                    if (!handleValidation()) return;
                    localStorage.setItem('staining', JSON.stringify({ well: wellStaining, utensil: utensilStaining }));
                    navigate(`${config.basePath}/depth`)
                }}
            >
                Next Step
            </Button>
        </>
    );
}
