import { Button, Card, FormControl, FormControlLabel, Radio, RadioGroup, Stack, Typography } from "@mui/material";
import { navigate } from "wouter/use-browser-location";
import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { AccessToken } from "iarsenic-types";
import AccessTokenRepo from "../../utils/AccessTokenRepo";

export default function(): JSX.Element {
    const [, params] = useRoute('/well/:id/well-in-use');
    const wellId = params?.id;
    const [token, setToken] = useState<AccessToken>();

    const [wellInUse, setWellInUse] = useState<boolean>();
    const [error, setError] = useState<boolean>(false);

    function handleWellInUseChange(event: React.ChangeEvent<HTMLInputElement>) {
        const newBool = event.target.value === 'yes'
        setWellInUse(newBool);
        setError(false);
    }

    useEffect(() => {
        async function fetchToken() {
            const token = await AccessTokenRepo.get();
            if (token == null) return;

            setToken(token);
        }

        fetchToken();
    }, []);

    return (
        <>
            <Typography marginBottom='1rem' textAlign='center' variant='h4'>
                Well in use
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
                    Is anyone drinking from this well?
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
                        name="anyone-drinking-selector"
                        value={wellInUse}
                        onChange={handleWellInUseChange}
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
                onClick={async () => {
                    if (!wellInUse) {
                        setError(true);
                        return;
                    }

                    const body = { wellInUse };
                    const headers: HeadersInit = {};

                    if (token) {
                        headers['authorization'] = `Bearer ${token.id}`;
                    }

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

                    navigate(`/well/${wellId}/review`);
                }}
            >
                Review
            </Button>
        </>
    );
}
