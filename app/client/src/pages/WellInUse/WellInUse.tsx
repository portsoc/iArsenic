import { FormControl, FormControlLabel, Radio, RadioGroup, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { useRoute } from "wouter";
import { useAccessToken } from "../../utils/useAccessToken";
import { navigate } from "wouter/use-browser-location";
import WellDataEntryLayout from "../../components/WellDataEntryLayout";
import PageCard from "../../components/PageCard";

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
        <WellDataEntryLayout title="Well in use" onNext={handleNext}>
            <PageCard>
                <Typography variant='h5'>
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
            </PageCard>
        </WellDataEntryLayout>
    );
}
