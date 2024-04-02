import { Box, Button, Card, Slider, Switch, TextField, Typography } from "@mui/material";
import config from "../../config";
import { navigate } from "wouter/use-browser-location";
import { useState } from "react";

export default function Depth(): JSX.Element {
    const [unit, setUnit] = useState<'meter' | 'feet'>('feet');
    const [depth, setDepth] = useState(0);

    function handleSliderChange() {
        console.log('hello from handleSliderChange');
    }

    function handleDepthChange() {
        console.log('hello from handleDepthChange');
    }

    function switchUnits() {
        console.log('hello from switchUnits');
    }

    return (
        <>
            <Typography marginBottom='1rem' textAlign='center' variant='h4'>
                Depth
            </Typography>

            <Card
                raised
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

                <Slider sx={{ width: '85%' }} onChange={handleSliderChange}></Slider>

                <TextField
                    id="outlined-number"
                    label="Number"
                    type="number"
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </Card>

            <Button
                sx={{ width: '90%', height: '4rem' }}
                variant='contained'
                onClick={() => navigate(`${config.basePath}/depth`)}
            >
                Review Input
            </Button>
        </>
    );
}
