import { Box, Button, Card, Typography } from "@mui/material";
import { Well } from "iarsenic-types";
import { navigate } from "wouter/use-browser-location";

interface props {
    well: Well;
}

export default function({ well }: props) {
    return (
        <Card
            variant="outlined"
            sx={{
                width: '100%',
                padding: '16px',
                marginBottom: '16px',
            }}
        >
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
        </Card>
    );
}