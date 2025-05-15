import { Box, Button, Stack } from "@mui/material";
import { Well } from "iarsenic-types";
import { navigate } from "wouter/use-browser-location";
import PageCard from "../../components/PageCard";
import TranslatableText from "../../components/TranslatableText";

interface props {
    well: Well;
}

export default function({ well }: props) {
    return (
        <PageCard>
            <Stack width='100%'>
                <TranslatableText 
                    variant="h6"
                    mb='1rem'
                    english='Well In Use'
                    bengali='BENGALI PLACEHOLDER'
                />

                <TranslatableText 
                    variant="body1" 
                    english={`Well in use: ${well.wellInUse ? 'Yes' : 'No'}`}
                    bengali='BENGALI PLACEHOLDER'
                />

                <Box display="flex" justifyContent="center" mt={4}>
                    <Button
                        sx={{ width: '80%', height: '3rem' }}
                        variant="outlined"
                        onClick={() => {
                            navigate(`/well/${well.id}/well-in-use`);
                        }}
                    >
                        <TranslatableText 
                            variant="body1" 
                            english='Edit Well In Use'
                            bengali='BENGALI PLACEHOLDER'
                        />
                    </Button>
                </Box>
            </Stack>
        </PageCard>
    );
}