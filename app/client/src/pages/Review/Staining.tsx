import { Box, Button, Stack, Typography } from "@mui/material";
import { Well } from "iarsenic-types";
import { navigate } from "wouter/use-browser-location";
import PageCard from "../../components/PageCard";

interface props {
    well: Well;
}

export default function({ well }: props) {
    return (
        <PageCard>
            <Stack width='100%'>
                <Typography variant="h6" gutterBottom>Staining</Typography>
                <Typography variant="body1" component="p" gutterBottom>
                    Staining: {well.staining}
                </Typography>

                {well.utensilStaining && (
                    <Typography variant="body1" component="p" gutterBottom>
                        Utensil Staining: {well.utensilStaining}
                    </Typography>
                )}

                <Box display="flex" justifyContent="center" mt={2}>
                    <Button
                        sx={{ width: '80%', height: '3rem' }}
                        variant="outlined"
                        onClick={() => {
                            navigate(`/well/${well.id}/staining`);
                        }}
                    >
                        Edit Staining
                    </Button>
                </Box>
            </Stack>
        </PageCard>
    );
}