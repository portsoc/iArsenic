import { Route, Router } from 'wouter'
import { createTheme } from '@mui/material/styles'
import { AppBar, Avatar, Box, Button, Container, Icon, IconButton, Stack, ThemeProvider, Toolbar, Typography } from '@mui/material'
import {
    Briefing,
    Depth,
    Landing,
    Region,
    Review,
    Staining,
    StainingGuide,
} from './pages'
import config from './config'

const Theme = {
    theme: createTheme({
        palette: {
            primary: {
                main: '#154734'
            }
        }
    })
}

function App() {
    return (
        <ThemeProvider theme={Theme.theme}>
            <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/icon?family=Material+Icons"
            />

            <AppBar sx={{ marginBottom: '2rem'}} position='static'>
                <Stack paddingLeft='2rem' paddingRight='2rem' margin='auto' width='100%' maxWidth='50em' justifyContent='space-between' direction='row' alignItems='center'>
                    <Typography variant='h6'>iArsenic</Typography>

                    <Box>
                        <Button
                            sx={{ marginRight: '1rem' }}
                            startIcon={
                                <Avatar
                                    sx={{ height: '100%', width: '4rem', borderRadius: '8px'}}
                                    src={`${config.basePath}/british.png`}
                                />
                            }
                        />

                        <Button
                            startIcon={
                                <Avatar
                                    sx={{ height: '100%', width: '4rem', borderRadius: '8px'}}
                                    src={`${config.basePath}/bangladesh.jpg`}
                                />
                            }
                        />
                    </Box>
                </Stack>
            </AppBar>

            <Router base={config.basePath}>
                <Route path='/' component={Landing}/>
                <Route path='/briefing' component={Briefing}/>
                <Route path='/depth' component={Depth}/>
                <Route path='/region' component={Region}/>
                <Route path='/review' component={Review}/>
                <Route path='/staining' component={Staining}/>
                <Route path='/staining-guide' component={StainingGuide}/>
            </Router>
        </ThemeProvider>
    )
}

export default App
