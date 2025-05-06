import { Box, Button, Card, Typography } from "@mui/material";
import { Well } from "iarsenic-types";
import { navigate } from "wouter/use-browser-location";

interface props {
    well: Well;
}

export default function({ well }: props) {
    if (!well?.division) {
        throw new Error('Missing reion');
    }

    return (
        <Card
            variant="outlined"
            sx={{
                width: '100%',
                padding: '16px',
                marginBottom: '16px',
            }}
        >
            <Typography variant="h6" gutterBottom>Region</Typography>

            <Typography variant="body1" component="p" gutterBottom>
                Division: {well.division}
            </Typography>

            <Typography variant="body1" component="p" gutterBottom>
                District: {well.district}
            </Typography>

            <Typography variant="body1" component="p" gutterBottom>
                Upazila: {well.upazila}
            </Typography>

            <Typography variant="body1" component="p" gutterBottom>
                Union: {well.union}
            </Typography>

            <Typography variant="body1" component="p" gutterBottom>
                Mouza: {well.mouza}
            </Typography>

            <Box display="flex" justifyContent="center" mt={2}>
                <Button
                    sx={{ width: '80%', height: '3rem' }}
                    variant="outlined"
                    onClick={() => {
                        navigate(`/well/${well.id}/region`);
                    }}
                >
                    Edit Region
                </Button>
            </Box>
        </Card>
    );
}