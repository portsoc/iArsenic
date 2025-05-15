import { FormControl, FormControlLabel, Radio, RadioGroup, Stack } from "@mui/material";
import { useState } from "react";
import { useRoute } from "wouter";
import { useAccessToken } from "../../utils/useAccessToken";
import WellDataEntryLayout from "../../components/WellDataEntryLayout";
import { navigate } from "wouter/use-browser-location";
import PageCard from "../../components/PageCard";
import TranslatableText from "../../components/TranslatableText";

export default function Flooding(): JSX.Element {
    const [, params] = useRoute('/well/:id/flooding');
    const wellId = params?.id;
    const { data: token } = useAccessToken();

    const [flooding, setFlooding] = useState<'yes' | 'no'>();
    const [error, setError] = useState<boolean>(false);

    function handleFloodingChange(event: React.ChangeEvent<HTMLInputElement>) {
        setFlooding(event.target.value as 'yes' | 'no');
        setError(false);
    }

    async function handleNext() {
        if (!flooding) {
            setError(true);
            return;
        }

        const floodingBool = flooding === 'yes';
        const body = { flooding: floodingBool };
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

        navigate(`/well/${wellId}/well-in-use`);
    }

    return (
        <WellDataEntryLayout title="Flooding" onNext={handleNext}>
            <PageCard>
                <TranslatableText
                    variant='h5'
                    mb='1rem'
                    textAlign="center"
                    english='Is the area prone to flooding?'
                    bengali='BENGALI PLACEHOLDER'
                />

                <FormControl
                    error={error}
                    component="fieldset"
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
                            <FormControlLabel 
                                value='yes' 
                                control={<Radio />} 
                                label={
                                    <TranslatableText
                                        variant="body1"
                                        english="Yes"
                                        bengali="হ্যাঁ"
                                    />
                                }
                            />
                            <FormControlLabel 
                                value='no' 
                                control={<Radio />} 
                                label={
                                    <TranslatableText
                                        variant="body1"
                                        english="No"
                                        bengali="না"
                                    />
                                }
                            />
                        </Stack>
                    </RadioGroup>
                </FormControl>

                {error && (
                    <TranslatableText
                        variant='body1'
                        error={true}
                        english='Please select an option'
                        bengali='BENGALI PLACEHOLDER'
                    />
                )}
            </PageCard>
        </WellDataEntryLayout>
    );
}
