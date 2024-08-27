import { Route, Router, Switch } from 'wouter';
import { createTheme } from '@mui/material/styles';
import { Stack, ThemeProvider } from '@mui/material';
import {
    Briefing,
    Depth,
    Landing,
    Region,
    Review,
    Staining,
    StainingGuide,
    Result,
    Flooding,
    PrivacyPolicy,
    Splash,
    Map,
    Login,
    ForgotPassword,
    SignUp,
    MyWells,
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
                    {/* Splash Page */}
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
                            <Route path='/my-wells' component={MyWells} />
                            <Route path='/sign-up' component={SignUp} />
                            <Route path='/forgot-password' component={ForgotPassword} />
                            <Route path='/login' component={Login} />
                            <Route path='/landing' component={Landing} />
                            <Route path='/briefing' component={Briefing} />
                            <Route path='/depth' component={Depth} />
                            <Route path='/flooding' component={Flooding} />
                            <Route path='/privacy-policy' component={PrivacyPolicy} />
                            <Route path='/region' component={Region} />
                            <Route path='/result' component={Result} />
                            <Route path='/review' component={Review} />
                            <Route path='/staining-guide' component={StainingGuide} />
                            <Route path='/staining' component={Staining} />
                        </Stack>
                    </Route>
                </Switch>
            </Router>
        </ThemeProvider>
    );
}

export default App;
