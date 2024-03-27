import './App.css'
import { Route, Router } from 'wouter'
import { createTheme } from '@mui/material/styles'
import { ThemeProvider } from '@mui/material'
import {
    Briefing,
    Depth,
    Landing,
    Region,
    Review,
    Staining,
    StainingGuide,
} from './pages'

const Theme = {
    theme: createTheme({
        palette: {
            primary: {
                main: '#f00'
            }
        }
    })
}

function App() {
    return (
        <ThemeProvider theme={Theme.theme}>
            <Router base='/iarsenic-staging/us-central1/app'>
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
