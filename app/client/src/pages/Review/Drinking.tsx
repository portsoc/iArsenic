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
                <Typography variant="h6" gutterBottom>Well In Use</Typography>
                <Typography variant="body1" component="p">
                    Well in use: {well.wellInUse ? 'Yes' : 'No'}
                </Typography>

                <Box display="flex" justifyContent="center" mt={2}>
                    <Button
                        sx={{ width: '80%', height: '3rem' }}
                        variant="outlined"
                        onClick={() => {
                            navigate(`/well/${well.id}/well-in-use`);
                        }}
                    >
                        Edit Well In Use
                    </Button>
                </Box>
            </Stack>
        </PageCard>
    );
}