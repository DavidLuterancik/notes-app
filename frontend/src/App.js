import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import NotesList from './containers/NotesList'
import { Provider } from 'react-redux'
import { store } from './store'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

const theme = createTheme({
    palette: {
        background: {
            default: '#f3f3f3',
        },
    },
    components: {
        MuiCardContent: {
            styleOverrides: {
                root: {
                    minHeight: '260px',
                },
            },
        },
    },
})

function App() {
    return (
        <ThemeProvider theme={theme}>
            <Provider store={store}>
                <CssBaseline>
                    <NotesList />
                </CssBaseline>
            </Provider>
        </ThemeProvider>
    )
}

export default App
