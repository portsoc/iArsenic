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
                    gutterBottom
                    english='Depth'
                    bengali='PLACEHOLDER BENGALI'
                />
                <TranslatableText 
                    variant="body1" 
                    english={`Depth: ${well.depth} meters`}
                    bengali='PLACEHOLDER BENGALI'
                />

                <Box display="flex" justifyContent="center" mt={4}>
                    <Button
                        sx={{ width: '80%', height: '3rem' }}
                        variant="outlined"
                        onClick={() => {
                            navigate(`/well/${well.id}/depth`);
                        }}
                    >
                        <TranslatableText 
                            variant="body1" 
                            english='Edit Depth'
                            bengali='PLACEHOLDER BENGALI'
                        />
                    </Button>
                </Box>
            </Stack>
        </PageCard>
    );
}