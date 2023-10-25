import { configureStore } from '@reduxjs/toolkit'
import { NotesSlice } from './store/features/notesSlice'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

export const store = configureStore({
    reducer: {
        notes: NotesSlice.reducer,
    },
})

export const useAppDispatch: () => typeof store.dispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<ReturnType<typeof store.getState>>=useSelector;

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
