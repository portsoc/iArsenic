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
    PhotoUpload,
    PrivacyPolicy,
    Profile,
    Region,
    ResetPassword,
    Result,
    Review,
    SelectRegion,
    SignUp,
    Splash,
    Staining,
    StainingGuide,
    UnderstandingRisk,
    VerifyEmail,
    Well,
    WellInUse,
} from './pages';

import { HeaderBar } from './components';
import { useEffect } from 'react';
import { useLanguage } from './utils/useLanguage';

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

function App() {
    const { init } = useLanguage();

    useEffect(() => {
        init();
    }, [init]);

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
                            <Route path='/briefing' component={Briefing} />
                            <Route path='/forgot-password' component={ForgotPassword} />
                            <Route path='/landing' component={Landing} />
                            <Route path='/login' component={Login} />
                            <Route path='/my-wells' component={MyWells} />
                            <Route path='/privacy-policy' component={PrivacyPolicy} />
                            <Route path='/profile' component={Profile} />
                            <Route path='/reset-password/:id' component={ResetPassword} />
                            <Route path='/sign-up' component={SignUp} />
                            <Route path='/staining-guide' component={StainingGuide} />
                            <Route path='/understanding-risk' component={UnderstandingRisk} />
                            <Route path='/verify-email/:id' component={VerifyEmail} />
                            <Route path='/well/:id' component={Well} />
                            <Route path='/well/:id/depth' component={Depth} />
                            <Route path='/well/:id/flooding' component={Flooding} />
                            <Route path='/well/:id/upload-image' component={PhotoUpload} />
                            <Route path='/well/:id/region' component={Region} />
                            <Route path='/well/:id/result' component={Result} />
                            <Route path='/well/:id/review' component={Review} />
                            <Route path='/well/:id/select-region' component={SelectRegion} />
                            <Route path='/well/:id/staining' component={Staining} />
                            <Route path='/well/:id/well-in-use' component={WellInUse} />
                        </Stack>
                    </Route>
                </Switch>
            </Router>
        </ThemeProvider>
    );
}

export default App;
