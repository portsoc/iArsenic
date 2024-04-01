import { Route, Router } from 'wouter'
import { createTheme } from '@mui/material/styles'
import { AppBar, ThemeProvider, Toolbar, Typography } from '@mui/material'
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
            <AppBar sx={{ marginBottom: '2rem'}} position='static'>
                <Toolbar>
                    <Typography>iArsenic</Typography>
                </Toolbar>

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
