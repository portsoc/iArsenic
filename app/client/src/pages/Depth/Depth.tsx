import { Box, Card, Slider, Switch, TextField, Typography } from "@mui/material";
import { navigate } from "wouter/use-browser-location";
import { useState } from "react";
import { useRoute } from "wouter";
import { useAccessToken } from "../../utils/useAccessToken";
import WellDataEntryLayout from "../../components/WellDataEntryLayout";

export default function Depth(): JSX.Element {
    const [, params] = useRoute('/well/:id/depth');
    const wellId = params?.id;
    const { data: token } = useAccessToken();

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

    async function handleNext() {
        const headers: HeadersInit = {};
        if (token) {
            headers['authorization'] = `Bearer ${token.id}`;
        }

        const depthMeters = unit === 'm' ? depth : Math.floor(depth * 0.3048);
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

        navigate(`/well/${wellId}/flooding`);
    }

    return (
        <WellDataEntryLayout title="Depth" onNext={handleNext}>
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
                    max={unit === 'ft' ? 1640 : 500}
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
        </WellDataEntryLayout>
    );
}
