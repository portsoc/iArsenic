import { FormControl, FormControlLabel, Radio, RadioGroup, Stack } from "@mui/material";
import { useState } from "react";
import { useRoute } from "wouter";
import { useAccessToken } from "../../utils/useAccessToken";
import { navigate } from "wouter/use-browser-location";
import WellDataEntryLayout from "../../components/WellDataEntryLayout";
import PageCard from "../../components/PageCard";
import TranslatableText from "../../components/TranslatableText";

export default function WellInUse(): JSX.Element {
    const [, params] = useRoute('/well/:id/well-in-use');
    const wellId = params?.id;
    const { data: token } = useAccessToken();

    const [wellInUse, setWellInUse] = useState<boolean>();
    const [error, setError] = useState<boolean>(false);

    function handleWellInUseChange(event: React.ChangeEvent<HTMLInputElement>) {
        const newBool = event.target.value === 'yes';
        setWellInUse(newBool);
        setError(false);
    }

    async function handleNext() {
        if (wellInUse === undefined) {
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

        if (token) {
            navigate(`/well/${wellId}/upload-image`);
        } else {
            navigate(`/well/${wellId}/review`);
        }
    }

    return (
        <WellDataEntryLayout
            title={
                <TranslatableText
                    variant="h4"
                    english="Well in use"
                    bengali="নলকূপ ব্যবহার"
                />
            }
            onNext={handleNext}
        >
            <PageCard>
                <TranslatableText 
                    variant='h5'
                    textAlign="center"
                    english='Is anyone drinking from this well?'
                    bengali='এই নলকূপের পানি কি কেউ খাওয়া বা রান্নার কাজে ব্যবহার করছেন?'
                />

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
                            <FormControlLabel 
                                value='yes' 
                                control={<Radio />} 
                                label={
                                    <TranslatableText 
                                        variant='body1'
                                        english='Yes'
                                        bengali='হ্যাঁ'
                                    />
                                }
                            />

                            <FormControlLabel 
                                value='no' 
                                control={<Radio />} 
                                label={
                                    <TranslatableText 
                                        variant='body1'
                                        english='No'
                                        bengali='না'
                                    />
                                }
                            />
                        </Stack>
                    </RadioGroup>
                </FormControl>

                {error && (
                    <TranslatableText 
                        error={true}
                        english='Please select an option'
                        bengali='অনুগ্রহ করে একটি অপশন বেছে নিন'
                    />
                )}
            </PageCard>
        </WellDataEntryLayout>
    );
}
