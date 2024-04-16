import { Button, Card, List, ListItem, Typography } from "@mui/material";
import { navigate } from "wouter/use-browser-location";
import config from "../../config";

export default function Briefing(): JSX.Element {
    return (
        <>
            <Typography marginBottom='1rem' textAlign='center' variant='h4'>Debriefing</Typography>

            <Card variant='outlined' sx={{ margin: '0 1rem 1rem 1rem', padding: '1rem'}}>
                <Typography variant='body1'>
                    To produce an estimate, the following information is required:
                </Typography>
                <List>
                    <ListItem>
                        <Typography variant='body1'>• The administrative region of the well</Typography>
                    </ListItem>
                    <ListItem>
                        <Typography variant='body1'>• The colour of any staining on the well</Typography>
                    </ListItem>
                    <ListItem>
                        <Typography variant='body1'>• The depth of the well</Typography>
                    </ListItem>
                </List>
            </Card>

            <Card variant='outlined' sx={{ margin: '0 1rem 1rem 1rem', padding: '1rem'}}>
                <Typography variant='body1'>
                    We collect limited anonymous data about your prediction. To see our data policy click here.
                </Typography>
            </Card>

            <Button
                sx={{ width: '90%', height: '4rem' }}
                variant='contained'
                onClick={() => navigate(`${config.basePath}/region`)}
            >
                Produce Estimate
            </Button>
        </>
    )
}