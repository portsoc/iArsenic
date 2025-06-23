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
                    bengali='নলকূপের ব্যবহার'
                />

                <TranslatableText 
                    variant="body1" 
                    english={
                        <>
                            <strong>Well in use</strong> {well.wellInUse ? 'Yes' : 'No'}
                        </>
                    }
                    bengali={
                        <>
                            <strong>এই নলকূপ দিয়ে পানি খাওয়া বা রান্না করা হয়</strong> {well.wellInUse ? 'হ্যাঁ' : 'না'}
                        </>
                    }
                />

                <Box display="flex" justifyContent="center" mt={4}>
                    <Button
                        sx={{ width: '80%', height: '3rem' }}
                        variant="outlined"
                        onClick={() => {
                            navigate(`/well/${well.id}/well-in-use?returnToReview=true`);
                        }}
                    >
                        <TranslatableText 
                            variant="body1" 
                            english='Edit Well In Use'
                            bengali='ব্যবহার তথ্য সম্পাদন করুন'
                        />
                    </Button>
                </Box>
            </Stack>
        </PageCard>
    );
}
