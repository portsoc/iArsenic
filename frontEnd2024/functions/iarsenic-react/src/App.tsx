import { Route, Router } from 'wouter';
import { createTheme } from '@mui/material/styles';
import { AppBar, Avatar, Box, Button, Stack, ThemeProvider, Typography } from '@mui/material';
import {
    Briefing,
    Depth,
    Landing,
    Region,
    Review,
    Staining,
    StainingGuide,
    Result,
    PrivacyPolicy,
} from './pages';
import config from './config';
import { navigate } from 'wouter/use-browser-location';
import LanguageSelector from './utils/LanguageSelector';

const Theme = {
    theme: createTheme({
        palette: {
            primary: {
                main: '#154734'
            }
        }
    })
};

LanguageSelector.init();

function App() {
    return (
        <ThemeProvider theme={Theme.theme}>
            <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/icon?family=Material+Icons"
            />

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
                    <Typography
                        sx={{ cursor: 'pointer' }}
                        variant='h6'
                        onClick={() => navigate(config.basePath)}
                    >
                        iArsenic
                    </Typography>

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

            <Stack
                maxHeight={'min-content'}
                maxWidth={'30rem'}
                margin='auto'
                spacing={4}
                direction='column'
                marginBottom='2rem'
                alignItems='center'
            >
                <Router base={config.basePath}>
                    <Route path='/' component={Landing}/>
                    <Route path='/briefing' component={Briefing}/>
                    <Route path='/depth' component={Depth}/>
                    <Route path='/region' component={Region}/>
                    <Route path='/review' component={Review}/>
                    <Route path='/staining' component={Staining}/>
                    <Route path='/staining-guide' component={StainingGuide}/>
                    <Route path='/result' component={Result}/>
                    <Route path='/privacy-policy' component={PrivacyPolicy}/>
                </Router>
            </Stack>
        </ThemeProvider>
    );
}

export default App;
