import { AppBar, Stack, Typography, Box, Button, Avatar } from "@mui/material";
import { navigate } from "wouter/use-browser-location";
import config from "../../config";
import LanguageSelector from "../../utils/LanguageSelector";
import PublicIcon from '@mui/icons-material/Public';

export default function HeaderBar(): JSX.Element {
    return (
        <AppBar sx={{ marginBottom: '2rem'}} position='static'>
            <Stack
                paddingLeft='2rem'
                paddingRight='2rem'
                margin='auto'
                width='100%'
                maxWidth='50em'
                justifyContent='space-between'
                direction='row'
                alignItems='center'
            >
                <Stack direction='row' alignItems='center'>
                    <Typography
                        sx={{ cursor: 'pointer' }}
                        variant='h6'
                        onClick={() => navigate(`${config.basePath}/`)}
                    >
                        iArsenic
                    </Typography>
                    <Button
                        variant='outlined'
                        startIcon={<PublicIcon sx={{ color: 'whitesmoke' }} />}
                        onClick={() => navigate(`${config.basePath}/map`)}
                    >
                    </Button>
                </Stack>

                <Box>
                    <Button
                        sx={{ marginRight: '1rem' }}
                        startIcon={
                            <Avatar
                                sx={{ height: '100%', width: '4rem', borderRadius: '8px'}}
                                src={`${config.basePath}/british.png`}
                            />
                        }
                        onClick={() => LanguageSelector.set('english')}
                    />

                    <Button
                        startIcon={
                            <Avatar
                                sx={{ height: '100%', width: '4rem', borderRadius: '8px'}}
                                src={`${config.basePath}/bangladesh.jpg`}
                            />
                        }
                        onClick={() => LanguageSelector.set('bengali')}
                    />
                </Box>
            </Stack>
        </AppBar>
    )
}