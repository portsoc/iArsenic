import { Box, Button, Card, Slider, Switch, TextField, Typography } from "@mui/material";
import { navigate } from "wouter/use-browser-location";
import { useEffect, useState } from "react";
import { AccessToken } from "iarsenic-types";
import { useRoute } from "wouter";
import AccessTokenRepo from "../../utils/AccessTokenRepo";

export default function Depth(): JSX.Element {
    const [, params] = useRoute('/:id/depth');
    const wellId = params?.id;
    const [token, setToken] = useState<AccessToken>();

    const [unit, setUnit] = useState<'m' | 'ft'>('ft');
    const [depth, setDepth] = useState(0);

    function handleSliderChange(_: Event, newValue: number | number[]) {
        setDepth(newValue as number);
    }

    function handleDepthChange(event: React.ChangeEvent<HTMLInputElement>) {
        const value: number = Number(event.target.value);
        setDepth(value);
    }

    function switchUnits() {
        setUnit(unit === 'ft' ? 'm' : 'ft');

        if (unit === 'ft') setDepth(Math.floor(depth * 0.3048));
        if (unit === 'm') setDepth(Math.floor(depth / 0.3048));
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
                Depth
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
                <Box
                    justifyItems='center'
                    alignItems='center'
                    display='grid'
                    gridTemplateColumns='repeat(3, 3rem)'
                    gap={2}
                >
                    <Box justifySelf='end' width='100%'>
                        <Typography>feet</Typography>
                    </Box>

                    <Box>
                        <Switch
                            onChange={switchUnits}
                            sx={{
                                "&.MuiSwitch-root .MuiSwitch-switchBase": {
                                    color: '#154733'
                                },

                                "&.MuiSwitch-root .Mui-checked": {
                                    color: '#154733'
                                }
                            }}
                        />
                    </Box>

                    <Box justifySelf='start'>
                        <Typography>meters</Typography>
                    </Box>
                </Box>

                <Slider
                    sx={{ width: '85%' }}
                    onChange={handleSliderChange}
                    value={depth}
                    step={1}
                    min={0}
                    max={unit === 'ft' ? 328 : 100}
                    valueLabelDisplay="auto"
                />

                <TextField
                    id="outlined-number"
                    label={unit}
                    type="number"
                    value={depth}
                    onChange={handleDepthChange}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    sx={{ width: '85%' }}
                />
            </Card>

            <Button
                sx={{ width: '90%', height: '4rem' }}
                variant='contained'
                onClick={async () => {
                    const headers: HeadersInit = {};
                    if (token) {
                        headers['authorization'] = `Bearer ${token.id}`;
                    }

                    const depthMeters = (() => {
                        if (unit === 'm') return depth;
                        return Math.floor(depth * 0.3048);
                    })();

                    const body = { depth: depthMeters };

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

                    navigate(`/${wellId}/flooding`);
                }}
            >
                Next Step
            </Button>
        </>
    );
}
