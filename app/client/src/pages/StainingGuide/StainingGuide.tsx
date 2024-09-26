import { Box, Button, Card, Typography } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function StainingGuide(): JSX.Element {
    return (
        <>
            <Typography className='english' variant='h4'>
                Staining Guide
            </Typography>

            <Button
                variant='outlined'
                startIcon={<ArrowBackIcon />}
                sx={{ alignSelf: 'start' }}
                onClick={() => window.history.back()}
            >
                Return to Staining
            </Button>

            <Card variant='outlined' sx={{ margin: '0 1rem 1rem 1rem', padding: '1rem'}}>
                <Typography className='english' variant='body1'>
                    The staining on a tube well platform and/or
                    domestic utensils is an indication of
                    the underlying geology and redox condition.
                    This guide describes the differences between
                    red and black staining to assist you in
                    identifying any staining on a given tube well.
                </Typography>

                <Typography className='bengali' variant='body1'>
                    PLACEHOLDER BENGALI
                </Typography>
            </Card>

            <Card variant='outlined' sx={{ margin: '0 1rem 1rem 1rem', padding: '1rem'}}>
                <Typography className='english' mb={2} textAlign='center' variant='h5'>
                    Red Staining
                </Typography>

                <Typography className='bengali' mb={2} textAlign='center' variant='h5'>
                    PLACEHOLDER BENGALI
                </Typography>

                <Typography mb={2} className='english' variant='body1'>
                    Red staining is associated with iron reduction
                    that may lead to the release of arsenic and
                    will likely indicate unsafe drinking-water,
                    particularly for shallow wells.
                </Typography>

                <Box mb={1}>
                    <img width='100%' src={`/red_platform_1.jpg`}></img>
                </Box>

                <Typography
                    className='english'
                    variant='body1'
                    textAlign='center'
                    fontStyle='italic'
                >
                    Example of a tube well platform with red staining.
                </Typography>
            </Card>

            <Card variant='outlined' sx={{ margin: '0 1rem 1rem 1rem', padding: '1rem'}}>
                <Typography className='english' mb={2} textAlign='center' variant='h5'>
                    Black Staining
                </Typography>

                <Typography className='bengali' mb={2} textAlign='center' variant='h5'>
                    PLACEHOLDER BENGALI
                </Typography>

                <Typography mb={2} className='english' variant='body1'>
                    Black staining is associated with manganese reduction
                    and will likely indicate safe drinking-water; any
                    arsenic released due to manganese reduction will
                    be absorbed back into the unreduced iron.
                </Typography>

                <Box mb={1}>
                    <img width='100%' src={`/black_platform_1.jpg`}></img>
                </Box>

                <Typography
                    className='english'
                    variant='body1'
                    textAlign='center'
                    fontStyle='italic'
                >
                    Example of a tube well platform with red staining.
                </Typography>
            </Card>
        </>
    );
}
