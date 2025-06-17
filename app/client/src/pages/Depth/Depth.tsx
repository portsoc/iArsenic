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
            </PageCard>

            <PageCard>
                <TranslatableText
                    variant="h5"
                    textAlign='center' 
                    english="Not sure about depth? Here's a quick guide"
                    bengali="গভীরতা না জানলে কীভাবে অনুমান করবেন?"
                />

                <TranslatableText
                    variant="body1"
                    textAlign="justify"
                    english={`If the tubewell was installed by 3–4 people using only hands and a flap, it is likely less than 250 ft.`}
                    bengali={`যদি নলকূপ হাত দিয়ে ৩–৪ জন মিলে ছোট তিন বাঁশের মাচা দিয়ে বসানো হয়, তাহলে সম্ভবত ২৫০ ফুটের নিচে।`}
                />

                <TranslatableText
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
            </PageCard>

            <PageCard>
                <Box
                    justifyItems='center'
                    alignItems='center'
                    display='grid'
                    gridTemplateColumns='repeat(3, 4.5rem)'
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
