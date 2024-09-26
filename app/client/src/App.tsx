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
    Profile,
    Region,
    Result,
    Review,
    SignUp,
    Splash,
    Staining,
    StainingGuide,
    VerifyEmail,
    Well,
} from './pages';
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

            <Router>
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
                            <Route path='/:id/depth' component={Depth} />
                            <Route path='/:id/flooding' component={Flooding} />
                            <Route path='/:id/forgot-password' component={ForgotPassword} />
                            <Route path='/:id/region' component={Region} />
                            <Route path='/:id/result' component={Result} />
                            <Route path='/:id/review' component={Review} />
                            <Route path='/:id/staining' component={Staining} />
                            <Route path='/briefing' component={Briefing} />
                            <Route path='/landing' component={Landing} />
                            <Route path='/login' component={Login} />
                            <Route path='/my-wells' component={MyWells} />
                            <Route path='/privacy-policy' component={PrivacyPolicy} />
                            <Route path='/profile' component={Profile} />
                            <Route path='/sign-up' component={SignUp} />
                            <Route path='/staining-guide' component={StainingGuide} />
                            <Route path='/well/:id' component={Well} />
                            <Route path='/verify-email/:id' component={VerifyEmail} />
                        </Stack>
                    </Route>
                </Switch>
            </Router>
        </ThemeProvider>
    );
}

export default App;
