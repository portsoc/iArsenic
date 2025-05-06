import { AppBar, Stack, Typography, Box, Button, IconButton } from '@mui/material';
import { navigate } from 'wouter/use-browser-location';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';

import NavMenu from './NavMenu';
import { useAccessToken, deleteAccessToken } from '../../utils/useAccessToken';

export default function HeaderBar(): JSX.Element {
    const [open, setOpen] = useState(false);
    const { data: token } = useAccessToken();
    const user = token?.user;

    return (
        <AppBar sx={{ marginBottom: '2rem', height: '3rem' }} position='static'>
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
                        role={user?.type}
                    />

                    <Typography
                        sx={{ cursor: 'pointer' }}
                        variant='h6'
                        onClick={() => navigate(`/`)}
                    >
                        iArsenic
                    </Typography>
                </Stack>

                <Box>
                    {user ? (
                        <Button
                            variant='outlined'
                            sx={{ padding: '8px', minWidth: 'auto', color: 'whitesmoke', borderColor: 'whitesmoke' }}
                            onClick={() => {
                                deleteAccessToken();
                                navigate(`/`);
                                window.location.reload(); // optional if you want to reset app state
                            }}
                        >
                            Logout
                        </Button>
                    ) : (
                        <Button
                            variant='outlined'
                            sx={{ padding: '8px', minWidth: 'auto', color: 'whitesmoke', borderColor: 'whitesmoke' }}
                            onClick={() => navigate('/login')}
                        >
                            Login
                        </Button>
                    )}
                </Box>
            </Stack>
        </AppBar>
    );
}
