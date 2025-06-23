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
                    english='Flooding'
                    bengali='বন্যা'
                />

                <TranslatableText 
                    variant="body1" 
                    english={
                        <>
                            <strong>Flooding</strong> {well.flooding ? 'Yes' : 'No'}
                        </>
                    }
                    bengali={
                        <>
                            <strong>কলতলা বন্যাপ্রবণ</strong> {well.flooding ? 'হ্যাঁ' : 'না'}
                        </>
                    }
                />

                <Box display="flex" justifyContent="center" mt={4}>
                    <Button
                        sx={{ width: '80%', height: '3rem' }}
                        variant="outlined"
                        onClick={() => {
                            navigate(`/well/${well.id}/flooding?returnToReview=true`);
                        }}
                    >
                        <TranslatableText 
                            variant="body1" 
                            english='Edit Flooding'
                            bengali='বন্যা তথ্য পরিবর্তন করুন'
                        />
                    </Button>
                </Box>
            </Stack>
        </PageCard>
    );
}
