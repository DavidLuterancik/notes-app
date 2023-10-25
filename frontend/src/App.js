import { CssBaseline } from '@mui/material'
import './App.css'
import NotesList from './containers/NotesList'
import { Provider } from 'react-redux'
import { store } from './store'

function App() {
    return (
        <Provider store={store}>
            <CssBaseline>
                <NotesList />
            </CssBaseline>
        </Provider>
    )
}

export default App
