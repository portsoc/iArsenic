import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LocalDrinkIcon from '@mui/icons-material/LocalDrink';
import Box from '@mui/material/Box';
import PublicIcon from '@mui/icons-material/Public';
import Config from '../../config';
import { navigate } from 'wouter/use-browser-location';

interface props {
    open: boolean;
    setOpen: (open: boolean) => void;
}

export default function NavMenu({ open, setOpen}: props): JSX.Element {
    return (
        <Drawer open={open} onClose={() => setOpen(false)}>
            <Box sx={{ width: 250 }} onClick={() => setOpen(false)}>
                {/* all users */}
                <List>
                    <ListItem key='my-profile'>
                        <ListItemButton
                            onClick={() => navigate(`${Config.basePath}/profile`)}
                        >
                            <ListItemIcon>
                                <AccountCircleIcon />
                            </ListItemIcon>
                            <ListItemText primary='My Profile' />
                        </ListItemButton>
                    </ListItem>

                    <ListItem key='my-wells'>
                        <ListItemButton
                            onClick={() => navigate(`${Config.basePath}/my-wells`)}
                        >
                            <ListItemIcon>
                                <LocalDrinkIcon />
                            </ListItemIcon>
                            <ListItemText primary='My Wells' />
                        </ListItemButton>
                    </ListItem>
                </List>
                <Divider />
                {/* admin only */}
                <List>
                    <ListItem key='map'>
                        <ListItemButton
                            onClick={() => navigate(`${Config.basePath}/map`)}
                        >
                            <ListItemIcon>
                                <PublicIcon />
                            </ListItemIcon>
                            <ListItemText primary='Maps' />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Box>
        </Drawer>
    );
}