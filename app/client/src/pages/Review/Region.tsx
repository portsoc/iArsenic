import { Box, Button, Stack } from "@mui/material";
import { Well } from "iarsenic-types";
import { navigate } from "wouter/use-browser-location";
import PageCard from "../../components/PageCard";
import TranslatableText from "../../components/TranslatableText";

interface props {
    well: Well;
}

export default function({ well }: props) {
    if (!well?.division) {
        throw new Error('Missing reion');
    }

    return (
        <PageCard>
            <Stack width='100%'>
                <TranslatableText
                    variant="h6"
                    mb='1rem'
                    english='Region'
                    bengali='BENGALI PLACEHOLDER'
                />

                <TranslatableText
                    variant="body1"
                    english={`Division: ${well.division}`}
                    bengali='BENGALI PLACEHOLDER'
                />

                <TranslatableText
                    variant="body1"
                    english={`District: ${well.district}`}
                    bengali='BENGALI PLACEHOLDER'
                />

                <TranslatableText
                    variant="body1"
                    english={`Upazila: ${well.upazila}`}
                    bengali='BENGALI PLACEHOLDER'
                />

                <TranslatableText
                    variant="body1"
                    english={`Union: ${well.union}`}
                    bengali='BENGALI PLACEHOLDER'
                />

                <TranslatableText
                    variant="body1"
                    english={`Mouza: ${well.mouza}`}
                    bengali='BENGALI PLACEHOLDER'
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
                            bengali='BENGALI PLACEHOLDER'
                        />
                    </Button>
                </Box>
            </Stack>
        </PageCard>
    );
}