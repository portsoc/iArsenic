import { Box, Button, CircularProgress, Stack } from "@mui/material";
import { Well } from "iarsenic-types";
import { navigate } from "wouter/use-browser-location";
import PageCard from "../../components/PageCard";
import TranslatableText from "../../components/TranslatableText";
import RegionTranslationsFetcher from "../../utils/RegionTranslationsFetcher";
import { useEffect, useState } from "react";
import { RegionTranslations } from "../../types";

interface props {
    well: Well;
}

export default function({ well }: props) {
    const [rt, setRegionTranslations] = useState<RegionTranslations>();

    if (!well?.division) {
        throw new Error('Missing reion');
    }

    async function fetchRegionTranslations() {
        const translations = await RegionTranslationsFetcher();
        setRegionTranslations(translations);
    }

    useEffect(() => {
        fetchRegionTranslations();
    }, []);

    if (!rt) {
        return (
            <Stack direction='column' alignContent='center' justifyContent='center'>
                <CircularProgress />
            </Stack>
        );
    }

    return (
        <PageCard>
            <Stack width='100%'>
                <TranslatableText
                    variant="h6"
                    mb='1rem'
                    english='Region'
                    bengali='অঞ্চল'
                />

                <TranslatableText
                    variant="body1"
                    english={<>
                        <strong>Division</strong> {well.division}
                    </>}
                    bengali={<>
                        <strong>{rt.Divisions.Division}</strong> {rt.Divisions[well.division]}
                    </>}
                />

                <TranslatableText
                    variant="body1"
                    english={<>
                        <strong>District</strong> {well.district}
                    </>}
                    bengali={<>
                        <strong>{rt.Districts.District}</strong> {rt.Districts[well.district as string]}
                    </>}
                />


                <TranslatableText
                    variant="body1"
                    english={<>
                        <strong>Upazila</strong> {well.upazila}
                    </>}
                    bengali={<>
                        <strong>{rt.Upazilas.Upazila}</strong> {rt.Upazilas[well.upazila as string]}
                    </>}
                />

                <TranslatableText
                    variant="body1"
                    english={<>
                        <strong>Union</strong> {well.union}
                    </>}
                    bengali={<>
                        <strong>{rt.Unions.Union}</strong> {rt.Unions[well.union as string]}
                    </>}
                />

                <TranslatableText
                    variant="body1"
                    english={<>
                        <strong>Mouza</strong> {well.mouza}
                    </>}
                    bengali={<>
                        <strong>{rt.Mouzas.Mouza}</strong> {rt.Mouzas[well.mouza as string]}
                    </>}
                />

                <Box display="flex" justifyContent="center" mt={4}>
                    <Button
                        sx={{ width: '80%', height: '3rem' }}
                        variant="outlined"
                        onClick={() => {
                            navigate(`/well/${well.id}/region`);
                        }}
                    >
                        <TranslatableText
                            variant="body1"
                            english='Edit Region'
                            bengali='অঞ্চল সম্পাদন করুন'
                        />
                    </Button>
                </Box>
            </Stack>
        </PageCard>
    );
}