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
                    english='Staining'
                    bengali='দাগ'
                />

                <TranslatableText
                    variant="body1"
                    english={
                        <>
                            <strong>Staining</strong> {
                                (well.staining as string).charAt(0).toUpperCase() + 
                                (well.staining as string).slice(1)
                            }
                        </>
                    }
                    bengali={
                        (() => {
                            const value = (() => {
                                if (well.staining === 'red') return 'লালচে দাগ';
                                if (well.staining === 'black') return 'কালো দাগ';
                                if (well.staining === 'not sure') return 'নিশ্চিত না';
                                if (!well.staining) return '';
                                return well.staining; // fallback
                            })();
                            return (
                                <>
                                    <strong>দাগ</strong> {value}
                                </>
                            );
                        })()
                    } // values chatgpt generated
                />

                {well.utensilStaining && (
                    <TranslatableText
                        variant="body1" 
                        english={<>
                            <strong>Utensil Staining</strong> {well.utensilStaining}
                        </>}
                        bengali={
                            (() => {
                                const value = (() => {
                                    if (well.utensilStaining === 'red') return 'লালচে দাগ';
                                    if (well.utensilStaining === 'black') return 'কালো দাগ';
                                    if (well.utensilStaining === undefined) return '';
                                    return well.utensilStaining; // fallback
                                })();
                                return (
                                    <>
                                        <strong>হাড়ি-পাতিলের দাগ</strong> {value}
                                    </>
                                );
                            })()
                        } // values chatgpt generated
                    />
                )}

                <Box display="flex" justifyContent="center" mt={4}>
                    <Button
                        sx={{ width: '80%', height: '3rem' }}
                        variant="outlined"
                        onClick={() => {
                            navigate(`/well/${well.id}/staining?returnToReview=true`);
                        }}
                    >
                        <TranslatableText
                            variant="body1" 
                            english='Edit Staining'
                            bengali='দাগ সংশোধন করুন'
                        />
                    </Button>
                </Box>
            </Stack>
        </PageCard>
    );
}