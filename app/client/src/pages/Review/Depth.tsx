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
            <Typography variant="h6" gutterBottom>Depth</Typography>
            <Typography variant="body1" component="p">
                Depth: {well.depth} meters
            </Typography>

            <Box display="flex" justifyContent="center" mt={2}>
                <Button
                    sx={{ width: '80%', height: '3rem' }}
                    variant="outlined"
                    onClick={() => {
                        navigate(`/well/${well.id}/depth`);
                    }}
                >
                    Edit Depth
                </Button>
            </Box>
        </Card>
    )
}