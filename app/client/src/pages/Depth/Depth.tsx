import { Box, Button, CircularProgress, Collapse, Slider, Stack, Switch, TextField } from "@mui/material";
import { navigate } from "wouter/use-browser-location";
import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import WellDataEntryLayout from "../../components/WellDataEntryLayout";
import PageCard from "../../components/PageCard";
import { useUnits } from "../../utils/useUnits";
import TranslatableText from "../../components/TranslatableText";
import { useWells } from "../../utils/useWells";

export default function Depth(): JSX.Element {
    const [, params] = useRoute('/well/:id/depth');
    const wellId = params?.id;
    const { units, setUnits } = useUnits();

    const { getWell, updateWell } = useWells();
    const { data: well, isLoading } = getWell(wellId);
    const updateWellMutation = updateWell()

    const [depth, setDepth] = useState(1);
    const [showDepthGuide, setShowDepthGuide] = useState(false)

    function handleSliderChange(_: Event, newValue: number | number[]) {
        setDepth(newValue as number);
    }

    function handleDepthChange(event: React.ChangeEvent<HTMLInputElement>) {
        const value: number = Number(event.target.value);
        setDepth(value);
    }

    function switchUnits() {
        const newUnits = units === 'feet' ? 'meters' : 'feet';
        setUnits(newUnits);
    }

    async function handleNext(): Promise<void> {
        if (!wellId) return
        const depthMeters = units === 'meters' ? depth : Math.floor(depth * 0.3048);

        const updates: {
            depth: number,
            flooding?: false,
        } = { depth: depthMeters };

        if (depthMeters >= 15) {
            updates.flooding = false
        }

        try {
            await updateWellMutation.mutateAsync({
                wellId,
                data: updates,
            })

            if (updates?.flooding !== undefined) {
                navigate(`/well/${wellId}/well-in-use`)
                return
            }

            navigate(`/well/${wellId}/flooding`);
            return;
        } catch (err) {
            console.error('Failed to update well:', err)
        }
    }
    
    useEffect(() => {
        if (well && well.depth !== undefined) {
            if (units === 'meters') {
                setDepth(well.depth);
            } else {
                setDepth(Math.floor(well.depth / 0.3048));
            }
        }
    }, [well, units]);

    if (isLoading) {
        return (
            <Stack alignItems='center' justifyContent='center'>
                <CircularProgress />
            </Stack>
        )
    }

    return (
        <WellDataEntryLayout
            title={
                <TranslatableText
                    variant="h4"
                    english="Depth"
                    bengali="গভীরতা"
                />
            }
            onNext={handleNext}
        >

            <PageCard>
                <TranslatableText 
                    marginBottom='0.5rem' 
                    textAlign='center' 
                    variant='h5'
                    english='What is the depth of your tubewell?'
                    bengali='আপনার নলকূপের গভীরতা কত?'
                />

                <TranslatableText 
                    variant='body1'
                    english='Enter the number below or drag the scale.'
                    bengali='নিচে সংখ্যা লিখুন বা স্কেল টেনে দিন।'
                />

                <Button
                    variant='outlined'
                    onClick={() => setShowDepthGuide(!showDepthGuide)}
                >
                    <TranslatableText
                        variant="body1"
                        textAlign='center' 
                        english="Not sure about depth?"
                        bengali="গভীরতা না জানলে কীভাবে অনুমান করবেন?"
                    />
                </Button>

                <Box position='relative'>
                    <Collapse in={showDepthGuide}>
                        <TranslatableText
                            mb='2rem'
                            variant="body1"
                            textAlign="justify"
                            english={`If the tubewell was installed by 3–4 people using only hands and a flap, it is likely less than 250 ft.`}
                            bengali={`যদি নলকূপ হাত দিয়ে ৩–৪ জন মিলে ছোট তিন বাঁশের মাচা দিয়ে বসানো হয়, তাহলে সম্ভবত ২৫০ ফুটের নিচে।`}
                        />

                        <TranslatableText
                            mb='2rem'
                            variant="body1"
                            textAlign="justify"
                            english={`If the tubewell was installed by a team using a bamboo rig and pump, with people rotating around a hole, it is likely 500 ft or more.`}
                            bengali={`যদি অনেক লোক মিলে বাঁশের তৈরি অনেক উঁচা মাচা ব্যবহার করে, পানির পাম্প চালিয়ে ঘুরে ঘুরে কাজ করে নলকূপ বসায়, তাহলে সেটি সম্ভবত ৫০০ ফুট বা তার বেশি।`}
                        />

                        <TranslatableText
                            variant="body1"
                            textAlign="justify"
                            english={`You may enter an approximate depth like 200 ft or 600 ft based on this.`}
                            bengali={`আপনি আপনার নলকুপ বসানোর কায়দার কথা চিন্তা করে ২০০ ফুট বা ৬০০ ফুট এইভাবে আনুমানিক গভীরতা লিখতে পারেন।`}
                        />
                    </Collapse>
                </Box>
            </PageCard>

            <PageCard>
                <Box
                    justifyItems='center'
                    alignItems='center'
                    display='grid'
                    gridTemplateColumns='repeat(3, 4.5rem)'
                    position='relative'
                    gap={2}
                >
                    <Box justifySelf='end' width='100%'>
                        <TranslatableText
                            textAlign="right"
                            variant='body1' 
                            english='feet'
                            bengali='ফুট (ft)'
                        />
                    </Box>

                    <Box>
                        <Switch
                            checked={(units === 'meters')}
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
                            bengali='মিটার (m) '
                        />
                    </Box>
                </Box>

                <Slider
                    sx={{ width: '85%' }}
                    onChange={handleSliderChange}
                    value={depth}
                    step={1}
                    min={1}
                    max={units === 'meters' ? 500 : 1640}
                    valueLabelDisplay="auto"
                />

                <TextField
                    id="outlined-number"
                    label={units === 'meters' ?
                        <TranslatableText 
                            variant='body1' 
                            english='meters'
                            bengali='মিটার (m) '
                        /> :
                        <TranslatableText 
                            variant='body1' 
                            english='feet'
                            bengali='ফুট (ft)'
                        />
                    }
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
