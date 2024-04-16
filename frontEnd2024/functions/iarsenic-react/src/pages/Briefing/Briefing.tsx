import { Button, Card, List, ListItem, Typography } from "@mui/material";
import { navigate } from "wouter/use-browser-location";
import config from "../../config";

export default function Briefing(): JSX.Element {
    return (
        <>
            <Typography
                className='english'
                marginBottom='1rem'
                textAlign='center'
                variant='h4'
            >
                    Debriefing
            </Typography>

            <Typography
                className='bengali'
                marginBottom='1rem'
                textAlign='center'
                variant='h4'
            >
                PLACEHOLDER BENGALI
            </Typography>

            <Card variant='outlined' sx={{ margin: '0 1rem 1rem 1rem', padding: '1rem'}}>
                <Typography className='english' variant='body1'>
                    To produce an estimate, the following information is required:
                </Typography>

                <Typography className='bengali' variant='body1'>
                    PLACEHOLDER BENGALI
                </Typography>
                <List>
                    <ListItem>
                        <Typography className='english' variant='body1'>
                            • The administrative region of the well
                        </Typography>

                        <Typography className='bengali' variant='body1'>
                            PLACEHOLDER BENGALI
                        </Typography>
                    </ListItem>
                    <ListItem>
                        <Typography className='english' variant='body1'>
                            • The colour of any staining on the well
                        </Typography>

                        <Typography className='bengali' variant='body1'>
                            PLACEHOLDER BENGALI
                        </Typography>
                    </ListItem>
                    <ListItem>
                        <Typography className='english' variant='body1'>
                            • The depth of the well
                        </Typography>

                        <Typography className='bengali' variant='body1'>
                            PLACEHOLDER BENGALI
                        </Typography>
                    </ListItem>
                </List>
            </Card>

            <Card variant='outlined' sx={{ margin: '0 1rem 1rem 1rem', padding: '1rem'}}>
                <Typography className='english' variant='body1'>
                    We collect limited anonymous data about your prediction. To see our data policy click here.
                </Typography>

                <Typography className='bengali' variant='body1'>
                    PLACEHOLDER BENGALI
                </Typography>
            </Card>

            <Button
                sx={{ width: '90%', height: '4rem' }}
                variant='contained'
                onClick={() => navigate(`${config.basePath}/region`)}
            >
                <Typography className='english'>Produce Estimate</Typography>
                <Typography className='bengali'>PLACEHOLDER BENGALI</Typography>
            </Button>
        </>
    )
}