import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LocalDrinkIcon from '@mui/icons-material/LocalDrink';
import GroupsIcon from '@mui/icons-material/Groups';
import InfoIcon from '@mui/icons-material/Info';
import Box from '@mui/material/Box';
import PublicIcon from '@mui/icons-material/Public';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import Config from '../../config';
import { navigate } from 'wouter/use-browser-location';
import { SvgIconComponent } from '@mui/icons-material';
import { Avatar, Button, Stack, Typography } from '@mui/material';
import config from '../../config';
import LanguageSelector from '../../utils/LanguageSelector';

interface props {
    open: boolean;
    setOpen: (open: boolean) => void;
    role: 'admin' | 'user' | undefined;
}

function NavListItem(
    { path, text, Icon }: {
        path: string;
        text: string;
        Icon: SvgIconComponent;
    }
): JSX.Element {
    return (
        <ListItem key={path}>
            <ListItemButton
                onClick={() => navigate(`${Config.basePath}/${path}`)}
            >
                <ListItemIcon>
                    <Icon />
                </ListItemIcon>
                <ListItemText primary={text} />
            </ListItemButton>
        </ListItem>
    );
}

export default function NavMenu({ open, setOpen, role }: props): JSX.Element {
    return (
        <Drawer open={open} onClose={() => setOpen(false)}>
            <Box sx={{ width: 250 }} onClick={() => setOpen(false)}>
                {/* all users */}
                <List>
                    <NavListItem
                        path='landing'
                        text='Landing'
                        Icon={AccountCircleIcon}
                    />

                    <NavListItem
                        path='briefing'
                        text='Briefing'
                        Icon={InfoIcon}
                    />

                    <NavListItem
                        path='privacy-policy'
                        text='Privacy Policy'
                        Icon={PrivacyTipIcon}
                    />
                </List>

                {/* logged in users */}
                {role && (
                    <>
                        <Divider />
                        <List>
                            <NavListItem
                                path='my-wells'
                                text='My Wells'
                                Icon={LocalDrinkIcon}
                            />

                            <NavListItem
                                path='profile'
                                text='My Profile'
                                Icon={AccountCircleIcon}
                            />
                        </List>
                    </>
                )}

                {/* logged in admins */}
                {role === 'admin' && (
                    <>
                        <Divider />
                        <Typography variant='h6' sx={{ margin: '1rem' }}>
                            Admins Only
                        </Typography>
                        <List>
                            <NavListItem
                                path='all-users'
                                text='All Users'
                                Icon={GroupsIcon}
                            />

                            <NavListItem
                                path='all-wells'
                                text='All Wells'
                                Icon={PublicIcon}
                            />

                            <NavListItem
                                path='map'
                                text='Maps'
                                Icon={LocalDrinkIcon}
                            />
                        </List>
                    </>
                )}

                <Divider />
                <Typography variant='h6' sx={{ margin: '1rem' }}>
                    Select Language
                </Typography>

                <Stack direction='column'>
                    <Stack
                        direction='row'
                        alignItems='center'
                        ml={2}
                        columnGap={3}
                        onClick={() => LanguageSelector.set('english')}
                        sx={{ cursor: 'pointer' }}
                    >
                        <Button
                            startIcon={
                                <Avatar
                                    sx={{ height: '100%', width: '4rem', borderRadius: '8px'}}
                                    src={`${config.basePath}/british.png`}
                                />
                            }
                        />
                        <Typography>English</Typography>
                    </Stack>


                    <Stack
                        direction='row'
                        alignItems='center'
                        ml={2}
                        columnGap={3}
                        onClick={() => LanguageSelector.set('bengali')}
                        sx={{ cursor: 'pointer' }}
                    >
                        <Button
                            startIcon={
                                <Avatar
                                    sx={{ height: '100%', width: '4rem', borderRadius: '8px'}}
                                    src={`${config.basePath}/bangladesh.jpg`}
                                />
                            }
                            onClick={() => LanguageSelector.set('bengali')}
                        />
                        <Typography>বাংলা</Typography>
                    </Stack>
                </Stack>
            </Box>
        </Drawer>
    );
}