import { Box, Slider, Switch, TextField } from "@mui/material";
import { navigate } from "wouter/use-browser-location";
import { useState } from "react";
import { useRoute } from "wouter";
import { useAccessToken } from "../../utils/useAccessToken";
import WellDataEntryLayout from "../../components/WellDataEntryLayout";
import PageCard from "../../components/PageCard";
import { useUnits } from "../../utils/useUnits";
import TranslatableText from "../../components/TranslatableText";

export default function Depth(): JSX.Element {
    const [, params] = useRoute('/well/:id/depth');
    const wellId = params?.id;
    const { data: token } = useAccessToken();
    const { units, setUnits } = useUnits();

    const [depth, setDepth] = useState(0);

    function handleSliderChange(_: Event, newValue: number | number[]) {
        setDepth(newValue as number);
    }

    function handleDepthChange(event: React.ChangeEvent<HTMLInputElement>) {
        const value: number = Number(event.target.value);
        setDepth(value);
    }

    function switchUnits() {
        setUnits(units === 'feet' ? 'meters' : 'feet');

        if (units === 'feet') setDepth(Math.floor(depth * 0.3048));
        if (units === 'meters') setDepth(Math.floor(depth / 0.3048));
    }

    async function handleNext() {
        const headers: HeadersInit = {};
        if (token) {
            headers['authorization'] = `Bearer ${token.id}`;
        }

        const depthMeters = units === 'meters' ? depth : Math.floor(depth * 0.3048);
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
            <PageCard>
                <Box
                    justifyItems='center'
                    alignItems='center'
                    display='grid'
                    gridTemplateColumns='repeat(3, 3rem)'
                    gap={2}
                >
                    <Box justifySelf='end' width='100%'>
                        <TranslatableText 
                            variant='body1' 
                            english='feet'
                            bengali='BENGALI PLACEHOLDER'
                        />
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
                        <TranslatableText 
                            variant='body1' 
                            english='meters'
                            bengali='BENGALI PLACEHOLDER'
                        />
                    </Box>
                </Box>

                <Slider
                    sx={{ width: '85%' }}
                    onChange={handleSliderChange}
                    value={depth}
                    step={1}
                    min={0}
                    max={units === 'feet' ? 1640 : 500}
                    valueLabelDisplay="auto"
                />

                <TextField
                    id="outlined-number"
                    label={units}
                    type="number"
                    value={depth}
                    onChange={handleDepthChange}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    sx={{ width: '85%' }}
                />
            </PageCard>
        </WellDataEntryLayout>
    );
}
