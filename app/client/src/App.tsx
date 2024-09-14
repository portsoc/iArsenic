import { Route, Router, Switch } from 'wouter';
import { createTheme } from '@mui/material/styles';
import { Stack, ThemeProvider } from '@mui/material';
import {
    Briefing,
    Depth,
    Flooding,
    ForgotPassword,
    Landing,
    Login,
    Map,
    MyWells,
    PrivacyPolicy,
    Region,
    Result,
    Review,
    SignUp,
    Splash,
    Staining,
    StainingGuide,
    Well,
} from './pages';
import config from './config';
import LanguageSelector from './utils/LanguageSelector';

import { HeaderBar } from './components';

const Theme = {
    theme: createTheme({
        palette: {
            primary: {
                main: '#154734',
                dark: '#0b2c1f',
            },
            secondary: {
                main: '#f5f5f5',
                dark: '#626262',
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

            <Router base={config.basePath}>
                <Switch>
                    {/* Splash & Map Page */}
                    <Route path='/' component={Splash} />
                    <Route path='/map' component={Map} />
                    {/* App Pages with HeaderBar and Stack layout */}
                    <Route>
                        <HeaderBar />
                        <Stack
                            maxHeight='min-content'
                            maxWidth='30rem'
                            margin='auto'
                            spacing={4}
                            direction='column'
                            marginBottom='2rem'
                            alignItems='center'
                        >
                            <Route path='/briefing' component={Briefing} />
                            <Route path='/depth' component={Depth} />
                            <Route path='/flooding' component={Flooding} />
                            <Route path='/forgot-password' component={ForgotPassword} />
                            <Route path='/landing' component={Landing} />
                            <Route path='/login' component={Login} />
                            <Route path='/my-wells' component={MyWells} />
                            <Route path='/privacy-policy' component={PrivacyPolicy} />
                            <Route path='/:id/region' component={Region} />
                            <Route path='/:id/result' component={Result} />
                            <Route path='/:id/review' component={Review} />
                            <Route path='/sign-up' component={SignUp} />
                            <Route path='/staining-guide' component={StainingGuide} />
                            <Route path='/:id/staining' component={Staining} />
                            <Route path='/well/:id' component={Well} />
                        </Stack>
                    </Route>
                </Switch>
            </Router>
        </ThemeProvider>
    );
}

export default App;
