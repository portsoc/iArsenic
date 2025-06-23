import { CircularProgress, FormControl, FormControlLabel, Radio, RadioGroup, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { useAccessToken } from "../../utils/useAccessToken";
import { navigate } from "wouter/use-browser-location";
import WellDataEntryLayout from "../../components/WellDataEntryLayout";
import PageCard from "../../components/PageCard";
import TranslatableText from "../../components/TranslatableText";
import { useWells } from "../../utils/useWells";

export default function WellInUse(): JSX.Element {
    const [, params] = useRoute('/well/:id/well-in-use');
    const wellId = params?.id;
    const { data: token } = useAccessToken();

    const { getWell, updateWell } = useWells();
    const { data: well, isLoading } = getWell(wellId);
    const updateWellMutation = updateWell()

    const [wellInUse, setWellInUse] = useState<boolean>();
    const [pageError, setPageError] = useState<boolean>(false);

    function handleWellInUseChange(event: React.ChangeEvent<HTMLInputElement>) {
        const newBool = event.target.value === 'yes';
        setWellInUse(newBool);
        setPageError(false);
    }

    async function handleNext() {
        if (wellInUse === undefined || !wellId) {
            setPageError(true);
            return;
        }

        try {
            await updateWellMutation.mutateAsync({
                wellId,
                data: { wellInUse },
            });

            if (token) {
                navigate(`/well/${wellId}/upload-image`);
            } else {
                navigate(`/well/${wellId}/review`);
            }
        } catch (err) {
            console.error('Failed to update well:', err);
        }
    }

    useEffect(() => {
        if (well && well.wellInUse !== undefined) {
            setWellInUse(well.wellInUse);
        }
    }, [well]);

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
                    error={pageError}
                    sx={{
                        width: 'max-content',
                        padding: '1rem',
                        borderRadius: '5px',
                        outline: pageError ? '1px solid red' : 'none',
                    }}
                >
                    <RadioGroup
                        name="anyone-drinking-selector"
                        value={
                            wellInUse === true ? 'yes' :
                            wellInUse === false ? 'no' :
                            ''
                        }
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

                {pageError && (
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
