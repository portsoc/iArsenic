import { Button, Card, FormControl, FormControlLabel, Radio, RadioGroup, Stack, Typography } from "@mui/material";
import config from "../../config";
import { navigate } from "wouter/use-browser-location";
import { useState } from "react";
import PredictorsStorage from "../../utils/PredictorsStorage";

export default function Depth(): JSX.Element {
    const [flooding, setFlooding] = useState<'yes' | 'no'>();
    const [error, setError] = useState<boolean>(false);

    function handleFloodingChange(event: React.ChangeEvent<HTMLInputElement>) {
        setFlooding(event.target.value as 'yes' | 'no');
        setError(false);
    }

    return (
        <>
            <Typography marginBottom='1rem' textAlign='center' variant='h4'>
                Flooding
            </Typography>

            <Card
                variant='outlined'
                sx={{
                    margin: '0 1rem 1rem 1rem',
                    padding: '1rem',
                    width: '100%',
                    alignItems: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                }}
            >
                <Typography variant='h6'>
                    Is the area prone to flooding?
                </Typography>

                <FormControl
                    error={error}
                    sx={{
                        width: 'max-content',
                        padding: '1rem',
                        borderRadius: '5px',
                        outline: error ? '1px solid red' : 'none',
                    }}
                >
                    <RadioGroup
                        name="flooding-selector"
                        value={flooding}
                        onChange={handleFloodingChange}
                    >
                        <Stack direction='row' columnGap={3}>
                            <FormControlLabel value='yes' control={<Radio />} label='Yes' />
                            <FormControlLabel value='no' control={<Radio />} label='No' />
                        </Stack>
                    </RadioGroup>
                </FormControl>
                {error && (
                    <Typography color='error'>
                        Please select an option
                    </Typography>
                )}
            </Card>

            <Button
                sx={{ width: '90%', height: '4rem' }}
                variant='contained'
                onClick={() => {
                    if (!flooding) {
                        setError(true);
                        return;
                    }

                    const floodingBool = flooding === 'yes';

                    PredictorsStorage.set({
                        flooding: floodingBool,
                    });

                    navigate(`${config.basePath}/review`);
                }}
            >
                Review Input
            </Button>
        </>
    );
}
