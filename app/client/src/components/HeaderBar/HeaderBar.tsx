import { AppBar, Stack, Typography, Box, Button, Avatar, IconButton } from '@mui/material';
import { navigate } from 'wouter/use-browser-location';
import config from '../../config';
import LanguageSelector from '../../utils/LanguageSelector';
import LoginIcon from '@mui/icons-material/Login';

import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import NavMenu from './NavMenu';

export default function HeaderBar(): JSX.Element {
    const [open, setOpen] = useState(false);

    return (
        <AppBar sx={{ marginBottom: '2rem' }} position='static'>
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
                    <IconButton
                        color='inherit'
                        aria-label='open drawer'
                        onClick={() => setOpen(true)}
                        edge='start'
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <NavMenu
                        open={open}
                        setOpen={setOpen}
                    />

                    <Typography
                        sx={{ cursor: 'pointer' }}
                        variant='h6'
                        onClick={() => navigate(`${config.basePath}/`)}
                    >
                        iArsenic
                    </Typography>
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

                    <Button
                        startIcon={
                            <LoginIcon sx={{
                                fontSize: '1.3rem',
                                color: 'whitesmoke',
                                }}
                            />}
                        onClick={() => navigate(`${config.basePath}/login`)}
                        sx={{ padding: '8px', minWidth: 'auto' }}
                    >
                        Login
                    </Button>
                </Box>
            </Stack>
        </AppBar>
    );
}