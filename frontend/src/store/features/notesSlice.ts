import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { NoteProps } from '../../components/Note'
import { categoryAll } from '../../components/CategorySelect'
interface NotesState {
    filter: {
        search: string
        category: string
        sorter: string
    }
    notes: NoteProps[]
}

const initialState: NotesState = {
    filter: {
        search: '',
        category: categoryAll,
        sorter: 'Newest',
    },
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
        editReduxNote: (
            state,
            action: PayloadAction<{ noteIndex: number; note: NoteProps }>
        ) => {
            const { noteIndex, note } = action.payload
            state.notes[noteIndex] = note
        },
        removeReduxNote: (state, action: PayloadAction<string>) => {
            state.notes = state.notes.filter(
                (note) => note.id !== action.payload
            )
        },
        setReduxFilter: (state, action: PayloadAction<any>) => {
            state.filter = action.payload
        },
    },
})

export default NotesSlice.reducer
export const {
    setReduxNotes,
    addReduxNote,
    editReduxNote,
    removeReduxNote,
    setReduxFilter,
} = NotesSlice.actions
