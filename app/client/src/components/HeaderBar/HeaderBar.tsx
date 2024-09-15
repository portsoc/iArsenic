import { AppBar, Stack, Typography, Box, Button, IconButton } from '@mui/material';
import { navigate } from 'wouter/use-browser-location';
import config from '../../config';

import MenuIcon from '@mui/icons-material/Menu';
import { useEffect, useState } from 'react';
import NavMenu from './NavMenu';
import AccessToken from '../../utils/AccessToken';
import { IAccessToken, User } from '../../../types';
import Config from '../../config';

export default function HeaderBar(): JSX.Element {
    const [open, setOpen] = useState(false);
    const [token, setToken] = useState<IAccessToken>();
    const [user, setUser] = useState<User>();

    useEffect(() => {
        async function fetchToken() {
            const token = await AccessToken.get();
            if (token == null) return;

            setToken(token);
        }

        fetchToken();
    }, []);

    useEffect(() => {
        async function fetchUser() {
            if (!token) return;

            const res = await fetch(`${Config.basePath}/api/v1/self/user`, {
                headers: {
                    'authorization': `Bearer ${token.id}`,
                }
            });

            if (!res.ok) {
                console.error('Failed to fetch user:', res);
                return;
            }

            const data = await res.json();
            setUser(data.user as User);
        }

        fetchUser();
    }, [token]);

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
                        onClick={() => navigate(`${config.basePath}/`)}
                    >
                        iArsenic
                    </Typography>
                </Stack>

                <Box>
                    {user && (
                        <Button
                            variant='outlined'
                            sx={{ padding: '8px', minWidth: 'auto', color: 'whitesmoke', borderColor: 'whitesmoke' }}
                            onClick={async () => {
                                await AccessToken.delete();
                                navigate(`${config.basePath}`);
                            }}
                        >
                            Logout
                        </Button>
                    )}

                    {!user && (
                        <Button
                            variant='outlined'
                            sx={{ padding: '8px', minWidth: 'auto', color: 'whitesmoke', borderColor: 'whitesmoke' }}
                            onClick={() => navigate(`${config.basePath}/login`)}
                        >
                            Login
                        </Button>
                    )}
                </Box>
            </Stack>
        </AppBar>
    );
}