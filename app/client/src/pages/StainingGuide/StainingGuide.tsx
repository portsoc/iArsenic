import { Box, Button, Card } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TranslatableText from "../../components/TranslatableText";

export default function StainingGuide(): JSX.Element {
    return (
        <>
            <TranslatableText 
                variant='h4'
                english='Staining Guide'
                bengali='BENGALI PLACEHOLDER'
            />

            <Button
                variant='outlined'
                startIcon={<ArrowBackIcon />}
                sx={{ alignSelf: 'start' }}
                onClick={() => window.history.back()}
            >
                <TranslatableText 
                    variant='body1'
                    english='Return'
                    bengali='BENGALI PLACEHOLDER'
                />
            </Button>

            <Card variant='outlined' sx={{ margin: '0 1rem 1rem 1rem', padding: '1rem'}}>
                <TranslatableText 
                    variant='body1'
                    english={`The staining on a tube well platform and/or
                        domestic utensils is an indication of
                        the underlying geology and redox condition.
                        This guide describes the differences between
                        red and black staining to assist you in
                        identifying any staining on a given tube well.
                    `}
                    bengali='BENGALI PLACEHOLDER'
                />
            </Card>

            <Card variant='outlined' sx={{ margin: '0 1rem 1rem 1rem', padding: '1rem'}}>
                <TranslatableText 
                    mb='1rem'
                    textAlign='center' 
                    variant='h5'
                    english='Red Staining'
                    bengali='BENGALI PLACEHOLDER'
                />

                <TranslatableText 
                    mb='1rem'
                    textAlign='center' 
                    variant='body1'
                    english={`
                        Red staining is associated with iron reduction
                        that may lead to the release of arsenic and
                        will likely indicate unsafe drinking-water,
                        particularly for shallow wells.
                    `}
                    bengali='BENGALI PLACEHOLDER'
                />

                <Box mb={1}>
                    <img width='100%' src={`/red_platform_1.jpg`}></img>
                </Box>

                <TranslatableText
                    variant='body1'
                    textAlign='center'
                    fontStyle='italic'
                    english='Example of a tube well platform with red staining.'
                    bengali='BENGALI PLACEHOLDER'
                />
            </Card>

            <Card variant='outlined' sx={{ margin: '0 1rem 1rem 1rem', padding: '1rem'}}>
                <TranslatableText
                    mb='1rem' 
                    textAlign='center' 
                    variant='h5'
                    english='Black Staining'
                    bengali='BENGALI PLACEHOLDER'
                />

                <TranslatableText
                    variant='body1'
                    mb='1rem'
                    english={`
                        Black staining is associated with manganese reduction
                        and will likely indicate safe drinking-water; any
                        arsenic released due to manganese reduction will
                        be absorbed back into the unreduced iron.
                    `}
                    bengali='BENGALI PLACEHOLDER'
                />

                <Box mb={1}>
                    <img width='100%' src={`/black_platform_1.jpg`}></img>
                </Box>

                <TranslatableText
                    variant='body1'
                    textAlign='center'
                    fontStyle='italic'
                    english='Example of a tube well platform with black staining.'
                    bengali='BENGALI PLACEHOLDER'
                />
            </Card>

            <Button
                sx={{ width: '90%', height: '4rem', marginTop: '2rem'}}
                variant='contained'
                onClick={() => window.history.back()}
            >
                <TranslatableText
                    variant='body1'
                    textAlign='center'
                    fontStyle='italic'
                    english='Return'
                    bengali='BENGALI PLACEHOLDER'
                />
            </Button>
        </>
    );
}
