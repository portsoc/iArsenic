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
                    bengali='নল্কুপের গভীরতা'
                />
                
                <TranslatableText 
                    variant="body1" 
                    english={<>
                        <strong>Depth</strong> {(well.depth as number * 3.281).toFixed(0)} ft ({well.depth} meters)
                    </>}
                    bengali={<>
                        <strong>গভীরতা</strong> {(well.depth as number * 3.281).toFixed(0)} ফুট ({well.depth} মিটার)
                    </>} // chatgpt generated
                />


                <Box display="flex" justifyContent="center" mt={4}>
                    <Button
                        sx={{ width: '80%', height: '3rem' }}
                        variant="outlined"
                        onClick={() => {
                            navigate(`/well/${well.id}/depth?returnToReview=true`);
                        }}
                    >
                        <TranslatableText 
                            variant="body1" 
                            english='Edit Depth'
                            bengali='গভীরতা সম্পাদন করুন'
                        />
                    </Button>
                </Box>
            </Stack>
        </PageCard>
    );
}