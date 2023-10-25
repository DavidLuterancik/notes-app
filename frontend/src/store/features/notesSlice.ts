import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { NoteProps } from '../../components/Note'

interface NotesState {
    notes: NoteProps[]
}

const initialState: NotesState = {
    notes: [],
}

export const NotesSlice = createSlice({
    name: 'notes',
    initialState,
    reducers: {
        setReduxNotes: (state, action: PayloadAction<NoteProps[]>) => {
            state.notes = action.payload
        },
        addReduxNote: (state, action: PayloadAction<NoteProps>) => {
            state.notes.push(action.payload)
        },
        removeReduxNote: (state, action: PayloadAction<string>) => {
            state.notes = state.notes.filter(note => note.id !== action.payload)
        },
    },
})

export default NotesSlice.reducer
export const { setReduxNotes, addReduxNote, removeReduxNote } = NotesSlice.actions
